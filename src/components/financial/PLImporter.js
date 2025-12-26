import React, { useState, useRef, useMemo } from 'react';
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
  DollarSign,
  TrendingUp,
  Calendar,
  BarChart3,
  Calculator,
  History,
  Plus,
  Trash2
} from 'lucide-react';

// Import PDF parsing (will be loaded dynamically)
let pdfjsLib = null;

// Dynamically import libraries to avoid SSR issues
const loadLibraries = async () => {
  if (typeof window !== 'undefined') {
    try {
      if (!pdfjsLib) {
        try {
          pdfjsLib = await import('pdfjs-dist');
          pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
        } catch (e) {
          console.warn('PDF.js library not available:', e);
        }
      }
    } catch (error) {
      console.warn('Document parsing libraries not available:', error);
    }
  }
};

const PLImporter = () => {
  const { state, actions } = useApp();
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [extractedText, setExtractedText] = useState('');
  const [parsedPL, setParsedPL] = useState(null);
  const [error, setError] = useState(null);
  const [importProgress, setImportProgress] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [historicalPLs, setHistoricalPLs] = useState([]); // Store multiple years of P&L data
  const [inflationRate, setInflationRate] = useState(3.0); // Default 3% inflation
  const [revenueGrowthRate, setRevenueGrowthRate] = useState(5.0); // Default 5% revenue growth
  const [projectionYear, setProjectionYear] = useState(new Date().getFullYear() + 1); // Next year
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
    setParsedPL(null);

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
        setImportProgress('Extracting text from P&L PDF...');
        if (pdfjsLib) {
          try {
            const arrayBuffer = await file.arrayBuffer();
            const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
            const pdf = await loadingTask.promise;
            let fullText = '';
            
            for (let i = 1; i <= pdf.numPages; i++) {
              setImportProgress(`Extracting text from page ${i} of ${pdf.numPages}...`);
              const page = await pdf.getPage(i);
              const textContent = await page.getTextContent();
              const pageText = textContent.items.map(item => item.str).join(' ');
              fullText += pageText + '\n';
            }
            
            text = fullText.trim();
          } catch (pdfError) {
            throw new Error('Failed to parse PDF. Please try converting to Word (.docx) or text (.txt) format.');
          }
        } else {
          throw new Error('PDF parsing library not loaded.');
        }
      } else if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
        setImportProgress('Reading text file...');
        text = await file.text();
      } else {
        throw new Error('Unsupported file type. Please use PDF or text format for P&L statements.');
      }

      setExtractedText(text);
      setImportProgress('Analyzing P&L statement with AI...');
      await parsePLWithAI(text);
    } catch (err) {
      setError(err.message || 'Failed to extract text from document.');
      setIsProcessing(false);
    }
  };

  const parsePLWithAI = async (text) => {
    try {
      setImportProgress('AI is extracting financial data from P&L statement...');

      const prompt = `You are a financial data extraction expert specializing in restaurant Profit & Loss (P&L) statements. Extract all financial data from this P&L statement and return it as structured JSON.

P&L Statement text:
${text.substring(0, 20000)} ${text.length > 20000 ? '... (truncated)' : ''}

Extract the following information and return ONLY valid JSON (no markdown, no code blocks, no explanations):

{
  "period": "string (e.g., '2024', 'Q1 2024', 'January 2024')",
  "revenue": {
    "foodSales": number or null,
    "beverageSales": number or null,
    "cateringSales": number or null,
    "merchandiseSales": number or null,
    "otherRevenue": number or null,
    "totalRevenue": number or null
  },
  "cogs": {
    "foodCogs": number or null,
    "beverageCogs": number or null,
    "totalCogs": number or null,
    "foodCogsPercent": number or null,
    "beverageCogsPercent": number or null
  },
  "operatingExpenses": {
    "rent": number or null,
    "utilities": number or null,
    "insurance": number or null,
    "marketing": number or null,
    "legalAccounting": number or null,
    "repairsMaintenance": number or null,
    "supplies": number or null,
    "adminOffice": number or null,
    "otherOperatingExpenses": number or null,
    "salaryOwners": number or null,
    "salaryFullTime": number or null,
    "salaryPartTime": number or null,
    "payrollTaxRate": number or null,
    "depreciation": number or null,
    "amortization": number or null,
    "propertyTaxes": number or null,
    "businessTaxes": number or null,
    "licensesPermits": number or null,
    "bankFees": number or null,
    "creditCardFees": number or null,
    "deliveryCommissions": number or null,
    "wasteRemoval": number or null,
    "pestControl": number or null,
    "securitySystems": number or null,
    "uniformLaundry": number or null,
    "parkingFees": number or null,
    "storageFees": number or null,
    "professionalServices": number or null,
    "technologySupport": number or null,
    "softwareSubscriptions": number or null,
    "inventoryManagement": number or null,
    "qualityControl": number or null,
    "safetyTraining": number or null,
    "equipmentRental": number or null,
    "temporaryStaffing": number or null,
    "consulting": number or null,
    "travelEntertainment": number or null,
    "charitableDonations": number or null,
    "localTaxes": number or null
  },
  "operationalMetrics": {
    "seats": number or null,
    "squareFootage": number or null,
    "averageCheck": {
      "lunch": number or null,
      "dinner": number or null,
      "brunch": number or null,
      "beverages": number or null
    },
    "tableTurnover": {
      "lunch": number or null,
      "dinner": number or null,
      "brunch": number or null,
      "average": number or null
    },
    "occupancyRate": {
      "lunch": number or null,
      "dinner": number or null,
      "brunch": number or null,
      "average": number or null
    },
    "totalCovers": number or null,
    "daysOpen": number or null
  },
  "labor": {
    "totalLaborCost": number or null,
    "laborPercent": number or null,
    "management": [
      {
        "name": "string",
        "hourlyRate": number or null,
        "hoursPerWeek": number or null,
        "annualSalary": number or null
      }
    ],
    "frontOfHouse": [
      {
        "name": "string",
        "hourlyRate": number or null,
        "hoursPerWeek": number or null,
        "tips": number or null
      }
    ],
    "backOfHouse": [
      {
        "name": "string",
        "hourlyRate": number or null,
        "hoursPerWeek": number or null
      }
    ]
  },
  "netIncome": number or null,
  "grossProfit": number or null,
  "grossMargin": number or null,
  "netMargin": number or null
}

Important:
- Extract numbers as numbers, not strings
- If a value is not found, use null
- Calculate percentages if raw numbers are provided (e.g., if food COGS is $50,000 and food sales is $200,000, calculate foodCogsPercent as 0.25)
- For operational metrics, infer from revenue and other data if not explicitly stated
- Return ONLY the JSON object, nothing else`;

      const response = await aiService.generateCompletion(prompt, {
        systemPrompt: 'You are a financial data extraction expert. Extract structured financial data from restaurant P&L statements and return valid JSON only.',
        maxTokens: 4000,
        temperature: 0.2
      });

      let jsonText = response.trim();
      
      if (jsonText.startsWith('```')) {
        jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
      }

      const parsed = JSON.parse(jsonText);
      
      // Add year information if period contains a year
      const yearMatch = parsed.period?.match(/\b(20\d{2})\b/);
      if (yearMatch) {
        parsed.year = parseInt(yearMatch[1]);
      } else {
        // Try to infer year from current date if period is relative
        parsed.year = new Date().getFullYear();
      }
      
      setParsedPL(parsed);
      setShowPreview(true);
      setImportProgress('P&L data extracted successfully!');
    } catch (err) {
      let errorMessage = 'Failed to parse P&L with AI. Please check the file format and try again.';
      
      // Provide specific error messages for quota/billing issues
      if (err.message && (err.message.includes('quota') || err.message.includes('billing') || err.message.includes('exceeded'))) {
        errorMessage = err.message + ' You can still manually enter your P&L data in the Financial Projections section.';
      }
      
      setError(errorMessage);
      setImportProgress('');
    } finally {
      setIsProcessing(false);
    }
  };

  // Add P&L to historical collection
  const handleAddToHistory = () => {
    if (!parsedPL) {
      setError('No P&L data to add. Please wait for the document to be parsed.');
      return;
    }

    // Check if this year already exists
    const existingIndex = historicalPLs.findIndex(pl => pl.year === parsedPL.year);
    if (existingIndex >= 0) {
      if (window.confirm(`A P&L for ${parsedPL.year} already exists. Replace it?`)) {
        const updated = [...historicalPLs];
        updated[existingIndex] = parsedPL;
        setHistoricalPLs(updated);
        actions.showMessage('Success', `P&L for ${parsedPL.year} updated in history.`, 'success');
      }
    } else {
      setHistoricalPLs([...historicalPLs, parsedPL].sort((a, b) => (b.year || 0) - (a.year || 0)));
      actions.showMessage('Success', `P&L for ${parsedPL.year || parsedPL.period} added to history.`, 'success');
    }

    // Reset current upload
    setUploadedFile(null);
    setExtractedText('');
    setParsedPL(null);
    setShowPreview(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Calculate year-over-year trends
  const yearOverYearTrends = useMemo(() => {
    if (historicalPLs.length < 2) return null;

    const sorted = [...historicalPLs].sort((a, b) => (a.year || 0) - (b.year || 0));
    const trends = {};

    // Calculate trends for key metrics
    for (let i = 1; i < sorted.length; i++) {
      const current = sorted[i];
      const previous = sorted[i - 1];
      const yearDiff = (current.year || 0) - (previous.year || 0);

      if (yearDiff > 0) {
        const revenueGrowth = previous.revenue?.totalRevenue 
          ? ((current.revenue?.totalRevenue || 0) - (previous.revenue.totalRevenue || 0)) / previous.revenue.totalRevenue * 100
          : null;

        const expenseGrowth = previous.operatingExpenses 
          ? Object.keys(previous.operatingExpenses).reduce((acc, key) => {
              const prevVal = previous.operatingExpenses[key] || 0;
              const currVal = current.operatingExpenses?.[key] || 0;
              if (prevVal > 0) {
                acc[key] = ((currVal - prevVal) / prevVal) * 100;
              }
              return acc;
            }, {})
          : null;

        trends[`${previous.year}_to_${current.year}`] = {
          years: `${previous.year} → ${current.year}`,
          revenueGrowth,
          expenseGrowth,
          grossMarginChange: (current.grossMargin || 0) - (previous.grossMargin || 0),
          netMarginChange: (current.netMargin || 0) - (previous.netMargin || 0)
        };
      }
    }

    return trends;
  }, [historicalPLs]);

  // Calculate projected costs for next year
  const projectedCosts = useMemo(() => {
    if (historicalPLs.length === 0) return null;

    const latestPL = historicalPLs.sort((a, b) => (b.year || 0) - (a.year || 0))[0];
    const yearsFromLatest = projectionYear - (latestPL.year || new Date().getFullYear());

    // Calculate average growth rates from historical data
    let avgRevenueGrowth = revenueGrowthRate;
    let avgExpenseGrowth = inflationRate;

    if (historicalPLs.length >= 2) {
      const sorted = [...historicalPLs].sort((a, b) => (a.year || 0) - (b.year || 0));
      let totalRevenueGrowth = 0;
      let revenueGrowthCount = 0;

      for (let i = 1; i < sorted.length; i++) {
        const current = sorted[i];
        const previous = sorted[i - 1];
        if (previous.revenue?.totalRevenue && current.revenue?.totalRevenue) {
          const growth = ((current.revenue.totalRevenue - previous.revenue.totalRevenue) / previous.revenue.totalRevenue) * 100;
          totalRevenueGrowth += growth;
          revenueGrowthCount++;
        }
      }

      if (revenueGrowthCount > 0) {
        avgRevenueGrowth = totalRevenueGrowth / revenueGrowthCount;
      }
    }

    // Project revenue
    const baseRevenue = latestPL.revenue?.totalRevenue || 0;
    const projectedRevenue = baseRevenue * Math.pow(1 + avgRevenueGrowth / 100, yearsFromLatest);

    // Project expenses with inflation
    const projectedExpenses = {};
    if (latestPL.operatingExpenses) {
      Object.keys(latestPL.operatingExpenses).forEach(key => {
        const baseValue = latestPL.operatingExpenses[key] || 0;
        if (baseValue > 0) {
          // Apply inflation rate
          projectedExpenses[key] = baseValue * Math.pow(1 + avgExpenseGrowth / 100, yearsFromLatest);
        }
      });
    }

    // Project COGS (typically grows with revenue)
    const projectedCogs = {};
    if (latestPL.cogs) {
      const foodCogsPercent = latestPL.cogs.foodCogsPercent || 0.28;
      const beverageCogsPercent = latestPL.cogs.beverageCogsPercent || 0.20;
      
      projectedCogs.foodCogsPercent = foodCogsPercent;
      projectedCogs.beverageCogsPercent = beverageCogsPercent;
      
      if (latestPL.revenue?.foodSales) {
        projectedCogs.foodCogs = (latestPL.revenue.foodSales * Math.pow(1 + avgRevenueGrowth / 100, yearsFromLatest)) * foodCogsPercent;
      }
      if (latestPL.revenue?.beverageSales) {
        projectedCogs.beverageCogs = (latestPL.revenue.beverageSales * Math.pow(1 + avgRevenueGrowth / 100, yearsFromLatest)) * beverageCogsPercent;
      }
    }

    // Project labor (grows with inflation + potential wage increases)
    const laborInflation = avgExpenseGrowth + 2; // Labor typically grows faster than general inflation
    const projectedLabor = latestPL.labor?.totalLaborCost 
      ? latestPL.labor.totalLaborCost * Math.pow(1 + laborInflation / 100, yearsFromLatest)
      : null;

    return {
      year: projectionYear,
      revenue: {
        totalRevenue: projectedRevenue,
        foodSales: latestPL.revenue?.foodSales ? latestPL.revenue.foodSales * Math.pow(1 + avgRevenueGrowth / 100, yearsFromLatest) : null,
        beverageSales: latestPL.revenue?.beverageSales ? latestPL.revenue.beverageSales * Math.pow(1 + avgRevenueGrowth / 100, yearsFromLatest) : null
      },
      cogs: projectedCogs,
      operatingExpenses: projectedExpenses,
      labor: {
        totalLaborCost: projectedLabor,
        laborPercent: latestPL.labor?.laborPercent || null
      },
      assumptions: {
        revenueGrowthRate: avgRevenueGrowth,
        inflationRate: avgExpenseGrowth,
        yearsFromLatest
      }
    };
  }, [historicalPLs, inflationRate, revenueGrowthRate, projectionYear]);

  const handleImport = () => {
    if (!parsedPL && historicalPLs.length === 0) {
      setError('No P&L data to import. Please wait for the document to be parsed or add it to history first.');
      return;
    }

    try {
      // Use projected costs if available, otherwise use latest historical or current parsed
      const dataToImport = projectedCosts || (historicalPLs.length > 0 ? historicalPLs.sort((a, b) => (b.year || 0) - (a.year || 0))[0] : null) || parsedPL;
      
      if (!dataToImport) {
        setError('No data available to import.');
        return;
      }

      // Import revenue data
      if (dataToImport.revenue) {
        actions.updateFinancialData('revenue', {
          ...state.financialData?.revenue,
          ...dataToImport.revenue
        });
      }

      // Import COGS data
      if (dataToImport.cogs) {
        const cogsData = {
          ...state.financialData?.cogs,
          foodCogsPercent: dataToImport.cogs.foodCogsPercent || 
            (dataToImport.cogs.foodCogs && dataToImport.revenue?.foodSales 
              ? dataToImport.cogs.foodCogs / dataToImport.revenue.foodSales 
              : state.financialData?.cogs?.foodCogsPercent || 0.28),
          beverageCogsPercent: dataToImport.cogs.beverageCogsPercent || 
            (dataToImport.cogs.beverageCogs && dataToImport.revenue?.beverageSales 
              ? dataToImport.cogs.beverageCogs / dataToImport.revenue.beverageSales 
              : state.financialData?.cogs?.beverageCogsPercent || 0.20)
        };
        actions.updateFinancialData('cogs', cogsData);
      }

      // Import operating expenses
      if (dataToImport.operatingExpenses) {
        actions.updateFinancialData('operatingExpenses', {
          ...state.financialData?.operatingExpenses,
          ...dataToImport.operatingExpenses
        });
      }

      // Import operational metrics
      if (dataToImport.operationalMetrics) {
        const opsData = {
          ...state.financialData?.restaurantOperations,
          seats: dataToImport.operationalMetrics.seats || state.financialData?.restaurantOperations?.seats || 50,
          squareFootage: dataToImport.operationalMetrics.squareFootage || state.financialData?.restaurantOperations?.squareFootage || 2000,
          averageCheck: {
            ...state.financialData?.restaurantOperations?.averageCheck,
            ...dataToImport.operationalMetrics.averageCheck
          },
          tableTurnover: {
            ...state.financialData?.restaurantOperations?.tableTurnover,
            ...dataToImport.operationalMetrics.tableTurnover
          },
          occupancyRate: {
            ...state.financialData?.restaurantOperations?.occupancyRate,
            ...dataToImport.operationalMetrics.occupancyRate
          }
        };
        actions.updateFinancialData('restaurantOperations', opsData);
      }

      // Import labor data
      if (dataToImport.labor) {
        const laborData = {
          ...state.financialData?.operatingExpenses?.labor,
          management: dataToImport.labor.management || state.financialData?.operatingExpenses?.labor?.management || [],
          frontOfHouse: dataToImport.labor.frontOfHouse || state.financialData?.operatingExpenses?.labor?.frontOfHouse || [],
          backOfHouse: dataToImport.labor.backOfHouse || state.financialData?.operatingExpenses?.labor?.backOfHouse || []
        };
        actions.updateFinancialData('operatingExpenses', {
          ...state.financialData?.operatingExpenses,
          labor: laborData
        });
      }

      const sourceText = projectedCosts 
        ? `projected costs for ${projectionYear} based on historical P&L data`
        : dataToImport?.year
        ? `P&L data from ${dataToImport.year}`
        : dataToImport?.period
        ? `P&L data from ${dataToImport.period}`
        : `historical P&L data`;
      
      actions.showMessage('Success', `${sourceText} imported successfully! Review your financial projections.`, 'success');
      
      // Reset
      setUploadedFile(null);
      setExtractedText('');
      setParsedPL(null);
      setShowPreview(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err) {
      setError('Failed to import P&L data. Please try again.');
    }
  };

  const formatCurrency = (value) => {
    if (value === null || value === undefined) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const formatPercent = (value) => {
    if (value === null || value === undefined) return 'N/A';
    return `${value.toFixed(1)}%`;
  };

  return (
    <SectionCard 
      title="Import P&L Statement" 
      description="Upload a Profit & Loss statement (PDF or text) to automatically extract financial data and populate your projections"
      color="green"
      icon={DollarSign}
    >
      <div className="space-y-6">
        {/* File Upload Area */}
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-green-400 transition-colors">
          <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Upload P&L Statement
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
            id="pl-file-input"
          />
          
          <label
            htmlFor="pl-file-input"
            className="inline-block bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors cursor-pointer"
          >
            <Upload className="w-5 h-5 inline-block mr-2" />
            Choose P&L File
          </label>
        </div>

        {/* Processing Status */}
        {isProcessing && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
              <div>
                <div className="font-medium text-blue-900">Processing...</div>
                <div className="text-sm text-blue-700">{importProgress}</div>
              </div>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <div className="text-red-900">{error}</div>
            </div>
          </div>
        )}

        {/* Success Message */}
        {parsedPL && !isProcessing && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <div className="text-green-900 font-medium">
                P&L data extracted successfully! Review the preview below and import when ready.
              </div>
            </div>
          </div>
        )}

        {/* P&L Preview */}
        {parsedPL && showPreview && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-lg font-semibold text-gray-900 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
                Extracted P&L Data Preview
              </h4>
              <button
                onClick={() => setShowPreview(!showPreview)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              {parsedPL.period && (
                <div>
                  <span className="font-medium">Period:</span> {parsedPL.period}
                </div>
              )}
              {parsedPL.revenue?.totalRevenue && (
                <div>
                  <span className="font-medium">Total Revenue:</span> ${parsedPL.revenue.totalRevenue.toLocaleString()}
                </div>
              )}
              {parsedPL.grossProfit && (
                <div>
                  <span className="font-medium">Gross Profit:</span> ${parsedPL.grossProfit.toLocaleString()}
                </div>
              )}
              {parsedPL.grossMargin && (
                <div>
                  <span className="font-medium">Gross Margin:</span> {(parsedPL.grossMargin * 100).toFixed(1)}%
                </div>
              )}
              {parsedPL.netIncome && (
                <div>
                  <span className="font-medium">Net Income:</span> ${parsedPL.netIncome.toLocaleString()}
                </div>
              )}
              {parsedPL.netMargin && (
                <div>
                  <span className="font-medium">Net Margin:</span> {(parsedPL.netMargin * 100).toFixed(1)}%
                </div>
              )}
              {parsedPL.operationalMetrics?.seats && (
                <div>
                  <span className="font-medium">Seats:</span> {parsedPL.operationalMetrics.seats}
                </div>
              )}
              {parsedPL.labor?.totalLaborCost && (
                <div>
                  <span className="font-medium">Total Labor Cost:</span> ${parsedPL.labor.totalLaborCost.toLocaleString()}
                </div>
              )}
            </div>

            <button
              onClick={handleImport}
              className="w-full bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
            >
              <Sparkles className="w-5 h-5" />
              <span>Import P&L Data to Financial Projections</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Help Text */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Sparkles className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-900">
              <p className="font-medium mb-1">How it works for existing business purchases:</p>
              <ul className="list-disc list-inside space-y-1 text-blue-700">
                <li>Upload multiple years of P&L statements to build a historical database</li>
                <li>AI extracts revenue, expenses, COGS, and operational metrics from each statement</li>
                <li>Add each P&L to your history to track year-over-year trends</li>
                <li>View automatic trend analysis showing revenue growth, expense changes, and margin shifts</li>
                <li>Use the Projected Costs Calculator to estimate next year's costs based on historical trends</li>
                <li>Adjust inflation and growth rates to customize projections</li>
                <li>Import projected costs directly into your financial projections</li>
                <li>Perfect for due diligence when buying an existing restaurant!</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </SectionCard>
  );
};

export default PLImporter;

