import React, { useState, useRef } from 'react';
import { useApp } from '../../contexts/AppContext';
import { aiService } from '../../services/aiService';
import SectionCard from '../ui/SectionCard';
import { 
  Upload, 
  FileText, 
  Loader2, 
  CheckCircle, 
  AlertCircle, 
  Sparkles,
  File,
  X,
  ArrowRight,
  Lightbulb
} from 'lucide-react';

// Import PDF parsing (will be loaded dynamically)
let pdfjsLib = null;
let mammoth = null;

// Dynamically import libraries to avoid SSR issues
const loadLibraries = async () => {
  if (typeof window !== 'undefined') {
    try {
      // Use pdfjs-dist for browser-compatible PDF parsing
      if (!pdfjsLib) {
        try {
          pdfjsLib = await import('pdfjs-dist');
          // Set worker path for pdfjs
          pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
        } catch (e) {
          console.warn('PDF.js library not available:', e);
        }
      }
      if (!mammoth) {
        mammoth = (await import('mammoth')).default;
      }
    } catch (error) {
      console.warn('Document parsing libraries not available:', error);
    }
  }
};

const DocumentImporter = () => {
  const { state, actions } = useApp();
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [extractedText, setExtractedText] = useState('');
  const [parsedData, setParsedData] = useState(null);
  const [error, setError] = useState(null);
  const [importProgress, setImportProgress] = useState('');
  const [sectionsToImport, setSectionsToImport] = useState({
    executiveSummary: true,
    marketAnalysis: true,
    financialData: true,
    operations: true,
    management: true,
    marketing: true
  });
  const fileInputRef = useRef(null);

  const acceptedTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain'
  ];

  const maxFileSize = 10 * 1024 * 1024; // 10MB

  const handleFileSelect = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file
    if (file.size > maxFileSize) {
      setError(`File is too large. Maximum size is 10MB.`);
      return;
    }

    if (!acceptedTypes.includes(file.type) && !file.name.endsWith('.pdf') && !file.name.endsWith('.doc') && !file.name.endsWith('.docx') && !file.name.endsWith('.txt')) {
      setError('Unsupported file type. Please upload PDF, Word, or text files.');
      return;
    }

    setUploadedFile(file);
    setError(null);
    setExtractedText('');
    setParsedData(null);

    // Extract text from document
    await extractTextFromFile(file);
  };

  const extractTextFromFile = async (file) => {
    setIsProcessing(true);
    setImportProgress('Loading document parser...');
    setError(null);

    try {
      await loadLibraries();

      let text = '';

      if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
        setImportProgress('Extracting text from PDF...');
        if (pdfjsLib) {
          try {
            const arrayBuffer = await file.arrayBuffer();
            const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
            const pdf = await loadingTask.promise;
            let fullText = '';
            
            // Extract text from all pages
            for (let i = 1; i <= pdf.numPages; i++) {
              setImportProgress(`Extracting text from PDF page ${i} of ${pdf.numPages}...`);
              const page = await pdf.getPage(i);
              const textContent = await page.getTextContent();
              const pageText = textContent.items.map(item => item.str).join(' ');
              fullText += pageText + '\n';
            }
            
            text = fullText.trim();
          } catch (pdfError) {
            console.error('PDF parsing error:', pdfError);
            throw new Error('Failed to parse PDF. Please try converting to Word (.docx) or text (.txt) format.');
          }
        } else {
          throw new Error('PDF parsing library not loaded. Please convert your PDF to Word (.docx) or text (.txt) format for best results.');
        }
      } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || file.name.endsWith('.docx')) {
        setImportProgress('Extracting text from Word document...');
        if (mammoth) {
          const arrayBuffer = await file.arrayBuffer();
          const result = await mammoth.extractRawText({ arrayBuffer });
          text = result.value;
        } else {
          text = 'Word document parsing library not available.';
        }
      } else if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
        setImportProgress('Reading text file...');
        text = await file.text();
      } else {
        throw new Error('Unsupported file type');
      }

      if (!text || text.trim().length === 0) {
        throw new Error('No text could be extracted from the document.');
      }

      setExtractedText(text);
      setImportProgress('Analyzing document with AI...');
      
      // Use AI to parse and structure the data
      await parseDocumentWithAI(text);
    } catch (err) {
      console.error('Error extracting text:', err);
      setError(err.message || 'Failed to extract text from document. Please try a different file format.');
      setIsProcessing(false);
    }
  };

  const parseDocumentWithAI = async (text) => {
    try {
      setImportProgress('AI is analyzing your document...');

      const prompt = `You are a restaurant business plan parser. Extract structured data from this business plan document and return it as JSON.

Document text:
${text.substring(0, 15000)} ${text.length > 15000 ? '... (truncated)' : ''}

Extract the following information and return ONLY valid JSON (no markdown, no code blocks):

{
  "executiveSummary": {
    "businessName": "string or null",
    "businessType": "string or null",
    "location": "string or null",
    "missionStatement": "string or null",
    "keySuccessFactors": "string or null",
    "financialSummary": "string or null"
  },
  "marketAnalysis": {
    "targetMarket": "string or null",
    "marketSize": "string or null",
    "competitiveAnalysis": "string or null",
    "marketTrends": "string or null",
    "customerDemographics": "string or null"
  },
  "financialData": {
    "revenue": {
      "foodSales": number or null,
      "beverageSales": number or null
    },
    "operatingExpenses": {
      "rent": number or null,
      "utilities": number or null,
      "marketing": number or null
    },
    "startupCosts": {
      "totalBuildCost": number or null,
      "purchasePrice": number or null,
      "renovationCosts": number or null,
      "kitchenEquipment": number or null,
      "furnitureFixtures": number or null,
      "initialInventory": number or null
    }
  },
  "operations": {
    "location": "string or null",
    "facilityRequirements": "string or null",
    "hoursOfOperation": "string or null",
    "staffingPlan": "string or null"
  },
  "management": {
    "keyPersonnel": "string or null"
  },
  "marketing": {
    "marketingMix": "string or null",
    "customerAcquisition": "string or null"
  }
}

If information is not found, use null. Extract numbers as numbers, not strings. Return ONLY the JSON object, nothing else.`;

      const response = await aiService.generateCompletion(prompt, {
        systemPrompt: 'You are a data extraction expert. Extract structured data from business plan documents and return valid JSON only.',
        maxTokens: 3000,
        temperature: 0.3
      });

      // Try to extract JSON from response
      let jsonText = response.trim();
      
      // Remove markdown code blocks if present
      if (jsonText.startsWith('```')) {
        jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
      }

      // Try to parse JSON
      const parsed = JSON.parse(jsonText);
      setParsedData(parsed);
      setImportProgress('Document parsed successfully!');
    } catch (err) {
      let errorMessage = 'Failed to parse document with AI. The text has been extracted - you can review it below.';
      
      // Provide specific error messages for quota/billing issues
      if (err.message && (err.message.includes('quota') || err.message.includes('billing') || err.message.includes('exceeded'))) {
        errorMessage = err.message + ' You can still manually review the extracted text below and enter data manually.';
      }
      
      setError(errorMessage);
      setImportProgress('');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleImport = () => {
    if (!parsedData) {
      setError('No data to import. Please wait for the document to be parsed.');
      return;
    }

    try {
      // Import selected sections
      if (sectionsToImport.executiveSummary && parsedData.executiveSummary) {
        actions.updateBusinessPlan('executiveSummary', {
          ...state.businessPlan?.executiveSummary,
          ...parsedData.executiveSummary
        });
      }

      if (sectionsToImport.marketAnalysis && parsedData.marketAnalysis) {
        actions.updateBusinessPlan('marketAnalysis', {
          ...state.businessPlan?.marketAnalysis,
          ...parsedData.marketAnalysis
        });
      }

      if (sectionsToImport.financialData && parsedData.financialData) {
        actions.updateFinancialData('revenue', {
          ...state.financialData?.revenue,
          ...parsedData.financialData.revenue
        });
        actions.updateFinancialData('operatingExpenses', {
          ...state.financialData?.operatingExpenses,
          ...parsedData.financialData.operatingExpenses
        });
        actions.updateFinancialData('startupCosts', {
          ...state.financialData?.startupCosts,
          ...parsedData.financialData.startupCosts
        });
      }

      if (sectionsToImport.operations && parsedData.operations) {
        actions.updateBusinessPlan('operationsPlan', {
          ...state.businessPlan?.operationsPlan,
          ...parsedData.operations
        });
      }

      if (sectionsToImport.management && parsedData.management) {
        actions.updateBusinessPlan('managementTeam', {
          ...state.businessPlan?.managementTeam,
          ...parsedData.management
        });
      }

      if (sectionsToImport.marketing && parsedData.marketing) {
        actions.updateBusinessPlan('marketingStrategy', {
          ...state.businessPlan?.marketingStrategy,
          ...parsedData.marketing
        });
      }

      actions.showMessage('Success', 'Document imported successfully! Review your data in the respective sections.', 'success');
      
      // Reset
      setUploadedFile(null);
      setExtractedText('');
      setParsedData(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err) {
      console.error('Error importing data:', err);
      setError('Failed to import data. Please try again.');
    }
  };

  return (
    <SectionCard 
      title="Import from Existing Document" 
      description="Upload a PDF, Word document, or text file containing your business plan to automatically extract and import information"
      color="blue"
      icon={Upload}
    >
      <div className="space-y-6">
        {/* File Upload Area */}
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
          <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Upload Your Business Plan Document
          </h3>
          <p className="text-gray-600 mb-4">
            Supported formats: PDF, Word (.doc, .docx), or Text (.txt)
          </p>
          
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.doc,.docx,.txt,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain"
            onChange={handleFileSelect}
            className="hidden"
            disabled={isProcessing}
          />
          
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isProcessing}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 mx-auto"
          >
            <FileText className="w-5 h-5" />
            <span>{isProcessing ? 'Processing...' : 'Choose File'}</span>
          </button>

          {uploadedFile && !isProcessing && (
            <div className="mt-4 flex items-center justify-center space-x-2 text-sm text-gray-600">
              <File className="w-4 h-4" />
              <span>{uploadedFile.name}</span>
              <button
                onClick={() => {
                  setUploadedFile(null);
                  setExtractedText('');
                  setParsedData(null);
                  if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                  }
                }}
                className="text-red-600 hover:text-red-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Processing Status */}
        {isProcessing && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
              <div className="flex-1">
                <p className="text-sm font-medium text-blue-900">{importProgress}</p>
                <p className="text-xs text-blue-700 mt-1">This may take 30-60 seconds...</p>
              </div>
            </div>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-red-900">Error</p>
                <p className="text-sm text-red-700 mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Extracted Text Preview */}
        {extractedText && !isProcessing && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-gray-900 mb-2">
              Extracted Text Preview
            </h4>
            <div className="max-h-40 overflow-y-auto text-xs text-gray-700">
              {extractedText.substring(0, 500)}
              {extractedText.length > 500 && '...'}
            </div>
          </div>
        )}

        {/* Parsed Data Preview */}
        {parsedData && !isProcessing && (
          <div className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-3">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <h4 className="text-sm font-semibold text-green-900">
                  Document Parsed Successfully!
                </h4>
              </div>
              <p className="text-sm text-green-700">
                AI has extracted structured data from your document. Select which sections to import below.
              </p>
            </div>

            {/* Section Selection */}
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h4 className="text-sm font-semibold text-gray-900 mb-3">
                Select Sections to Import
              </h4>
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(sectionsToImport).map(([key, value]) => {
                  const sectionNames = {
                    executiveSummary: 'Executive Summary',
                    marketAnalysis: 'Market Analysis',
                    financialData: 'Financial Data',
                    operations: 'Operations Plan',
                    management: 'Management Team',
                    marketing: 'Marketing Strategy'
                  };
                  
                  const hasData = parsedData[key] && Object.values(parsedData[key]).some(v => v !== null && v !== '');
                  
                  return (
                    <label
                      key={key}
                      className={`flex items-center space-x-2 p-2 rounded border ${
                        hasData
                          ? 'border-green-200 bg-green-50'
                          : 'border-gray-200 bg-gray-50 opacity-50'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={value && hasData}
                        onChange={(e) => setSectionsToImport({
                          ...sectionsToImport,
                          [key]: e.target.checked
                        })}
                        disabled={!hasData}
                        className="rounded border-gray-300 text-blue-600"
                      />
                      <span className="text-sm text-gray-700">
                        {sectionNames[key]}
                        {!hasData && ' (no data found)'}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Import Button */}
            <button
              onClick={handleImport}
              className="w-full bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
            >
              <Sparkles className="w-5 h-5" />
              <span>Import Selected Sections</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Help Text */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Lightbulb className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-900">
              <p className="font-medium mb-1">How it works:</p>
              <ul className="list-disc list-inside space-y-1 text-blue-700">
                <li>Upload your existing business plan document (PDF, Word, or text)</li>
                <li>AI extracts text and identifies key information</li>
                <li>Select which sections to import into your plan</li>
                <li>Review and edit the imported data in the respective sections</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </SectionCard>
  );
};

export default DocumentImporter;

