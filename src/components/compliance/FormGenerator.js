import React, { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import { FileText, Download, Eye, Printer, CheckCircle, AlertCircle, User, Building, MapPin } from 'lucide-react';

const FormGenerator = ({ requirement, onFormGenerated }) => {
  const { state } = useApp();
  const [generatedForm, setGeneratedForm] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const businessPlan = state.businessPlan;
  const financialData = state.businessPlan.financialProjections;

  // Extract business data for form pre-filling
  const getBusinessData = () => ({
    businessName: businessPlan.executiveSummary.businessName || '',
    businessType: businessPlan.executiveSummary.businessType || '',
    businessLocation: businessPlan.executiveSummary.businessLocation || '',
    businessDescription: businessPlan.executiveSummary.businessDescription || '',
    ownerName: businessPlan.managementTeam.ownerName || '',
    ownerAddress: businessPlan.managementTeam.ownerAddress || '',
    ownerPhone: businessPlan.managementTeam.ownerPhone || '',
    ownerEmail: businessPlan.managementTeam.ownerEmail || '',
    estimatedEmployees: financialData?.numberOfEmployees || 0,
    estimatedRevenue: financialData?.projectedRevenue || 0,
    fundingRequest: financialData?.fundingRequest || 0,
    startupCosts: financialData?.startupCosts || 0
  });

  // Form templates for different requirements
  const formTemplates = {
    'ein': {
      title: 'Form SS-4 - Application for Employer Identification Number',
      fields: [
        { label: 'Legal name of entity', field: 'businessName', required: true },
        { label: 'Trade name of business', field: 'businessName', required: false },
        { label: 'Executor, administrator, trustee, "care of" name', field: 'ownerName', required: false },
        { label: 'Mailing address', field: 'businessLocation', required: true },
        { label: 'County and state where principal business is located', field: 'businessLocation', required: true },
        { label: 'Name of responsible party', field: 'ownerName', required: true },
        { label: 'Type of entity', value: 'LLC', required: true },
        { label: 'Reason for applying', value: 'Started new business', required: true },
        { label: 'Principal activity', field: 'businessDescription', required: true },
        { label: 'Closing month of accounting year', value: 'December', required: true }
      ]
    },
    'ma-business-registration': {
      title: 'Massachusetts Articles of Organization',
      fields: [
        { label: 'Name of Limited Liability Company', field: 'businessName', required: true },
        { label: 'Purpose', field: 'businessDescription', required: true },
        { label: 'Principal office address', field: 'businessLocation', required: true },
        { label: 'Registered agent name', field: 'ownerName', required: true },
        { label: 'Registered agent address', field: 'businessLocation', required: true },
        { label: 'Management structure', value: 'Member-managed', required: true },
        { label: 'Effective date', value: new Date().toLocaleDateString(), required: true }
      ]
    },
    'food-service-license': {
      title: 'Boston Food Service Establishment License Application',
      fields: [
        { label: 'Establishment name', field: 'businessName', required: true },
        { label: 'Establishment address', field: 'businessLocation', required: true },
        { label: 'Owner/operator name', field: 'ownerName', required: true },
        { label: 'Owner address', field: 'businessLocation', required: true },
        { label: 'Phone number', field: 'ownerPhone', required: true },
        { label: 'Email address', field: 'ownerEmail', required: true },
        { label: 'Type of food service', field: 'businessType', required: true },
        { label: 'Seating capacity', value: '50', required: true },
        { label: 'Hours of operation', value: '11:00 AM - 10:00 PM', required: true },
        { label: 'Manager name', field: 'ownerName', required: true },
        { label: 'ServSafe certification number', value: 'To be obtained', required: true }
      ]
    },
    'liquor-license': {
      title: 'Boston Liquor License Application',
      fields: [
        { label: 'Business name', field: 'businessName', required: true },
        { label: 'Business address', field: 'businessLocation', required: true },
        { label: 'Applicant name', field: 'ownerName', required: true },
        { label: 'Applicant address', field: 'businessLocation', required: true },
        { label: 'Type of license requested', value: 'All Alcoholic Beverages Restaurant', required: true },
        { label: 'Seating capacity', value: '50', required: true },
        { label: 'Hours of alcohol service', value: '11:00 AM - 1:00 AM', required: true },
        { label: 'Manager name', field: 'ownerName', required: true },
        { label: 'TIPS certification', value: 'To be obtained', required: true }
      ]
    },
    'building-permit': {
      title: 'Boston Building Permit Application',
      fields: [
        { label: 'Property address', field: 'businessLocation', required: true },
        { label: 'Owner name', field: 'ownerName', required: true },
        { label: 'Contractor name', value: 'To be determined', required: true },
        { label: 'Type of work', value: 'Commercial kitchen renovation', required: true },
        { label: 'Estimated cost of work', field: 'startupCosts', required: true },
        { label: 'Project description', field: 'businessDescription', required: true },
        { label: 'Square footage', value: '2500', required: true },
        { label: 'Occupancy type', value: 'Restaurant', required: true }
      ]
    }
  };

  const generateForm = async () => {
    setIsGenerating(true);
    
    // Simulate form generation delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const template = formTemplates[requirement.id];
    if (!template) {
      setIsGenerating(false);
      return;
    }

    const businessData = getBusinessData();
    
    const filledForm = {
      id: Date.now(),
      title: template.title,
      requirement: requirement.title,
      generatedAt: new Date().toISOString(),
      fields: template.fields.map(field => ({
        ...field,
        value: field.value || businessData[field.field] || '',
        isFilled: !!(field.value || businessData[field.field])
      })),
      completeness: template.fields.filter(field => 
        field.value || businessData[field.field]
      ).length / template.fields.length * 100
    };

    setGeneratedForm(filledForm);
    setIsGenerating(false);
    
    if (onFormGenerated) {
      onFormGenerated(filledForm);
    }
  };

  const downloadForm = () => {
    if (!generatedForm) return;

    // Create a simple text version of the form
    let formContent = `${generatedForm.title}\n`;
    formContent += `Generated: ${new Date(generatedForm.generatedAt).toLocaleString()}\n\n`;
    
    generatedForm.fields.forEach((field, index) => {
      formContent += `${index + 1}. ${field.label}${field.required ? ' *' : ''}\n`;
      formContent += `   ${field.value || '[TO BE COMPLETED]'}\n\n`;
    });

    formContent += '\n* Required fields\n';
    formContent += 'Note: This is a pre-filled template. Please review all information before submission.\n';

    const blob = new Blob([formContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${generatedForm.title.replace(/[^a-zA-Z0-9]/g, '_')}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const printForm = () => {
    if (!generatedForm) return;

    const printContent = `
      <html>
        <head>
          <title>${generatedForm.title}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { border-bottom: 2px solid #000; padding-bottom: 10px; margin-bottom: 20px; }
            .field { margin-bottom: 15px; }
            .field-label { font-weight: bold; margin-bottom: 5px; }
            .field-value { border-bottom: 1px solid #000; min-height: 20px; padding: 2px; }
            .required { color: red; }
            .footer { margin-top: 30px; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>${generatedForm.title}</h1>
            <p>Generated: ${new Date(generatedForm.generatedAt).toLocaleString()}</p>
          </div>
          ${generatedForm.fields.map((field, index) => `
            <div class="field">
              <div class="field-label">
                ${index + 1}. ${field.label}${field.required ? '<span class="required"> *</span>' : ''}
              </div>
              <div class="field-value">${field.value || ''}</div>
            </div>
          `).join('')}
          <div class="footer">
            <p>* Required fields</p>
            <p>Note: This is a pre-filled template. Please review all information before submission.</p>
          </div>
        </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.print();
  };

  if (!formTemplates[requirement.id]) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
        <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Form Template Not Available</h3>
        <p className="text-gray-600">
          No pre-fillable form template is available for this requirement yet.
        </p>
        <button
          onClick={() => window.open(requirement.website, '_blank')}
          className="mt-4 btn-secondary"
        >
          Visit Official Website
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <FileText className="w-5 h-5 mr-2" />
          Auto-Fill Form: {requirement.title}
        </h3>
        
        {!generatedForm && (
          <button
            onClick={generateForm}
            disabled={isGenerating}
            className="btn-primary flex items-center space-x-2"
          >
            {isGenerating ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Generating...</span>
              </>
            ) : (
              <>
                <FileText className="w-4 h-4" />
                <span>Generate Pre-filled Form</span>
              </>
            )}
          </button>
        )}
      </div>

      {!generatedForm && !isGenerating && (
        <div className="text-center py-8">
          <FileText className="w-16 h-16 text-purple-300 mx-auto mb-4" />
          <h4 className="text-lg font-medium text-gray-900 mb-2">
            Ready to Generate Form
          </h4>
          <p className="text-gray-600 mb-4">
            We'll pre-fill this form with information from your business plan.
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-md mx-auto">
            <h5 className="font-medium text-blue-900 mb-2">What gets pre-filled:</h5>
            <div className="text-sm text-blue-800 space-y-1">
              <div className="flex items-center space-x-2">
                <User className="w-4 h-4" />
                <span>Business & owner information</span>
              </div>
              <div className="flex items-center space-x-2">
                <Building className="w-4 h-4" />
                <span>Business type & description</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4" />
                <span>Location & contact details</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {generatedForm && (
        <div className="space-y-6">
          {/* Form Header */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-6 h-6 text-green-600" />
                <div>
                  <h4 className="font-medium text-green-900">Form Generated Successfully</h4>
                  <p className="text-sm text-green-700">
                    {Math.round(generatedForm.completeness)}% of fields pre-filled from your business plan
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={downloadForm}
                  className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors"
                  title="Download form"
                >
                  <Download className="w-4 h-4" />
                </button>
                <button
                  onClick={printForm}
                  className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors"
                  title="Print form"
                >
                  <Printer className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Completeness Bar */}
          <div>
            <div className="flex justify-between text-sm font-medium text-gray-700 mb-2">
              <span>Form Completeness</span>
              <span>{Math.round(generatedForm.completeness)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${generatedForm.completeness}%` }}
              ></div>
            </div>
          </div>

          {/* Form Fields */}
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">Form Preview</h4>
            {generatedForm.fields.map((field, index) => (
              <div 
                key={index} 
                className={`p-4 border rounded-lg ${
                  field.isFilled ? 'border-green-200 bg-green-50' : 'border-yellow-200 bg-yellow-50'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-gray-900">
                    {index + 1}. {field.label}
                    {field.required && <span className="text-red-500 ml-1">*</span>}
                  </label>
                  {field.isFilled ? (
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-yellow-600" />
                  )}
                </div>
                <div className="text-sm text-gray-700 bg-white border border-gray-200 rounded px-3 py-2">
                  {field.value || (
                    <span className="text-gray-400 italic">
                      [TO BE COMPLETED MANUALLY]
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Instructions */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-2">Next Steps</h4>
            <ol className="list-decimal list-inside text-sm text-blue-800 space-y-1">
              <li>Review all pre-filled information for accuracy</li>
              <li>Complete any remaining fields marked as "[TO BE COMPLETED MANUALLY]"</li>
              <li>Download or print the form for your records</li>
              <li>Submit the completed form to {requirement.agency}</li>
              <li>Update the status in your compliance tracker</li>
            </ol>
          </div>
        </div>
      )}
    </div>
  );
};

export default FormGenerator; 