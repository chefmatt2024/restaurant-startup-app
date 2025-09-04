// External Integrations Service
// Framework for connecting with government APIs and external services

class IntegrationError extends Error {
  constructor(message, service, statusCode = null) {
    super(message);
    this.name = 'IntegrationError';
    this.service = service;
    this.statusCode = statusCode;
  }
}

// Base integration class
class BaseIntegration {
  constructor(config) {
    this.baseUrl = config.baseUrl;
    this.apiKey = config.apiKey;
    this.timeout = config.timeout || 30000;
    this.retryAttempts = config.retryAttempts || 3;
  }

  async makeRequest(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const config = {
      timeout: this.timeout,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Boston-Business-Planner/1.0',
        ...options.headers
      },
      ...options
    };

    if (this.apiKey) {
      config.headers['Authorization'] = `Bearer ${this.apiKey}`;
    }

    let lastError;
    for (let attempt = 1; attempt <= this.retryAttempts; attempt++) {
      try {
        const response = await fetch(url, config);
        
        if (!response.ok) {
          throw new IntegrationError(
            `HTTP ${response.status}: ${response.statusText}`,
            this.constructor.name,
            response.status
          );
        }
        
        return await response.json();
      } catch (error) {
        lastError = error;
        if (attempt === this.retryAttempts) break;
        
        // Exponential backoff
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
      }
    }
    
    throw lastError;
  }

  // Format business plan data for government forms
  formatForGovernment(businessPlan) {
    return {
      businessName: businessPlan.executiveSummary.businessName,
      businessType: businessPlan.executiveSummary.businessType,
      businessAddress: businessPlan.executiveSummary.businessLocation,
      ownerName: businessPlan.managementTeam.ownerName || '',
      ownerSSN: '', // Would be filled by user when actually submitting
      businessDescription: businessPlan.executiveSummary.businessDescription,
      estimatedEmployees: businessPlan.financialProjections.numberOfEmployees || 0,
      estimatedRevenue: businessPlan.financialProjections.projectedRevenue || 0,
      startDate: new Date().toISOString().split('T')[0] // Today's date as placeholder
    };
  }

  // Validate required fields for government submission
  validateSubmissionData(data, requiredFields) {
    const missing = requiredFields.filter(field => !data[field] || data[field] === '');
    if (missing.length > 0) {
      throw new IntegrationError(
        `Missing required fields: ${missing.join(', ')}`,
        this.constructor.name
      );
    }
    return true;
  }
}

// Boston City Government Integration
class BostonCityIntegration extends BaseIntegration {
  constructor() {
    super({
      baseUrl: 'https://api.boston.gov', // Placeholder - would be real API
      timeout: 45000
    });
  }

  // Submit business registration
  async submitBusinessRegistration(businessPlan) {
    const formattedData = this.formatForGovernment(businessPlan);
    
    this.validateSubmissionData(formattedData, [
      'businessName', 'businessType', 'businessAddress', 'ownerName'
    ]);

    try {
      const result = await this.makeRequest('/v1/business/register', {
        method: 'POST',
        body: JSON.stringify({
          business_name: formattedData.businessName,
          business_type: formattedData.businessType,
          address: formattedData.businessAddress,
          owner_name: formattedData.ownerName,
          description: formattedData.businessDescription,
          estimated_employees: formattedData.estimatedEmployees,
          estimated_annual_revenue: formattedData.estimatedRevenue
        })
      });

      return {
        success: true,
        registrationId: result.registration_id,
        status: result.status,
        nextSteps: result.next_steps || [],
        estimatedProcessingTime: result.processing_time || '5-10 business days'
      };
    } catch (error) {
      if (error.statusCode === 409) {
        throw new IntegrationError('Business name already registered', 'BostonCityIntegration', 409);
      }
      throw error;
    }
  }

  // Get permit requirements
  async getPermitRequirements(businessType, location) {
    try {
      const result = await this.makeRequest(`/v1/permits/requirements?business_type=${encodeURIComponent(businessType)}&location=${encodeURIComponent(location)}`);
      
      return {
        required_permits: result.permits || [],
        estimated_cost: result.total_cost || 0,
        estimated_time: result.total_processing_time || 'Unknown',
        priority_order: result.recommended_order || []
      };
    } catch (error) {
      console.error('Error fetching permit requirements:', error);
      return null;
    }
  }

  // Submit permit application
  async submitPermitApplication(permitType, businessPlan, additionalData = {}) {
    const formattedData = this.formatForGovernment(businessPlan);
    
    try {
      const result = await this.makeRequest('/v1/permits/apply', {
        method: 'POST',
        body: JSON.stringify({
          permit_type: permitType,
          ...formattedData,
          ...additionalData
        })
      });

      return {
        success: true,
        applicationId: result.application_id,
        status: result.status,
        trackingNumber: result.tracking_number,
        reviewProcess: result.review_process || {},
        requiredDocuments: result.required_documents || []
      };
    } catch (error) {
      throw error;
    }
  }

  // Check application status
  async checkApplicationStatus(applicationId) {
    try {
      const result = await this.makeRequest(`/v1/permits/status/${applicationId}`);
      
      return {
        status: result.status,
        currentStep: result.current_step,
        progress: result.progress_percentage || 0,
        lastUpdated: result.last_updated,
        estimatedCompletion: result.estimated_completion,
        actions_required: result.actions_required || []
      };
    } catch (error) {
      console.error('Error checking application status:', error);
      return null;
    }
  }
}

// Massachusetts State Government Integration
class MassachusettsStateIntegration extends BaseIntegration {
  constructor() {
    super({
      baseUrl: 'https://api.mass.gov', // Placeholder - would be real API
      timeout: 60000
    });
  }

  // Submit state business registration
  async submitStateRegistration(businessPlan, entityType = 'LLC') {
    const formattedData = this.formatForGovernment(businessPlan);
    
    this.validateSubmissionData(formattedData, [
      'businessName', 'businessAddress', 'ownerName'
    ]);

    try {
      const result = await this.makeRequest('/v1/corporations/register', {
        method: 'POST',
        body: JSON.stringify({
          entity_type: entityType,
          entity_name: formattedData.businessName,
          principal_office: formattedData.businessAddress,
          registered_agent: formattedData.ownerName,
          purpose: formattedData.businessDescription
        })
      });

      return {
        success: true,
        entityId: result.entity_id,
        certificate_number: result.certificate_number,
        filing_date: result.filing_date,
        annual_report_due: result.annual_report_due
      };
    } catch (error) {
      throw error;
    }
  }

  // Register for state taxes
  async registerForTaxes(businessPlan, taxTypes = ['sales', 'employer']) {
    const formattedData = this.formatForGovernment(businessPlan);
    
    try {
      const result = await this.makeRequest('/v1/dor/register', {
        method: 'POST',
        body: JSON.stringify({
          business_name: formattedData.businessName,
          tax_types: taxTypes,
          estimated_employees: formattedData.estimatedEmployees,
          estimated_revenue: formattedData.estimatedRevenue,
          business_description: formattedData.businessDescription
        })
      });

      return {
        success: true,
        tax_id: result.tax_id,
        registered_taxes: result.registered_taxes,
        filing_requirements: result.filing_requirements,
        next_filing_date: result.next_filing_date
      };
    } catch (error) {
      throw error;
    }
  }
}

// Federal Government Integration (IRS, SBA)
class FederalIntegration extends BaseIntegration {
  constructor() {
    super({
      baseUrl: 'https://api.irs.gov', // Placeholder - would be real API
      timeout: 90000
    });
  }

  // Apply for EIN (Employer Identification Number)
  async applyForEIN(businessPlan) {
    const formattedData = this.formatForGovernment(businessPlan);
    
    this.validateSubmissionData(formattedData, [
      'businessName', 'businessAddress', 'ownerName'
    ]);

    try {
      const result = await this.makeRequest('/v1/ein/apply', {
        method: 'POST',
        body: JSON.stringify({
          legal_name: formattedData.businessName,
          trade_name: formattedData.businessName,
          address: formattedData.businessAddress,
          responsible_party: formattedData.ownerName,
          business_purpose: formattedData.businessDescription,
          entity_type: 'LLC' // Could be dynamic based on business plan
        })
      });

      return {
        success: true,
        ein: result.ein,
        confirmation_number: result.confirmation_number,
        issue_date: result.issue_date
      };
    } catch (error) {
      throw error;
    }
  }

  // Submit SBA loan pre-qualification
  async submitSBAPrequalification(businessPlan) {
    const formattedData = this.formatForGovernment(businessPlan);
    
    try {
      const result = await this.makeRequest('/v1/sba/prequalify', {
        method: 'POST',
        body: JSON.stringify({
          business_name: formattedData.businessName,
          industry_code: this.getIndustryCode(formattedData.businessType),
          requested_amount: businessPlan.financialProjections.fundingRequest || 0,
          projected_revenue: formattedData.estimatedRevenue,
          business_plan_summary: formattedData.businessDescription
        })
      });

      return {
        success: true,
        prequalification_id: result.prequalification_id,
        eligible_programs: result.eligible_programs || [],
        estimated_approval_odds: result.approval_probability || 0,
        recommended_lenders: result.recommended_lenders || []
      };
    } catch (error) {
      throw error;
    }
  }

  getIndustryCode(businessType) {
    // NAICS codes for restaurant types
    const codes = {
      'Restaurant': '722511',
      'Fast Casual': '722513',
      'Fast Food': '722513',
      'Fine Dining': '722511',
      'Cafe': '722515',
      'Bar': '722410',
      'Food Truck': '722330'
    };
    return codes[businessType] || '722511'; // Default to full-service restaurant
  }
}

// Integration orchestrator
class IntegrationService {
  constructor() {
    this.boston = new BostonCityIntegration();
    this.massachusetts = new MassachusettsStateIntegration();
    this.federal = new FederalIntegration();
    
    // Track integration status
    this.integrationHistory = [];
  }

  // Get all required registrations in order
  async getRegistrationPlan(businessPlan) {
    const plan = [
      {
        level: 'federal',
        service: 'EIN Application',
        description: 'Apply for Federal Employer Identification Number',
        estimated_time: '1-2 weeks',
        cost: 0,
        required: true,
        order: 1
      },
      {
        level: 'state',
        service: 'Business Registration',
        description: 'Register business entity with Massachusetts',
        estimated_time: '2-3 weeks',
        cost: 520, // LLC filing fee
        required: true,
        order: 2
      },
      {
        level: 'state',
        service: 'Tax Registration',
        description: 'Register for state taxes (sales, employer)',
        estimated_time: '1 week',
        cost: 0,
        required: true,
        order: 3
      },
      {
        level: 'city',
        service: 'Business License',
        description: 'Boston business operating license',
        estimated_time: '2-4 weeks',
        cost: 75,
        required: true,
        order: 4
      }
    ];

    // Add restaurant-specific permits
    if (businessPlan.executiveSummary.businessType.toLowerCase().includes('restaurant') ||
        businessPlan.executiveSummary.businessType.toLowerCase().includes('food')) {
      plan.push(
        {
          level: 'city',
          service: 'Food Service License',
          description: 'Boston Public Health Commission food permit',
          estimated_time: '3-6 weeks',
          cost: 240,
          required: true,
          order: 5
        },
        {
          level: 'city',
          service: 'Liquor License',
          description: 'Boston Licensing Board alcohol permit (if applicable)',
          estimated_time: '3-6 months',
          cost: 2400, // Varies by license type
          required: false,
          order: 6
        }
      );
    }

    return plan.sort((a, b) => a.order - b.order);
  }

  // Execute full registration workflow
  async executeRegistrationWorkflow(businessPlan, options = {}) {
    const plan = await this.getRegistrationPlan(businessPlan);
    const results = [];
    
    for (const step of plan) {
      if (!step.required && !options.includeOptional) continue;
      
      try {
        let result;
        
        switch (step.service) {
          case 'EIN Application':
            result = await this.federal.applyForEIN(businessPlan);
            break;
          case 'Business Registration':
            result = await this.massachusetts.submitStateRegistration(businessPlan);
            break;
          case 'Tax Registration':
            result = await this.massachusetts.registerForTaxes(businessPlan);
            break;
          case 'Business License':
            result = await this.boston.submitBusinessRegistration(businessPlan);
            break;
          case 'Food Service License':
            result = await this.boston.submitPermitApplication('food_service', businessPlan);
            break;
          default:
            result = { success: false, error: 'Unknown service' };
        }
        
        results.push({
          step: step.service,
          level: step.level,
          success: result.success,
          data: result,
          timestamp: new Date().toISOString()
        });
        
        // Add delay between requests to be respectful
        await new Promise(resolve => setTimeout(resolve, 2000));
        
      } catch (error) {
        results.push({
          step: step.service,
          level: step.level,
          success: false,
          error: error.message,
          timestamp: new Date().toISOString()
        });
        
        // Continue with other steps even if one fails
        console.error(`Error in ${step.service}:`, error);
      }
    }
    
    // Save to history
    this.integrationHistory.push({
      businessName: businessPlan.executiveSummary.businessName,
      timestamp: new Date().toISOString(),
      results: results
    });
    
    return {
      overall_success: results.every(r => r.success),
      completed_steps: results.filter(r => r.success).length,
      total_steps: results.length,
      results: results
    };
  }

  // Get integration status
  getIntegrationHistory() {
    return this.integrationHistory;
  }

  // Validate if business plan has required data for government submissions
  validateBusinessPlanForSubmission(businessPlan) {
    const requiredFields = [
      'executiveSummary.businessName',
      'executiveSummary.businessType',
      'executiveSummary.businessLocation',
      'executiveSummary.businessDescription'
    ];
    
    const missing = [];
    
    requiredFields.forEach(field => {
      const value = field.split('.').reduce((obj, key) => obj?.[key], businessPlan);
      if (!value || value.trim() === '') {
        missing.push(field);
      }
    });
    
    return {
      isValid: missing.length === 0,
      missingFields: missing,
      recommendations: missing.map(field => `Complete the ${field.split('.').pop()} field in your business plan`)
    };
  }
}

// Export the integration service
export const integrationService = new IntegrationService();
export { IntegrationError, BostonCityIntegration, MassachusettsStateIntegration, FederalIntegration };

// Development mode - mock responses
if (process.env.NODE_ENV === 'development') {
  console.log('🔧 Integration Service running in development mode with mock responses');
  
  // Override methods with mock responses for development
  const originalMethods = {};
  
  [BostonCityIntegration, MassachusettsStateIntegration, FederalIntegration].forEach(IntegrationClass => {
    Object.getOwnPropertyNames(IntegrationClass.prototype).forEach(method => {
      if (method !== 'constructor' && typeof IntegrationClass.prototype[method] === 'function') {
        if (!originalMethods[IntegrationClass.name]) originalMethods[IntegrationClass.name] = {};
        originalMethods[IntegrationClass.name][method] = IntegrationClass.prototype[method];
        
        IntegrationClass.prototype[method] = async function(...args) {
          console.log(`🔄 Mock: ${IntegrationClass.name}.${method}`, args[0]?.executiveSummary?.businessName || 'unknown business');
          
          // Simulate network delay
          await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
          
          // Return mock success response
          return {
            success: true,
            mock: true,
            service: IntegrationClass.name,
            method: method,
            timestamp: new Date().toISOString(),
            // Method-specific mock data
            ...(method.includes('EIN') && { ein: '12-3456789', confirmation_number: 'EIN123456' }),
            ...(method.includes('Registration') && { registrationId: 'REG' + Date.now(), status: 'submitted' }),
            ...(method.includes('Tax') && { tax_id: 'TAX' + Date.now(), registered_taxes: ['sales', 'employer'] }),
            ...(method.includes('Permit') && { applicationId: 'PERM' + Date.now(), trackingNumber: 'TRK' + Date.now() })
          };
        };
      }
    });
  });
} 