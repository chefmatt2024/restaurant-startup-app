import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { authService, dbService, getAppId, getInitialAuthToken, getAllUsers, deleteUserAccount } from '../services/firebase';

// Action Types
export const ActionTypes = {
  // Auth actions
  SET_LOADING: 'SET_LOADING',
  SET_AUTHENTICATED: 'SET_AUTHENTICATED',
  SET_USER_ID: 'SET_USER_ID',
  SET_USER: 'SET_USER',
  
  // UI actions
  SET_ACTIVE_TAB: 'SET_ACTIVE_TAB',
  SHOW_MESSAGE: 'SHOW_MESSAGE',
  HIDE_MESSAGE: 'HIDE_MESSAGE',
  SHOW_WELCOME_MESSAGE: 'SHOW_WELCOME_MESSAGE',
  HIDE_WELCOME_MESSAGE: 'HIDE_WELCOME_MESSAGE',
  
  // Data actions
  UPDATE_BUSINESS_PLAN: 'UPDATE_BUSINESS_PLAN',
  UPDATE_FINANCIAL_DATA: 'UPDATE_FINANCIAL_DATA',
  SET_VENDORS: 'SET_VENDORS',
  ADD_VENDOR: 'ADD_VENDOR',
  REMOVE_VENDOR: 'REMOVE_VENDOR',
  
  // Draft management actions
  SET_DRAFTS: 'SET_DRAFTS',
  SET_CURRENT_DRAFT_ID: 'SET_CURRENT_DRAFT_ID',
  CREATE_DRAFT: 'CREATE_DRAFT',
  UPDATE_DRAFT: 'UPDATE_DRAFT',
  DELETE_DRAFT: 'DELETE_DRAFT',
  DUPLICATE_DRAFT: 'DUPLICATE_DRAFT',
  SET_DRAFT_COMPARISON: 'SET_DRAFT_COMPARISON',
  UPDATE_PROJECT_TIMELINE: 'UPDATE_PROJECT_TIMELINE'
};

// Initial state
const initialState = {
  // Auth state
  isLoading: false,
  isAuthenticated: false,
  userId: null,
  user: null,
  
  // UI state
  activeTab: 'idea-formation',
  showMessage: false,
  message: {
    type: 'info', // 'success', 'error', 'info'
    title: '',
    text: ''
  },
  showWelcomeMessage: false,
  
  // Draft management state
  drafts: [],
  currentDraftId: null,
  draftComparison: {
    isVisible: false,
    draftIds: []
  },
  
  // Current draft data (legacy compatibility)
  businessPlan: {
    ideation: {
      businessConcept: '',
      coreInspiration: '',
      targetAudience: '',
      initialProblem: '',
      solutionIdea: '',
      differentiator: '',
      businessType: '',
      location: '',
      timeCommitment: '',
      investmentLevel: '',
      successMeasure: '',
      personalMotivation: '',
      marketOpportunity: '',
      resourcesNeeded: '',
      riskAssessment: ''
    },
    elevatorPitch: {
      template: 'problem-solution',
      hook: '',
      problem: '',
      solution: '',
      uniqueValue: '',
      target: '',
      traction: '',
      ask: '',
      finalPitch: '',
      practiceNotes: ''
    },
    executiveSummary: {
      businessName: '',
      businessType: '',
      location: '',
      fundingRequest: '',
      missionStatement: '',
      keySuccessFactors: '',
      financialSummary: ''
    },
    marketAnalysis: {
      industryOverview: '',
      targetMarket: '',
      marketSize: '',
      competitiveAnalysis: '',
      marketTrends: '',
      customerDemographics: ''
    },
    operationsPlan: {
      location: '',
      facilityRequirements: '',
      hoursOfOperation: '',
      staffingPlan: '',
      supplierRelationships: '',
      qualityControl: ''
    },
    managementTeam: {
      keyPersonnel: '',
      organizationalStructure: '',
      advisors: '',
      compensationPlan: ''
    },
    serviceDescription: {
      productsServices: '',
      uniqueSellingProposition: '',
      pricingStrategy: '',
      lifecycle: ''
    },
    marketingStrategy: {
      marketingMix: '',
      salesStrategy: '',
      customerAcquisition: '',
      brandingStrategy: '',
      digitalMarketing: ''
    }
  },
  
  financialData: {
    // Restaurant Operations
    restaurantOperations: {
      seats: 50,
      hoursOfOperation: {
        monday: { open: '11:00', close: '22:00', closed: false },
        tuesday: { open: '11:00', close: '22:00', closed: false },
        wednesday: { open: '11:00', close: '22:00', closed: false },
        thursday: { open: '11:00', close: '22:00', closed: false },
        friday: { open: '11:00', close: '23:00', closed: false },
        saturday: { open: '10:00', close: '23:00', closed: false },
        sunday: { open: '10:00', close: '21:00', closed: false }
      },
      averageCheck: {
        lunch: 18,
        dinner: 32,
        brunch: 24,
        beverages: 8
      },
      tableTurnover: {
        lunch: 1.5,
        dinner: 2.0,
        brunch: 2.5,
        average: 2.0
      },
      occupancyRate: {
        lunch: 0.7,
        dinner: 0.9,
        brunch: 0.8,
        average: 0.8
      }
    },
    revenue: {
      foodSales: 0,
      beverageSales: 0,
      merchandiseSales: 0,
      cateringSales: 0,
      otherRevenue: 0
    },
    cogs: {
      foodCogsPercent: 0.28,
      beverageCogsPercent: 0.22,
      merchandiseCogsPercent: 0.15,
      cateringCogsPercent: 0.32,
      otherCogsPercent: 0.12
    },
    operatingExpenses: {
      // Core Operating Expenses
      rent: 0,
      utilities: 0,
      insurance: 0,
      marketing: 0,
      legalAccounting: 0,
      repairsMaintenance: 0,
      supplies: 0,
      adminOffice: 0,
      otherOperatingExpenses: 0,
      
      // Detailed Operational Expenses
      linenService: 0,
      trashCollection: 0,
      compostService: 0,
      cleaningService: 0,
      hoodCleaning: 0,
      greaseTrapCleaning: 0,
      internetPhone: 0,
      securitySystem: 0,
      pestControl: 0,
      wasteManagement: 0,
      equipmentMaintenance: 0,
      uniformService: 0,
      dishwareReplacement: 0,
      cleaningSupplies: 0,
      paperGoods: 0,
      kitchenSupplies: 0,
      pointOfSale: 0,
      creditCardProcessing: 0,
      bankFees: 0,
      permitsLicenses: 0,
      musicLicensing: 0,
      deliveryServiceFees: 0,
      trainingCertification: 0,
      employeeBenefits: 0,
      workersCompensation: 0,
      unemploymentInsurance: 0,
      healthInsurance: 0,
      retirementBenefits: 0,
      uniformLaundry: 0,
      parkingFees: 0,
      storageFees: 0,
      professionalServices: 0,
      technologySupport: 0,
      softwareSubscriptions: 0,
      inventoryManagement: 0,
      qualityControl: 0,
      safetyTraining: 0,
      equipmentRental: 0,
      temporaryStaffing: 0,
      consulting: 0,
      travelEntertainment: 0,
      charitableDonations: 0,
      localTaxes: 0,
      propertyTaxes: 0,
      businessTaxes: 0,
      
      // Detailed Labor Structure - Individual Positions
      labor: {
        // Management Positions
        management: [
          { id: 'gm-1', name: 'General Manager', hourlyRate: 28, hoursPerWeek: 50, tips: 0, benefits: true, department: 'Management' },
          { id: 'am-1', name: 'Assistant Manager', hourlyRate: 22, hoursPerWeek: 45, tips: 0, benefits: true, department: 'Management' },
          { id: 'km-1', name: 'Kitchen Manager', hourlyRate: 25, hoursPerWeek: 50, tips: 0, benefits: true, department: 'Management' }
        ],
        // Front of House Positions
        frontOfHouse: [
          { id: 'server-1', name: 'Server 1', hourlyRate: 15, hoursPerWeek: 35, tips: 10, benefits: false, department: 'FOH' },
          { id: 'server-2', name: 'Server 2', hourlyRate: 15, hoursPerWeek: 35, tips: 10, benefits: false, department: 'FOH' },
          { id: 'server-3', name: 'Server 3', hourlyRate: 15, hoursPerWeek: 35, tips: 10, benefits: false, department: 'FOH' },
          { id: 'server-4', name: 'Server 4', hourlyRate: 15, hoursPerWeek: 35, tips: 10, benefits: false, department: 'FOH' },
          { id: 'server-5', name: 'Server 5', hourlyRate: 15, hoursPerWeek: 35, tips: 10, benefits: false, department: 'FOH' },
          { id: 'server-6', name: 'Server 6', hourlyRate: 15, hoursPerWeek: 35, tips: 10, benefits: false, department: 'FOH' },
          { id: 'bartender-1', name: 'Bartender 1', hourlyRate: 15, hoursPerWeek: 35, tips: 15, benefits: false, department: 'FOH' },
          { id: 'bartender-2', name: 'Bartender 2', hourlyRate: 15, hoursPerWeek: 35, tips: 15, benefits: false, department: 'FOH' },
          { id: 'host-1', name: 'Host 1', hourlyRate: 15, hoursPerWeek: 25, tips: 3, benefits: false, department: 'FOH' },
          { id: 'host-2', name: 'Host 2', hourlyRate: 15, hoursPerWeek: 25, tips: 3, benefits: false, department: 'FOH' },
          { id: 'busser-1', name: 'Busser 1', hourlyRate: 15, hoursPerWeek: 30, tips: 4, benefits: false, department: 'FOH' },
          { id: 'busser-2', name: 'Busser 2', hourlyRate: 15, hoursPerWeek: 30, tips: 4, benefits: false, department: 'FOH' },
          { id: 'cashier-1', name: 'Cashier 1', hourlyRate: 15, hoursPerWeek: 20, tips: 0, benefits: false, department: 'FOH' }
        ],
        // Back of House Positions
        backOfHouse: [
          { id: 'chef-1', name: 'Head Chef', hourlyRate: 32, hoursPerWeek: 55, tips: 0, benefits: true, department: 'BOH' },
          { id: 'cook-1', name: 'Cook 1', hourlyRate: 22, hoursPerWeek: 40, tips: 0, benefits: false, department: 'BOH' },
          { id: 'cook-2', name: 'Cook 2', hourlyRate: 20, hoursPerWeek: 40, tips: 0, benefits: false, department: 'BOH' },
          { id: 'cook-3', name: 'Cook 3', hourlyRate: 20, hoursPerWeek: 40, tips: 0, benefits: false, department: 'BOH' },
          { id: 'cook-4', name: 'Cook 4', hourlyRate: 18, hoursPerWeek: 40, tips: 0, benefits: false, department: 'BOH' },
          { id: 'prep-1', name: 'Prep Cook 1', hourlyRate: 18, hoursPerWeek: 35, tips: 0, benefits: false, department: 'BOH' },
          { id: 'prep-2', name: 'Prep Cook 2', hourlyRate: 16, hoursPerWeek: 35, tips: 0, benefits: false, department: 'BOH' },
          { id: 'dish-1', name: 'Dishwasher 1', hourlyRate: 15, hoursPerWeek: 30, tips: 0, benefits: false, department: 'BOH' },
          { id: 'dish-2', name: 'Dishwasher 2', hourlyRate: 15, hoursPerWeek: 30, tips: 0, benefits: false, department: 'BOH' }
        ],
        // Support Staff
        support: [
          { id: 'clean-1', name: 'Cleaning Staff 1', hourlyRate: 15, hoursPerWeek: 20, tips: 0, benefits: false, department: 'Support' },
          { id: 'clean-2', name: 'Cleaning Staff 2', hourlyRate: 15, hoursPerWeek: 20, tips: 0, benefits: false, department: 'Support' },
          { id: 'maintenance-1', name: 'Maintenance', hourlyRate: 20, hoursPerWeek: 15, tips: 0, benefits: false, department: 'Support' }
        ],
        // Tax Rates
        taxRates: {
          federalIncomeTax: 0.15,
          stateIncomeTax: 0.05,
          socialSecurity: 0.062,
          medicare: 0.0145,
          unemployment: 0.03,
          workersComp: 0.02,
          benefitsRate: 0.25 // Health insurance, retirement, etc.
        }
      },
      
      // Legacy Payroll (for backward compatibility)
      salaryOwners: 0,
      salaryFullTime: 0,
      salaryPartTime: 0,
      payrollTaxRate: 0.12
    },
    startupCosts: {
      leaseholdImprovements: 0,
      kitchenEquipment: 0,
      furnitureFixtures: 0,
      initialInventory: 0,
      preOpeningSalaries: 0,
      depositsLicenses: 0,
      initialMarketing: 0,
      contingency: 0
    },
    fundingSources: {
      ownersEquity: 0,
      investorFunds: 0,
      bankLoans: 0,
      otherFunding: 0
    },
    restaurantDetails: {
      seats: 50,
      squareFootage: 2000,
      operatingHours: '11:00 AM - 10:00 PM',
      daysOpen: 7
    }
  },
  
  vendors: [],
  projectTimeline: null
};

// Draft helper functions
const createNewDraft = (name = `Draft ${Date.now()}`, baseDraft = null) => {
  const now = new Date();
  return {
    id: `draft_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    name,
    createdAt: now,
    updatedAt: now,
    isActive: false,
    businessPlan: baseDraft ? { ...baseDraft.businessPlan } : { ...initialState.businessPlan },
    financialData: baseDraft ? { ...baseDraft.financialData } : { ...initialState.financialData },
    vendors: baseDraft ? [...baseDraft.vendors] : []
  };
};

// Sample Boston restaurant drafts for demonstration
const createSampleDrafts = () => {
  const now = new Date();
  const hour = 60 * 60 * 1000;
  
  return [
        {
      id: 'demo_north_end_italian',
      name: 'North End Italian Bistro',
      createdAt: new Date(now.getTime() - 5 * hour),
      updatedAt: new Date(now.getTime() - 1 * hour),
      concept: 'North End Italian',
      conceptId: 'concept_north_end_italian',
      conceptDescription: 'Authentic Northern Italian cuisine in Boston\'s historic North End',
      businessPlan: {
         ideation: {
           businessConcept: 'A family-style Italian restaurant in Boston\'s North End that serves authentic Northern Italian cuisine to locals and tourists because there\'s a lack of true regional Italian specialties.',
           coreInspiration: 'Growing up with my Nonna\'s authentic Northern Italian recipes and seeing tourists getting generic "Italian-American" food instead of real Italian cuisine',
           targetAudience: 'Food-loving tourists, local Italian-Americans, and professionals seeking authentic dining experiences',
           initialProblem: 'Most North End restaurants serve generic Italian-American food rather than authentic regional specialties, leaving both tourists and locals wanting real Italian cuisine',
           solutionIdea: 'Authentic Northern Italian recipes, imported ingredients, traditional cooking methods, and warm family atmosphere',
           differentiator: 'Only restaurant in North End serving authentic Northern Italian cuisine with family recipes passed down for generations',
           businessType: 'restaurant',
           location: 'north-end',
           timeCommitment: 'intensive',
           investmentLevel: 'high',
           successMeasure: 'Building a beloved neighborhood institution that preserves Italian culinary heritage while providing financial stability for my family',
           personalMotivation: 'Honoring my grandmother\'s legacy and sharing authentic Italian culture with Boston',
           marketOpportunity: 'Food sales, wine pairings, cooking classes, private events, catering',
           resourcesNeeded: 'Family recipes, Italian cooking experience, connections with Italian importers, culinary training',
           riskAssessment: 'High competition in North End, seasonal tourist fluctuations, high Boston rent, staff retention challenges'
         },
         elevatorPitch: {
           template: 'problem-solution',
           hook: 'Did you know that despite having over 100 Italian restaurants, Boston\'s North End doesn\'t have a single authentic Northern Italian restaurant?',
           problem: 'Tourists and locals alike are stuck eating generic Italian-American food instead of experiencing real regional Italian cuisine',
           solution: 'We\'re opening Nonna\'s Table to serve authentic Northern Italian specialties using recipes passed down through generations of my family',
           uniqueValue: 'We\'re the only restaurant bringing true Northern Italian traditions to Boston, with imported ingredients and time-honored cooking methods',
           target: 'Food-loving tourists, local Italian-Americans, and Boston professionals who appreciate authentic dining experiences',
           traction: 'Validated through family catering events and positive feedback from Italian community leaders',
           ask: 'We\'re seeking $485,000 in funding to bring authentic Italian heritage to Boston\'s most historic neighborhood',
           finalPitch: '',
           practiceNotes: ''
         },
         executiveSummary: {
           businessName: 'Nonna\'s Table',
          businessType: 'casual-dining',
          location: 'north-end',
          fundingRequest: '$485,000',
          missionStatement: 'To bring authentic Northern Italian cuisine to Boston\'s historic North End, combining traditional family recipes with modern dining experiences.',
          keySuccessFactors: '• Prime North End location with high tourist traffic\n• Authentic family recipes from Northern Italy\n• Experienced Italian chef with 15+ years\n• Strong relationships with local Italian suppliers\n• Outdoor patio seating for 20 guests',
          financialSummary: '• Projected Year 1 Revenue: $875,000\n• Target Gross Margin: 68%\n• Break-even Timeline: 18 months\n• Initial Investment: $485,000\n• Projected ROI: 18% by Year 3'
        },
        marketAnalysis: {
          industryOverview: 'Boston\'s North End is a premier dining destination with over 100 restaurants. Italian cuisine represents 35% of the area\'s dining options.',
          targetMarket: 'Tourists (40%), local professionals (35%), and North End residents (25%). Average age 25-55, household income $75K+.',
          marketSize: 'North End dining market: $125M annually. Italian cuisine segment: $44M. Targeting 0.7% market share.',
          competitiveAnalysis: 'Key competitors: Giacomo\'s, Bricco, Prezza. Differentiation through authentic Northern Italian focus and family atmosphere.',
          marketTrends: 'Growing demand for authentic ethnic cuisine, farm-to-table ingredients, and experiential dining.',
          customerDemographics: 'Primary: Couples and small groups, ages 30-60, income $75K+. Secondary: Tourists seeking authentic Italian experience.'
        },
        operationsPlan: {},
        managementTeam: {},
        serviceDescription: {},
        marketingStrategy: {}
      },
      financialData: {
        restaurantOperations: {
          seats: 60,
          hoursOfOperation: {
            monday: { open: '11:00', close: '22:00', closed: false },
            tuesday: { open: '11:00', close: '22:00', closed: false },
            wednesday: { open: '11:00', close: '22:00', closed: false },
            thursday: { open: '11:00', close: '22:00', closed: false },
            friday: { open: '11:00', close: '23:00', closed: false },
            saturday: { open: '10:00', close: '23:00', closed: false },
            sunday: { open: '10:00', close: '21:00', closed: false }
          },
          averageCheck: {
            lunch: 22,
            dinner: 38,
            brunch: 28,
            beverages: 12
          },
          tableTurnover: {
            lunch: 1.8,
            dinner: 2.2,
            brunch: 2.8,
            average: 2.3
          },
          occupancyRate: {
            lunch: 0.75,
            dinner: 0.95,
            brunch: 0.85,
            average: 0.85
          }
        },
        revenue: {
          foodSales: 700000,
          beverageSales: 175000,
          merchandiseSales: 0,
          cateringSales: 0,
          otherRevenue: 0
        },
        cogs: {
          foodCogsPercent: 0.28,
          beverageCogsPercent: 0.22,
          merchandiseCogsPercent: 0.15,
          cateringCogsPercent: 0.32,
          otherCogsPercent: 0.12
        },
        operatingExpenses: {
          rent: 135000,
          utilities: 24000,
          insurance: 18000,
          marketing: 30000,
          legalAccounting: 12000,
          repairsMaintenance: 15000,
          supplies: 0,
          adminOffice: 0,
          otherOperatingExpenses: 0,
          // Detailed operational expenses
          linenService: 3600,
          trashCollection: 2400,
          compostService: 1800,
          cleaningService: 12000,
          hoodCleaning: 2400,
          greaseTrapCleaning: 1200,
          internetPhone: 3600,
          securitySystem: 2400,
          pestControl: 1800,
          wasteManagement: 2400,
          equipmentMaintenance: 6000,
          uniformService: 2400,
          dishwareReplacement: 3000,
          cleaningSupplies: 4800,
          paperGoods: 3600,
          kitchenSupplies: 6000,
          pointOfSale: 4800,
          creditCardProcessing: 15000,
          bankFees: 1200,
          permitsLicenses: 3000,
          musicLicensing: 1200,
          deliveryServiceFees: 15000,
          trainingCertification: 3000,
          employeeBenefits: 15000,
          workersCompensation: 8000,
          unemploymentInsurance: 4000,
          healthInsurance: 24000,
          retirementBenefits: 12000,
          uniformLaundry: 1800,
          parkingFees: 3600,
          storageFees: 0,
          professionalServices: 6000,
          technologySupport: 1800,
          softwareSubscriptions: 2400,
          inventoryManagement: 1800,
          qualityControl: 3000,
          safetyTraining: 2400,
          equipmentRental: 0,
          temporaryStaffing: 0,
          consulting: 5000,
          travelEntertainment: 3000,
          charitableDonations: 2000,
          localTaxes: 5000,
          propertyTaxes: 8000,
          businessTaxes: 12000,
          
          // Detailed Labor Structure - Individual Positions
          labor: {
            // Management Positions
            management: [
              { id: 'gm-1', name: 'General Manager', hourlyRate: 28, hoursPerWeek: 50, tips: 0, benefits: true, department: 'Management' },
              { id: 'am-1', name: 'Assistant Manager', hourlyRate: 22, hoursPerWeek: 45, tips: 0, benefits: true, department: 'Management' },
              { id: 'km-1', name: 'Kitchen Manager', hourlyRate: 25, hoursPerWeek: 50, tips: 0, benefits: true, department: 'Management' }
            ],
            // Front of House Positions
            frontOfHouse: [
              { id: 'server-1', name: 'Server 1', hourlyRate: 15, hoursPerWeek: 35, tips: 10, benefits: false, department: 'FOH' },
              { id: 'server-2', name: 'Server 2', hourlyRate: 15, hoursPerWeek: 35, tips: 10, benefits: false, department: 'FOH' },
              { id: 'server-3', name: 'Server 3', hourlyRate: 15, hoursPerWeek: 35, tips: 10, benefits: false, department: 'FOH' },
              { id: 'server-4', name: 'Server 4', hourlyRate: 15, hoursPerWeek: 35, tips: 10, benefits: false, department: 'FOH' },
              { id: 'server-5', name: 'Server 5', hourlyRate: 15, hoursPerWeek: 35, tips: 10, benefits: false, department: 'FOH' },
              { id: 'server-6', name: 'Server 6', hourlyRate: 15, hoursPerWeek: 35, tips: 10, benefits: false, department: 'FOH' },
              { id: 'bartender-1', name: 'Bartender 1', hourlyRate: 15, hoursPerWeek: 35, tips: 15, benefits: false, department: 'FOH' },
              { id: 'bartender-2', name: 'Bartender 2', hourlyRate: 15, hoursPerWeek: 35, tips: 15, benefits: false, department: 'FOH' },
              { id: 'host-1', name: 'Host 1', hourlyRate: 15, hoursPerWeek: 25, tips: 3, benefits: false, department: 'FOH' },
              { id: 'host-2', name: 'Host 2', hourlyRate: 15, hoursPerWeek: 25, tips: 3, benefits: false, department: 'FOH' },
              { id: 'busser-1', name: 'Busser 1', hourlyRate: 15, hoursPerWeek: 30, tips: 4, benefits: false, department: 'FOH' },
              { id: 'busser-2', name: 'Busser 2', hourlyRate: 15, hoursPerWeek: 30, tips: 4, benefits: false, department: 'FOH' },
              { id: 'cashier-1', name: 'Cashier 1', hourlyRate: 15, hoursPerWeek: 20, tips: 0, benefits: false, department: 'FOH' }
            ],
            // Back of House Positions
            backOfHouse: [
              { id: 'chef-1', name: 'Head Chef', hourlyRate: 32, hoursPerWeek: 55, tips: 0, benefits: true, department: 'BOH' },
              { id: 'cook-1', name: 'Cook 1', hourlyRate: 22, hoursPerWeek: 40, tips: 0, benefits: false, department: 'BOH' },
              { id: 'cook-2', name: 'Cook 2', hourlyRate: 20, hoursPerWeek: 40, tips: 0, benefits: false, department: 'BOH' },
              { id: 'cook-3', name: 'Cook 3', hourlyRate: 20, hoursPerWeek: 40, tips: 0, benefits: false, department: 'BOH' },
              { id: 'cook-4', name: 'Cook 4', hourlyRate: 18, hoursPerWeek: 40, tips: 0, benefits: false, department: 'BOH' },
              { id: 'prep-1', name: 'Prep Cook 1', hourlyRate: 18, hoursPerWeek: 35, tips: 0, benefits: false, department: 'BOH' },
              { id: 'prep-2', name: 'Prep Cook 2', hourlyRate: 16, hoursPerWeek: 35, tips: 0, benefits: false, department: 'BOH' },
              { id: 'dish-1', name: 'Dishwasher 1', hourlyRate: 15, hoursPerWeek: 30, tips: 0, benefits: false, department: 'BOH' },
              { id: 'dish-2', name: 'Dishwasher 2', hourlyRate: 15, hoursPerWeek: 30, tips: 0, benefits: false, department: 'BOH' }
            ],
            // Support Staff
            support: [
              { id: 'clean-1', name: 'Cleaning Staff 1', hourlyRate: 15, hoursPerWeek: 20, tips: 0, benefits: false, department: 'Support' },
              { id: 'clean-2', name: 'Cleaning Staff 2', hourlyRate: 15, hoursPerWeek: 20, tips: 0, benefits: false, department: 'Support' },
              { id: 'maintenance-1', name: 'Maintenance', hourlyRate: 20, hoursPerWeek: 15, tips: 0, benefits: false, department: 'Support' }
            ],
            // Tax Rates
            taxRates: {
              federalIncomeTax: 0.15,
              stateIncomeTax: 0.05,
              socialSecurity: 0.062,
              medicare: 0.0145,
              unemployment: 0.03,
              workersComp: 0.02,
              benefitsRate: 0.25 // Health insurance, retirement, etc.
            }
          },
          
          salaryOwners: 85000,
          salaryFullTime: 200000,
          salaryPartTime: 140000,
          payrollTaxRate: 0.12
        },
        startupCosts: {
          leaseholdImprovements: 200000,
          kitchenEquipment: 145000,
          furnitureFixtures: 55000,
          initialInventory: 18000,
          preOpeningSalaries: 0,
          depositsLicenses: 30000,
          initialMarketing: 20000,
          contingency: 17000
        },
        fundingSources: {
          ownersEquity: 200000,
          investorFunds: 150000,
          bankLoans: 135000,
          otherFunding: 0
        }
      },
      vendors: [
        { id: 1, name: "Tedd Rama", company: "Baldor Foods", email: "bbweborders@baldorfoods.com", category: "Food Supplier", priority: "high" },
        { id: 2, name: "Todd Evens", company: "Sysco Foods", email: "Todd.Evans@sysco.com", category: "Food Supplier", priority: "high" }
      ]
    },
    {
      id: 'demo_north_end_italian_variation',
      name: 'North End Italian Bistro - Premium Concept',
      createdAt: new Date(now.getTime() - 4 * hour),
      updatedAt: new Date(now.getTime() - 2 * hour),
      concept: 'North End Italian',
      conceptId: 'concept_north_end_italian',
      conceptDescription: 'Authentic Northern Italian cuisine in Boston\'s historic North End',
      businessPlan: {
        ideation: {
          businessConcept: 'A premium Italian restaurant in Boston\'s North End that serves authentic Northern Italian cuisine with wine pairings and private dining experiences.',
          coreInspiration: 'Creating an upscale dining experience that honors Italian culinary traditions while providing an intimate, sophisticated atmosphere',
          targetAudience: 'Affluent diners, wine enthusiasts, special occasions, business entertainment, and Italian culture lovers',
          initialProblem: 'North End lacks a premium Italian dining experience that combines authentic cuisine with sophisticated service and wine expertise',
          solutionIdea: 'Premium Italian dining with extensive wine list, private dining rooms, chef\'s table experiences, and seasonal tasting menus',
          differentiator: 'Only premium Italian restaurant in North End with dedicated sommelier, private dining, and seasonal tasting menus',
          businessType: 'fine-dining',
          location: 'north-end',
          timeCommitment: 'intensive',
          investmentLevel: 'premium',
          successMeasure: 'Becoming Boston\'s premier Italian fine dining destination with $1.2M annual revenue and wine program recognition',
          personalMotivation: 'Elevating Italian cuisine in Boston while building a world-class dining establishment',
          marketOpportunity: 'Fine dining, wine sales, private events, corporate dining, wine education, seasonal events',
          resourcesNeeded: 'Fine dining experience, wine expertise, premium location, significant capital, exceptional service staff',
          riskAssessment: 'Very high startup costs, premium pricing strategy, need for exceptional staff, longer payback period'
        },
        elevatorPitch: {
          template: 'problem-solution',
          hook: 'Boston\'s North End has 100+ Italian restaurants, but not a single one offers a premium fine dining experience with world-class wine pairings.',
          problem: 'Affluent diners seeking sophisticated Italian dining must travel outside Boston or settle for casual North End options',
          solution: 'We\'re creating Il Ristorante, a premium Italian fine dining establishment with authentic Northern Italian cuisine and an extensive wine program',
          uniqueValue: 'Boston\'s only premium Italian restaurant combining authentic regional cuisine with sophisticated service and world-class wine expertise',
          target: 'Affluent professionals, wine enthusiasts, special occasion diners, and business entertainers seeking premium Italian dining',
          traction: 'Validated through focus groups with 50+ high-income diners and partnerships with Italian wine importers',
          ask: 'We\'re seeking $750,000 to create Boston\'s premier Italian fine dining destination in the historic North End',
          finalPitch: '',
          practiceNotes: ''
        },
        executiveSummary: {
          businessName: 'Il Ristorante',
          businessType: 'fine-dining',
          location: 'north-end',
          fundingRequest: '$750,000',
          missionStatement: 'To provide Boston\'s most sophisticated Italian dining experience, combining authentic Northern Italian cuisine with world-class wine pairings and exceptional service.',
          keySuccessFactors: '• Premium North End location with private dining capabilities\n• Authentic Northern Italian recipes with seasonal ingredients\n• Dedicated sommelier and extensive wine program\n• Private dining rooms and chef\'s table experiences\n• Exceptional service staff with Italian hospitality training',
          financialSummary: '• Projected Year 1 Revenue: $1,200,000\n• Target Gross Margin: 75%\n• Break-even Timeline: 24 months\n• Initial Investment: $750,000\n• Projected ROI: 25% by Year 3'
        },
        marketAnalysis: {
          industryOverview: 'Boston\'s fine dining market is growing 8% annually, with Italian cuisine representing 20% of premium dining preferences.',
          targetMarket: 'Affluent professionals (45%), special occasions (30%), business entertainment (15%), and wine enthusiasts (10%).',
          marketSize: 'Boston fine dining market: $180M annually. Italian fine dining segment: $36M. Targeting 3.3% market share.',
          competitiveAnalysis: 'Competitors: Mamma Maria, Prezza, Bricco. Differentiation through premium wine program and private dining experiences.',
          marketTrends: 'Growing demand for premium dining experiences, wine education, private events, and authentic ethnic cuisine.',
          customerDemographics: 'Primary: High-income professionals, ages 35-65, household income $150K+. Secondary: Wine enthusiasts and special occasion diners.'
        },
        operationsPlan: {},
        managementTeam: {},
        serviceDescription: {},
        marketingStrategy: {}
      },
      financialData: {
        revenue: {
          foodSales: 900000,
          beverageSales: 250000,
          merchandiseSales: 0,
          cateringSales: 50000,
          otherRevenue: 0
        },
        cogs: {
          foodCogsPercent: 0.25,
          beverageCogsPercent: 0.30,
          merchandiseCogsPercent: 0.15,
          cateringCogsPercent: 0.28,
          otherCogsPercent: 0.12
        },
        operatingExpenses: {
          rent: 180000,
          utilities: 30000,
          insurance: 25000,
          marketing: 50000,
          legalAccounting: 15000,
          repairsMaintenance: 20000,
          supplies: 0,
          adminOffice: 0,
          otherOperatingExpenses: 0,
          salaryOwners: 120000,
          salaryFullTime: 300000,
          salaryPartTime: 180000,
          payrollTaxRate: 0.12
        },
        startupCosts: {
          leaseholdImprovements: 300000,
          kitchenEquipment: 200000,
          furnitureFixtures: 100000,
          initialInventory: 25000,
          preOpeningSalaries: 0,
          depositsLicenses: 50000,
          initialMarketing: 40000,
          contingency: 35000
        },
        fundingSources: {
          ownersEquity: 300000,
          investorFunds: 250000,
          bankLoans: 200000,
          otherFunding: 0
        }
      },
      vendors: [
        { id: 1, name: "Tedd Rama", company: "Baldor Foods", email: "bbweborders@baldorfoods.com", category: "Food Supplier", priority: "high" },
        { id: 2, name: "Todd Evens", company: "Sysco Foods", email: "Todd.Evans@sysco.com", category: "Food Supplier", priority: "high" },
        { id: 12, name: "Marco Rossi", company: "Italian Wine Importers", email: "mrossi@italianwine.com", category: "Wine Supplier", priority: "high" }
      ]
    },
        {
      id: 'demo_seaport_fast_casual',
      name: 'Seaport Fast-Casual Concept',
      createdAt: new Date(now.getTime() - 3 * hour),
      updatedAt: new Date(now.getTime() - 30 * 60 * 1000),
      concept: 'Seaport Fast Casual',
      conceptId: 'concept_seaport_fast_casual',
      conceptDescription: 'Healthy fast-casual dining in Boston\'s growing Seaport district',
      businessPlan: {
         ideation: {
           businessConcept: 'A healthy fast-casual restaurant in Boston\'s Seaport that serves customizable bowls to busy tech professionals because there\'s a lack of quick, nutritious options in the area.',
           coreInspiration: 'Working long hours in the tech industry and struggling to find healthy, quick meal options that weren\'t expensive or time-consuming',
           targetAudience: 'Tech workers, young professionals, health-conscious millennials, and convention center visitors',
           initialProblem: 'Seaport professionals are stuck with expensive sit-down restaurants or unhealthy fast food, with limited healthy options for busy schedules',
           solutionIdea: 'Customizable healthy bowls with fresh ingredients, quick service, mobile ordering, and affordable pricing',
           differentiator: 'Focus on tech worker needs: fast WiFi, phone charging stations, healthy brain foods, and efficient mobile ordering',
           businessType: 'fast-casual',
           location: 'seaport',
           timeCommitment: 'full-time',
           investmentLevel: 'medium',
           successMeasure: 'Becoming the go-to lunch spot for Seaport professionals with 500+ daily customers and potential for expansion',
           personalMotivation: 'Solving my own problem while building a scalable business that promotes healthy eating habits',
           marketOpportunity: 'Bowl sales, corporate catering, meal subscriptions, branded merchandise, franchise expansion',
           resourcesNeeded: 'Restaurant management experience, healthy food knowledge, tech-savvy marketing, startup capital',
           riskAssessment: 'High Seaport rents, competition from chains, seasonal business fluctuations, need for tech integration'
         },
         elevatorPitch: {
           template: 'problem-solution',
           hook: 'What if I told you that Seaport tech workers spend an average of $18 and 45 minutes for lunch every day, but 78% say they want healthier, faster options?',
           problem: 'Boston\'s fastest-growing business district lacks affordable, healthy food options for busy professionals',
           solution: 'Harbor Bowl offers customizable, nutritious bowls with 5-minute service and mobile ordering designed specifically for the tech community',
           uniqueValue: 'We\'re the only restaurant combining healthy fast-casual with tech-worker amenities like charging stations and optimized WiFi',
           target: 'The 15,000+ tech workers, young professionals, and convention visitors in Boston\'s Seaport district',
           traction: 'Validated through surveys of 200+ Seaport workers and pre-orders from 3 major tech companies',
           ask: 'We\'re seeking $325,000 to capture Boston\'s fastest-growing market with a scalable, tech-forward healthy dining concept',
           finalPitch: '',
           practiceNotes: ''
         },
         executiveSummary: {
           businessName: 'Harbor Bowl',
          businessType: 'fast-casual',
          location: 'seaport',
          fundingRequest: '$325,000',
          missionStatement: 'To provide fresh, healthy, customizable bowl meals to Boston\'s busy Seaport professionals and residents.',
          keySuccessFactors: '• Modern Seaport location in growing business district\n• Health-focused menu with customizable options\n• Fast service model for busy professionals\n• Sustainable sourcing and eco-friendly packaging\n• Digital ordering and delivery integration',
          financialSummary: '• Projected Year 1 Revenue: $650,000\n• Target Gross Margin: 72%\n• Break-even Timeline: 14 months\n• Initial Investment: $325,000\n• Projected ROI: 22% by Year 3'
        },
        marketAnalysis: {
          industryOverview: 'Fast-casual dining is the fastest growing restaurant segment in Boston, with 12% annual growth.',
          targetMarket: 'Seaport professionals (60%), residents (25%), tourists/convention visitors (15%). Health-conscious, tech-savvy demographics.',
          marketSize: 'Seaport dining market: $85M annually. Fast-casual segment: $25M. Targeting 2.6% market share.',
          competitiveAnalysis: 'Competitors: Sweetgreen, CAVA, Dig Inn. Differentiation through local Boston ingredients and harbor-themed atmosphere.',
          marketTrends: 'Rising demand for healthy fast-food, customization, mobile ordering, and sustainable practices.',
          customerDemographics: 'Primary: Working professionals, ages 25-45, income $85K+. Secondary: Health-conscious millennials and Gen Z.'
        },
        operationsPlan: {},
        managementTeam: {},
        serviceDescription: {},
        marketingStrategy: {}
      },
      financialData: {
        revenue: {
          foodSales: 520000,
          beverageSales: 85000,
          merchandiseSales: 15000,
          cateringSales: 30000,
          otherRevenue: 0
        },
        cogs: {
          foodCogsPercent: 0.26,
          beverageCogsPercent: 0.20,
          merchandiseCogsPercent: 0.40,
          cateringCogsPercent: 0.30,
          otherCogsPercent: 0.12
        },
        operatingExpenses: {
          rent: 96000,
          utilities: 18000,
          insurance: 14000,
          marketing: 35000,
          legalAccounting: 8000,
          repairsMaintenance: 10000,
          supplies: 0,
          adminOffice: 0,
          otherOperatingExpenses: 0,
          salaryOwners: 65000,
          salaryFullTime: 120000,
          salaryPartTime: 85000,
          payrollTaxRate: 0.12
        },
        startupCosts: {
          leaseholdImprovements: 120000,
          kitchenEquipment: 95000,
          furnitureFixtures: 35000,
          initialInventory: 12000,
          preOpeningSalaries: 0,
          depositsLicenses: 25000,
          initialMarketing: 25000,
          contingency: 13000
        },
        fundingSources: {
          ownersEquity: 150000,
          investorFunds: 100000,
          bankLoans: 75000,
          otherFunding: 0
        }
      },
      vendors: [
        { id: 3, name: "Craig Newton", company: "Supplies on the Fly", email: "cnewton@suppliesonthefly.com", category: "Restaurant Supplies", priority: "medium" },
        { id: 8, name: "Amie Raskin", company: "Intelligentsia Coffee Inc", email: "araskin@intelligentsiacoffee.com", category: "Beverage Supplier", priority: "medium" }
      ]
    },
    {
      id: 'demo_back_bay_fine_dining',
      name: 'Back Bay Fine Dining',
      createdAt: new Date(now.getTime() - 7 * hour),
      updatedAt: new Date(now.getTime() - 2 * hour),
             businessPlan: {
         ideation: {
           businessConcept: 'An upscale restaurant in Boston\'s Back Bay that showcases New England ingredients with global techniques to affluent professionals because there\'s demand for sophisticated dining that honors local heritage.',
           coreInspiration: 'Years of fine dining experience and noticing that Boston lacks restaurants that truly celebrate New England\'s culinary heritage with modern techniques',
           targetAudience: 'Affluent professionals, special occasion diners, business entertainers, and culinary enthusiasts',
           initialProblem: 'Back Bay has many upscale restaurants but few that authentically celebrate New England\'s rich culinary heritage with sophisticated modern techniques',
           solutionIdea: 'Seasonal tasting menus featuring local ingredients, expert wine pairings, impeccable service, and intimate private dining experiences',
           differentiator: 'Only fine dining restaurant in Boston exclusively focused on elevated New England cuisine with James Beard-level culinary expertise',
           businessType: 'restaurant',
           location: 'back-bay',
           timeCommitment: 'intensive',
           investmentLevel: 'premium',
           successMeasure: 'Achieving James Beard recognition, becoming Boston\'s premier destination for New England cuisine, and generating $1.5M annual revenue',
           personalMotivation: 'Establishing Boston as a serious culinary destination while building a legacy restaurant that defines New England fine dining',
           marketOpportunity: 'Tasting menu dinners, wine program, private events, corporate dining, culinary classes, cookbook sales',
           resourcesNeeded: 'Fine dining experience, James Beard-level chef network, wine expertise, significant capital, luxury service training',
           riskAssessment: 'Very high startup costs, lengthy payback period, demanding clientele, need for exceptional staff retention'
         },
         elevatorPitch: {
           template: 'problem-solution',
           hook: 'Boston spends $180 million annually on fine dining, but no restaurant has ever won a James Beard Award for celebrating our own New England culinary heritage.',
           problem: 'Despite being a major culinary city, Boston lacks a world-class restaurant that authentically showcases the sophistication of New England cuisine',
           solution: 'Meridian will be Boston\'s first restaurant dedicated to elevating New England ingredients with global techniques and James Beard-level expertise',
           uniqueValue: 'We\'re creating the only fine dining experience that makes Boston\'s culinary heritage the star, not just a side note',
           target: 'The affluent professionals, business entertainers, and culinary enthusiasts who spend $150+ per person on special dining experiences',
           traction: 'Secured commitment from James Beard-nominated chef and received enthusiastic response from Boston\'s culinary community',
           ask: 'We\'re seeking $750,000 to establish Boston\'s first world-class New England cuisine destination and put our city on the global culinary map',
           finalPitch: '',
           practiceNotes: ''
         },
         executiveSummary: {
           businessName: 'Meridian',
          businessType: 'fine-dining',
          location: 'back-bay',
          fundingRequest: '$750,000',
          missionStatement: 'To create an elevated dining experience showcasing New England ingredients with global culinary techniques in Boston\'s sophisticated Back Bay.',
          keySuccessFactors: '• Prestigious Back Bay location near luxury hotels\n• James Beard-nominated executive chef\n• Sommelier-curated wine program\n• Private dining rooms for corporate events\n• Valet parking partnership',
          financialSummary: '• Projected Year 1 Revenue: $1,250,000\n• Target Gross Margin: 65%\n• Break-even Timeline: 24 months\n• Initial Investment: $750,000\n• Projected ROI: 16% by Year 4'
        },
        marketAnalysis: {
          industryOverview: 'Boston\'s fine dining market represents $180M annually, with Back Bay capturing 25% of high-end restaurant revenue.',
          targetMarket: 'Affluent professionals (40%), special occasion diners (35%), business entertainment (25%). Average check $120+.',
          marketSize: 'Back Bay fine dining: $45M annually. Targeting 2.8% market share.',
          competitiveAnalysis: 'Competitors: Grill 23, Deuxave, Sorellina. Differentiation through New England-focused tasting menus.',
          marketTrends: 'Growth in experiential dining, wine pairings, chef\'s table experiences, and corporate dining.',
          customerDemographics: 'Primary: High-income couples and business diners, ages 35-65, income $150K+.'
        },
        operationsPlan: {},
        managementTeam: {},
        serviceDescription: {},
        marketingStrategy: {}
      },
      financialData: {
        revenue: {
          foodSales: 1000000,
          beverageSales: 250000,
          merchandiseSales: 0,
          cateringSales: 0,
          otherRevenue: 0
        },
        cogs: {
          foodCogsPercent: 0.32,
          beverageCogsPercent: 0.25,
          merchandiseCogsPercent: 0.15,
          cateringCogsPercent: 0.32,
          otherCogsPercent: 0.12
        },
        operatingExpenses: {
          rent: 180000,
          utilities: 36000,
          insurance: 24000,
          marketing: 45000,
          legalAccounting: 18000,
          repairsMaintenance: 20000,
          supplies: 0,
          adminOffice: 0,
          otherOperatingExpenses: 0,
          salaryOwners: 120000,
          salaryFullTime: 350000,
          salaryPartTime: 180000,
          payrollTaxRate: 0.12
        },
        startupCosts: {
          leaseholdImprovements: 350000,
          kitchenEquipment: 200000,
          furnitureFixtures: 125000,
          initialInventory: 25000,
          preOpeningSalaries: 0,
          depositsLicenses: 35000,
          initialMarketing: 35000,
          contingency: 25000
        },
        fundingSources: {
          ownersEquity: 300000,
          investorFunds: 250000,
          bankLoans: 200000,
          otherFunding: 0
        }
      },
      vendors: [
        { id: 7, name: "Jeff Sullivan", company: "Boston Showcase Company", email: "jeff@bostonshowcase.com", category: "Equipment", priority: "medium" },
        { id: 11, name: "Ryan Pinkham", company: "Pink Projects", email: "ryan@pinkproj.com", category: "Construction", priority: "high" }
      ]
    },
    {
      id: 'demo_seaport_healthy_bowls',
      name: 'Seaport Healthy Bowls',
      createdAt: new Date(now.getTime() - 3 * hour),
      updatedAt: new Date(now.getTime() - 1 * hour),
      concept: 'Seaport Fast Casual',
      conceptId: 'concept_seaport_fast_casual',
      conceptDescription: 'Healthy fast-casual dining in Boston\'s growing Seaport district',
      businessPlan: {
         ideation: {
           businessConcept: 'A healthy fast-casual restaurant in Boston\'s Seaport that serves customizable bowls to busy tech professionals because there\'s a lack of quick, nutritious options in the area.',
           coreInspiration: 'Working long hours in the tech industry and struggling to find healthy, quick meal options that weren\'t expensive or time-consuming',
           targetAudience: 'Tech workers, young professionals, health-conscious millennials, and convention center visitors',
           initialProblem: 'Seaport professionals are stuck with expensive sit-down restaurants or unhealthy fast food, with limited healthy options for busy schedules',
           solutionIdea: 'Customizable healthy bowls with fresh ingredients, quick service, mobile ordering, and affordable pricing',
           differentiator: 'Focus on tech worker needs: fast WiFi, phone charging stations, healthy brain foods, and efficient mobile ordering',
           businessType: 'fast-casual',
           location: 'seaport',
           timeCommitment: 'full-time',
           investmentLevel: 'medium',
           successMeasure: 'Becoming the go-to lunch spot for Seaport professionals with 500+ daily customers and potential for expansion',
           personalMotivation: 'Solving my own problem while building a scalable business that promotes healthy eating habits',
           marketOpportunity: 'Bowl sales, corporate catering, meal subscriptions, branded merchandise, franchise expansion',
           resourcesNeeded: 'Restaurant management experience, healthy food knowledge, tech-savvy marketing, startup capital',
           riskAssessment: 'High Seaport rents, competition from chains, seasonal business fluctuations, need for tech integration'
         },
         elevatorPitch: {
           template: 'problem-solution',
           hook: 'What if I told you that Seaport tech workers spend an average of $18 and 45 minutes for lunch every day, but 78% say they want healthier, faster options?',
           problem: 'Boston\'s fastest-growing business district lacks affordable, healthy food options for busy professionals',
           solution: 'Harbor Bowl offers customizable, nutritious bowls with 5-minute service and mobile ordering designed specifically for the tech community',
           uniqueValue: 'We\'re the only restaurant combining healthy fast-casual with tech-worker amenities like charging stations and optimized WiFi',
           target: 'The 15,000+ tech workers, young professionals, and convention visitors in Boston\'s Seaport district',
           traction: 'Validated through surveys of 200+ Seaport workers and pre-orders from 3 major tech companies',
           ask: 'We\'re seeking $325,000 to capture Boston\'s fastest-growing market with a scalable, tech-forward healthy dining concept',
           finalPitch: '',
           practiceNotes: ''
         },
         executiveSummary: {
           businessName: 'Harbor Bowl',
          businessType: 'fast-casual',
          location: 'seaport',
          fundingRequest: '$325,000',
          missionStatement: 'To provide fresh, healthy, customizable bowl meals to Boston\'s busy Seaport professionals and residents.',
          keySuccessFactors: '• Modern Seaport location in growing business district\n• Health-focused menu with customizable options\n• Fast service model for busy professionals\n• Sustainable sourcing and eco-friendly packaging\n• Digital ordering and delivery integration',
          financialSummary: '• Projected Year 1 Revenue: $650,000\n• Target Gross Margin: 72%\n• Break-even Timeline: 14 months\n• Initial Investment: $325,000\n• Projected ROI: 22% by Year 3'
        },
        marketAnalysis: {
          industryOverview: 'Fast-casual dining is the fastest growing restaurant segment in Boston, with 12% annual growth.',
          targetMarket: 'Seaport professionals (60%), residents (25%), tourists/convention visitors (15%). Health-conscious, tech-savvy demographics.',
          marketSize: 'Seaport dining market: $85M annually. Fast-casual segment: $25M. Targeting 2.6% market share.',
          competitiveAnalysis: 'Competitors: Sweetgreen, CAVA, Dig Inn. Differentiation through local Boston ingredients and harbor-themed atmosphere.',
          marketTrends: 'Rising demand for healthy fast-food, customization, mobile ordering, and sustainable practices.',
          customerDemographics: 'Primary: Working professionals, ages 25-45, income $85K+. Secondary: Health-conscious millennials and Gen Z.'
        },
        operationsPlan: {},
        managementTeam: {},
        serviceDescription: {},
        marketingStrategy: {}
      },
      financialData: {
        revenue: {
          foodSales: 520000,
          beverageSales: 85000,
          merchandiseSales: 15000,
          cateringSales: 30000,
          otherRevenue: 0
        },
        cogs: {
          foodCogsPercent: 0.26,
          beverageCogsPercent: 0.20,
          merchandiseCogsPercent: 0.40,
          cateringCogsPercent: 0.30,
          otherCogsPercent: 0.12
        },
        operatingExpenses: {
          rent: 96000,
          utilities: 18000,
          insurance: 14000,
          marketing: 35000,
          legalAccounting: 8000,
          repairsMaintenance: 10000,
          supplies: 0,
          adminOffice: 0,
          otherOperatingExpenses: 0,
          salaryOwners: 65000,
          salaryFullTime: 120000,
          salaryPartTime: 85000,
          payrollTaxRate: 0.12
        },
        startupCosts: {
          leaseholdImprovements: 120000,
          kitchenEquipment: 95000,
          furnitureFixtures: 35000,
          initialInventory: 12000,
          preOpeningSalaries: 0,
          depositsLicenses: 25000,
          initialMarketing: 25000,
          contingency: 13000
        },
        fundingSources: {
          ownersEquity: 150000,
          investorFunds: 100000,
          bankLoans: 75000,
          otherFunding: 0
        }
      },
      vendors: [
        { id: 3, name: "Craig Newton", company: "Supplies on the Fly", email: "cnewton@suppliesonthefly.com", category: "Restaurant Supplies", priority: "medium" },
        { id: 8, name: "Amie Raskin", company: "Intelligentsia Coffee Inc", email: "araskin@intelligentsiacoffee.com", category: "Beverage Supplier", priority: "medium" }
      ]
    }
  ];
};

const getCurrentDraft = (state) => {
  if (!state.currentDraftId || state.drafts.length === 0) return null;
  return state.drafts.find(draft => draft.id === state.currentDraftId) || null;
};

const updateCurrentDraftData = (state) => {
  const currentDraft = getCurrentDraft(state);
  if (currentDraft) {
    return {
      ...state,
      businessPlan: currentDraft.businessPlan,
      financialData: currentDraft.financialData,
      vendors: currentDraft.vendors
    };
  }
  return state;
};

// App Reducer
export const appReducer = (state, action) => {
  switch (action.type) {
    case ActionTypes.SET_LOADING:
      return { ...state, isLoading: action.payload };
      
    case ActionTypes.SET_AUTHENTICATED:
      return { ...state, isAuthenticated: action.payload };
      
    case ActionTypes.SET_USER_ID:
      return { ...state, userId: action.payload };
      
    case ActionTypes.SET_USER:
      return { ...state, user: action.payload };
      
    case ActionTypes.SET_ACTIVE_TAB:
      return { ...state, activeTab: action.payload };
      
    case ActionTypes.SHOW_MESSAGE:
      return {
        ...state,
        showMessage: true,
        message: action.payload
      };
      
    case ActionTypes.HIDE_MESSAGE:
      return {
        ...state,
        showMessage: false,
        message: { type: 'info', title: '', text: '' }
      };
      
    case ActionTypes.SHOW_WELCOME_MESSAGE:
      return {
        ...state,
        showWelcomeMessage: true
      };
      
    case ActionTypes.HIDE_WELCOME_MESSAGE:
      return {
        ...state,
        showWelcomeMessage: false
      };
      
    case ActionTypes.UPDATE_BUSINESS_PLAN: {
      const updatedBusinessPlan = {
        ...state.businessPlan,
        [action.payload.section]: {
          ...state.businessPlan[action.payload.section],
          ...action.payload.data
        }
      };
      
      // Update current draft
      const updatedDrafts = state.drafts.map(draft => 
        draft.id === state.currentDraftId 
          ? { ...draft, businessPlan: updatedBusinessPlan, updatedAt: new Date() }
          : draft
      );
      
      return {
        ...state,
        businessPlan: updatedBusinessPlan,
        drafts: updatedDrafts
      };
    }
    
    case ActionTypes.UPDATE_FINANCIAL_DATA: {
      const updatedFinancialData = {
        ...state.financialData,
        [action.payload.section]: {
          ...state.financialData[action.payload.section],
          ...action.payload.data
        }
      };
      
      // Update current draft
      const updatedDrafts = state.drafts.map(draft => 
        draft.id === state.currentDraftId 
          ? { ...draft, financialData: updatedFinancialData, updatedAt: new Date() }
          : draft
      );
      
      return {
        ...state,
        financialData: updatedFinancialData,
        drafts: updatedDrafts
      };
    }
    
    case ActionTypes.SET_VENDORS: {
      // Update current draft
      const updatedDrafts = state.drafts.map(draft => 
        draft.id === state.currentDraftId 
          ? { ...draft, vendors: action.payload, updatedAt: new Date() }
          : draft
      );
      
      return {
        ...state,
        vendors: action.payload,
        drafts: updatedDrafts
      };
    }
    
    case ActionTypes.ADD_VENDOR: {
      const updatedVendors = [...state.vendors, action.payload];
      
      // Update current draft
      const updatedDrafts = state.drafts.map(draft => 
        draft.id === state.currentDraftId 
          ? { ...draft, vendors: updatedVendors, updatedAt: new Date() }
          : draft
      );
      
      return {
        ...state,
        vendors: updatedVendors,
        drafts: updatedDrafts
      };
    }
    
    case ActionTypes.REMOVE_VENDOR: {
      const updatedVendors = state.vendors.filter(vendor => vendor.id !== action.payload);
      
      // Update current draft
      const updatedDrafts = state.drafts.map(draft => 
        draft.id === state.currentDraftId 
          ? { ...draft, vendors: updatedVendors, updatedAt: new Date() }
          : draft
      );
      
      return {
        ...state,
        vendors: updatedVendors,
        drafts: updatedDrafts
      };
    }
    
    // Draft management actions
    case ActionTypes.SET_DRAFTS: {
      const newState = {
        ...state,
        drafts: action.payload
      };
      return updateCurrentDraftData(newState);
    }
    
    case ActionTypes.SET_CURRENT_DRAFT_ID: {
      const newState = {
        ...state,
        currentDraftId: action.payload
      };
      return updateCurrentDraftData(newState);
    }
    
    case ActionTypes.CREATE_DRAFT: {
      const newDraft = createNewDraft(action.payload.name, action.payload.baseDraft);
      return {
        ...state,
        drafts: [...state.drafts, newDraft],
        currentDraftId: newDraft.id,
        businessPlan: newDraft.businessPlan,
        financialData: newDraft.financialData,
        vendors: newDraft.vendors
      };
    }
    
    case ActionTypes.UPDATE_DRAFT: {
      const updatedDrafts = state.drafts.map(draft => 
        draft.id === action.payload.id 
          ? { ...draft, ...action.payload.updates, updatedAt: new Date() }
          : draft
      );
      
      const newState = {
        ...state,
        drafts: updatedDrafts
      };
      return updateCurrentDraftData(newState);
    }
    
    case ActionTypes.DELETE_DRAFT: {
      const remainingDrafts = state.drafts.filter(draft => draft.id !== action.payload);
      const newCurrentDraftId = state.currentDraftId === action.payload 
        ? (remainingDrafts.length > 0 ? remainingDrafts[0].id : null)
        : state.currentDraftId;
      
      const newState = {
        ...state,
        drafts: remainingDrafts,
        currentDraftId: newCurrentDraftId
      };
      return updateCurrentDraftData(newState);
    }
    
    case ActionTypes.DUPLICATE_DRAFT: {
      const originalDraft = state.drafts.find(draft => draft.id === action.payload.originalId);
      if (!originalDraft) return state;
      
      const duplicatedDraft = createNewDraft(action.payload.name, originalDraft);
      return {
        ...state,
        drafts: [...state.drafts, duplicatedDraft]
      };
    }
    
    case ActionTypes.SET_DRAFT_COMPARISON:
      return {
        ...state,
        draftComparison: action.payload
      };
    
    case ActionTypes.UPDATE_PROJECT_TIMELINE:
      return {
        ...state,
        projectTimeline: action.payload
      };
    
    default:
      return state;
  }
};

// Create context
const AppContext = createContext();

// Provider component
export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Action creators
  const actions = {
    setLoading: (isLoading) => {
      dispatch({ type: ActionTypes.SET_LOADING, payload: isLoading });
    },
    
    setAuthenticated: (isAuthenticated) => {
      dispatch({ type: ActionTypes.SET_AUTHENTICATED, payload: isAuthenticated });
    },
    
    setUserId: (userId) => {
      dispatch({ type: ActionTypes.SET_USER_ID, payload: userId });
    },
    
    setUser: (user) => {
      dispatch({ type: ActionTypes.SET_USER, payload: user });
    },
    
    setActiveTab: (tab) => {
      dispatch({ type: ActionTypes.SET_ACTIVE_TAB, payload: tab });
    },
    
    showMessage: (title, text, type = 'info') => {
      dispatch({ type: ActionTypes.SHOW_MESSAGE, payload: { title, text, type } });
    },
    
    hideMessage: () => {
      dispatch({ type: ActionTypes.HIDE_MESSAGE });
    },
    
    showWelcomeMessage: () => {
      dispatch({ type: ActionTypes.SHOW_WELCOME_MESSAGE });
    },
    
    hideWelcomeMessage: () => {
      dispatch({ type: ActionTypes.HIDE_WELCOME_MESSAGE });
    },
    
    updateBusinessPlan: (section, data) => {
      dispatch({ type: ActionTypes.UPDATE_BUSINESS_PLAN, payload: { section, data } });
    },
    
    updateFinancialData: (section, data) => {
      dispatch({ type: ActionTypes.UPDATE_FINANCIAL_DATA, payload: { section, data } });
    },
    
    setVendors: (vendors) => {
      dispatch({ type: ActionTypes.SET_VENDORS, payload: vendors });
    },
    
    addVendor: (vendor) => {
      dispatch({ type: ActionTypes.ADD_VENDOR, payload: vendor });
    },
    
    removeVendor: (id) => {
      dispatch({ type: ActionTypes.REMOVE_VENDOR, payload: id });
    },
    
    // Draft management actions
    setDrafts: (drafts) => {
      dispatch({ type: ActionTypes.SET_DRAFTS, payload: drafts });
    },
    
    setCurrentDraftId: (draftId) => {
      dispatch({ type: ActionTypes.SET_CURRENT_DRAFT_ID, payload: draftId });
    },
    
    createDraft: (name, baseDraft = null) => {
      dispatch({ type: ActionTypes.CREATE_DRAFT, payload: { name, baseDraft } });
      // Return the newly created draft from state
      const newDraft = createNewDraft(name, baseDraft);
      return newDraft;
    },
    
    updateDraft: (id, updates) => {
      dispatch({ type: ActionTypes.UPDATE_DRAFT, payload: { id, updates } });
    },
    
    deleteDraft: (draftId) => {
      dispatch({ type: ActionTypes.DELETE_DRAFT, payload: draftId });
    },
    
    duplicateDraft: (originalId, name) => {
      dispatch({ type: ActionTypes.DUPLICATE_DRAFT, payload: { originalId, name } });
    },
    
    setDraftComparison: (comparison) => {
      dispatch({ type: ActionTypes.SET_DRAFT_COMPARISON, payload: comparison });
    },
    
    updateProjectTimeline: (timeline) => {
      dispatch({ type: ActionTypes.UPDATE_PROJECT_TIMELINE, payload: timeline });
    },
    
    // Save data to Firebase
    saveData: async () => {
      console.log('Save data called with state:', {
        userId: state.userId,
        currentDraftId: state.currentDraftId,
        isAuthenticated: state.isAuthenticated,
        draftsCount: state.drafts.length,
        isLoading: state.isLoading
      });
      
      if (!state.userId) {
        console.log('Save failed: User not authenticated');
        actions.showMessage('Error', 'Please sign in to save your data.', 'error');
        return;
      }
      
      if (!state.currentDraftId) {
        console.log('Save failed: No current draft selected');
        actions.showMessage('Error', 'No draft selected. Please create or select a draft first.', 'error');
        return;
      }
      
      try {
        actions.setLoading(true);
        const appId = getAppId();
        console.log('Starting save with:', { userId: state.userId, appId, currentDraftId: state.currentDraftId });
        
        // Update current draft with latest data
        const currentDraft = getCurrentDraft(state);
        console.log('Current draft found:', currentDraft);
        if (currentDraft) {
          const updatedDraft = {
            ...currentDraft,
            businessPlan: state.businessPlan,
            financialData: state.financialData,
            vendors: state.vendors,
            updatedAt: new Date()
          };
          
          console.log('Saving draft:', updatedDraft.id);
          
          // Save individual draft
          await dbService.saveDraft(state.userId, appId, updatedDraft);
          console.log('Draft saved successfully');
          
          // Save drafts metadata
          const updatedDrafts = state.drafts.map(draft => 
            draft.id === state.currentDraftId ? updatedDraft : draft
          );
          await dbService.saveDraftsMetadata(state.userId, appId, updatedDrafts);
          console.log('Drafts metadata saved successfully');
          
          actions.showMessage('Success', `Draft "${currentDraft.name}" saved successfully!`, 'success');
        } else {
          console.log('No current draft found, cannot save');
          actions.showMessage('Error', 'No current draft found. Please create or select a draft first.', 'error');
        }
      } catch (error) {
        console.error('Error saving draft:', error);
        actions.showMessage('Error', `Failed to save draft: ${error.message || 'Unknown error'}. Please try again.`, 'error');
      } finally {
        actions.setLoading(false);
      }
    },

    // User management functions
    getAllUsers: async () => {
      return await getAllUsers();
    },

    deleteUserAccount: async (userId) => {
      return await deleteUserAccount(userId);
    },

    signInWithEmail: async (email, password) => {
      try {
        actions.setLoading(true);
        const result = await authService.signInWithEmailAndPassword(email, password);
        return result;
      } catch (error) {
        // console.error('Error signing in with email:', error);
        throw error;
      } finally {
        actions.setLoading(false);
      }
    },

    signInWithGoogle: async () => {
      try {
        actions.setLoading(true);
        const result = await authService.signInWithGoogle();
        return result;
      } catch (error) {
        // console.error('Error signing in with Google:', error);
        throw error;
      } finally {
        actions.setLoading(false);
      }
    },


    signOut: async () => {
      try {
        actions.setLoading(true);
        await authService.signOut();
        // Reset state
        dispatch({ type: ActionTypes.SET_AUTHENTICATED, payload: false });
        dispatch({ type: ActionTypes.SET_USER_ID, payload: null });
        dispatch({ type: ActionTypes.SET_USER, payload: null });
        dispatch({ type: ActionTypes.SET_DRAFTS, payload: [] });
        dispatch({ type: ActionTypes.SET_CURRENT_DRAFT_ID, payload: null });
        return true;
      } catch (error) {
        // console.error('Error signing out:', error);
        throw error;
      } finally {
        actions.setLoading(false);
      }
    }
  };

  // Initialize authentication and drafts
  useEffect(() => {
    let unsubscribe = null;
    
    const initAuth = async () => {
      try {
        const initialToken = getInitialAuthToken();
        
        if (initialToken) {
          await authService.signInWithCustomToken(initialToken);
        }
        // No automatic anonymous sign-in - user must authenticate
      } catch (error) {
        // console.error('Authentication error:', error);
        actions.setLoading(false);
      }
    };
    
    // Set up auth state listener
    unsubscribe = authService.onAuthStateChanged(async (user) => {
      if (user) {
        actions.setUserId(user.uid);
        actions.setUser(user);
        actions.setAuthenticated(true);
        
                 // Load drafts data
         try {
           const appId = getAppId();
           const draftsData = await dbService.getDrafts(user.uid, appId);
           
           if (draftsData && draftsData.length > 0) {
             // console.log('Loading existing drafts:', draftsData.length);
             actions.setDrafts(draftsData);
             // Set the most recent updated draft as current
             const mostRecent = draftsData.reduce((latest, draft) => 
               new Date(draft.updatedAt) > new Date(latest.updatedAt) ? draft : latest
             );
             // console.log('Setting current draft to:', mostRecent.id);
             actions.setCurrentDraftId(mostRecent.id);
           } else {
             // Check if we should load sample data for new users
             const shouldLoadSamples = 
               window.location.hostname === 'localhost' || 
               window.location.search.includes('demo=true') ||
               window.location.search.includes('samples=true') ||
               process.env.REACT_APP_LOAD_SAMPLES === 'true';
             
             if (shouldLoadSamples) {
               // Load sample drafts for new users
               // console.log('Loading sample drafts for new user');
               const sampleDrafts = createSampleDrafts();
               actions.setDrafts(sampleDrafts);
               actions.setCurrentDraftId(sampleDrafts[0].id);
               
               // Show welcome message for new users
               setTimeout(() => {
                 actions.showMessage(
                   'Welcome!', 
                   'We\'ve loaded 3 sample Boston restaurant concepts for you to explore. Try switching between drafts, comparing them, or creating your own!', 
                   'info'
                 );
               }, 1000);
             } else {
               // Create first blank draft for production
               // console.log('Creating first blank draft for production user');
               actions.createDraft('My First Restaurant Plan');
             }
           }
         } catch (error) {
           // console.error('Error loading drafts:', error);
           // Create first draft on error
           actions.createDraft('My First Restaurant Plan');
         }
        
        actions.setLoading(false);
      } else {
        actions.setUserId(null);
        actions.setUser(null);
        actions.setAuthenticated(false);
        actions.setLoading(false);
      }
    });
    
    // Initialize authentication
    initAuth();
    
    // Cleanup
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <AppContext.Provider value={{ state, actions }}>
      {children}
    </AppContext.Provider>
  );
};

// Custom hook to use the context
export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export default AppContext; 