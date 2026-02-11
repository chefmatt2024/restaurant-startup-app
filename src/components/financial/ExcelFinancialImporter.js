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
  DollarSign,
  Table,
  Eye,
  Download
} from 'lucide-react';

// Dynamically import xlsx library
let XLSX = null;

const loadXLSX = async () => {
  if (typeof window !== 'undefined' && !XLSX) {
    try {
      XLSX = await import('xlsx');
    } catch (error) {
      console.warn('XLSX library not available:', error);
      throw new Error('Excel parsing library not available. Please install xlsx package.');
    }
  }
  return XLSX;
};

const ExcelFinancialImporter = () => {
  const { state, actions } = useApp();
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [parsedData, setParsedData] = useState(null);
  const [error, setError] = useState(null);
  const [importProgress, setImportProgress] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [columnMapping, setColumnMapping] = useState(null);
  const [worksheetData, setWorksheetData] = useState(null);
  const fileInputRef = useRef(null);

  const acceptedTypes = [
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
    'application/vnd.ms-excel', // .xls
  ];

  const maxFileSize = 10 * 1024 * 1024; // 10MB

  // Field mappings for financial data
  const fieldMappings = {
    // Revenue fields
    revenue: {
      'food sales': 'foodSales',
      'food revenue': 'foodSales',
      'food': 'foodSales',
      'beverage sales': 'beverageSales',
      'beverage revenue': 'beverageSales',
      'beverage': 'beverageSales',
      'bar sales': 'beverageSales',
      'merchandise sales': 'merchandiseSales',
      'merchandise': 'merchandiseSales',
      'catering sales': 'cateringSales',
      'catering': 'cateringSales',
      'other revenue': 'otherRevenue',
      'other': 'otherRevenue',
      'total revenue': 'totalRevenue',
      'revenue': 'totalRevenue'
    },
    // COGS fields
    cogs: {
      'food cost': 'foodCogsPercent',
      'food cost %': 'foodCogsPercent',
      'food cogs': 'foodCogsPercent',
      'food cost percent': 'foodCogsPercent',
      'beverage cost': 'beverageCogsPercent',
      'beverage cost %': 'beverageCogsPercent',
      'beverage cogs': 'beverageCogsPercent',
      'beverage cost percent': 'beverageCogsPercent',
      'merchandise cost': 'merchandiseCogsPercent',
      'merchandise cost %': 'merchandiseCogsPercent',
      'catering cost': 'cateringCogsPercent',
      'catering cost %': 'cateringCogsPercent'
    },
    // Operating Expenses
    operatingExpenses: {
      'rent': 'rent',
      'rental': 'rent',
      'lease': 'rent',
      'utilities': 'utilities',
      'utility': 'utilities',
      'insurance': 'insurance',
      'marketing': 'marketing',
      'advertising': 'marketing',
      'legal': 'legalAccounting',
      'accounting': 'legalAccounting',
      'legal & accounting': 'legalAccounting',
      'repairs': 'repairsMaintenance',
      'maintenance': 'repairsMaintenance',
      'repairs & maintenance': 'repairsMaintenance',
      'supplies': 'supplies',
      'office': 'adminOffice',
      'admin': 'adminOffice',
      'other expenses': 'otherOperatingExpenses',
      'other': 'otherOperatingExpenses',
      'owner salary': 'salaryOwners',
      'owner pay': 'salaryOwners',
      'full time': 'salaryFullTime',
      'full-time': 'salaryFullTime',
      'ft staff': 'salaryFullTime',
      'part time': 'salaryPartTime',
      'part-time': 'salaryPartTime',
      'pt staff': 'salaryPartTime',
      'payroll tax': 'payrollTaxRate',
      'payroll tax rate': 'payrollTaxRate'
    },
    // Startup Costs
    startupCosts: {
      'leasehold improvements': 'leaseholdImprovements',
      'build out': 'leaseholdImprovements',
      'renovations': 'leaseholdImprovements',
      'kitchen equipment': 'kitchenEquipment',
      'equipment': 'kitchenEquipment',
      'furniture': 'furnitureFixtures',
      'fixtures': 'furnitureFixtures',
      'furniture & fixtures': 'furnitureFixtures',
      'initial inventory': 'initialInventory',
      'inventory': 'initialInventory',
      'pre-opening': 'preOpeningSalaries',
      'pre opening salaries': 'preOpeningSalaries',
      'deposits': 'depositsLicenses',
      'licenses': 'depositsLicenses',
      'deposits & licenses': 'depositsLicenses',
      'marketing': 'initialMarketing',
      'initial marketing': 'initialMarketing',
      'contingency': 'contingency',
      'reserve': 'contingency'
    },
    // Restaurant Operations
    restaurantOperations: {
      'seats': 'seats',
      'capacity': 'seats',
      'square footage': 'squareFootage',
      'sq ft': 'squareFootage',
      'square feet': 'squareFootage'
    }
  };

  const handleFileSelect = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > maxFileSize) {
      setError(`File is too large. Maximum size is 10MB.`);
      return;
    }

    const isExcel = acceptedTypes.includes(file.type) || 
                    file.name.endsWith('.xlsx') || 
                    file.name.endsWith('.xls');

    if (!isExcel) {
      setError('Unsupported file type. Please upload Excel files (.xlsx or .xls).');
      return;
    }

    setUploadedFile(file);
    setError(null);
    setParsedData(null);
    setWorksheetData(null);
    setColumnMapping(null);

    await parseExcelFile(file);
  };

  const parseExcelFile = async (file) => {
    setIsProcessing(true);
    setImportProgress('Loading Excel parser...');
    setError(null);

    try {
      const xlsx = await loadXLSX();
      if (!xlsx) {
        throw new Error('Excel parsing library not available.');
      }

      setImportProgress('Reading Excel file...');
      const arrayBuffer = await file.arrayBuffer();
      const workbook = xlsx.read(arrayBuffer, { type: 'array' });

      // Get first worksheet (or let user select)
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];

      setImportProgress('Parsing worksheet data...');
      
      // Convert to JSON
      const jsonData = xlsx.utils.sheet_to_json(worksheet, { 
        header: 1, // Use first row as headers
        defval: null,
        raw: false
      });

      if (jsonData.length === 0) {
        throw new Error('Excel file appears to be empty.');
      }

      setWorksheetData({
        sheetName: firstSheetName,
        data: jsonData,
        allSheets: workbook.SheetNames
      });

      setImportProgress('Analyzing data structure with AI...');
      await analyzeAndMapData(jsonData);
    } catch (err) {
      setError(err.message || 'Failed to parse Excel file.');
      setIsProcessing(false);
    }
  };

  const analyzeAndMapData = async (data) => {
    try {
      // Find header row (first non-empty row)
      let headerRowIndex = 0;
      for (let i = 0; i < data.length; i++) {
        if (data[i] && data[i].length > 0 && data[i].some(cell => cell && cell.toString().trim())) {
          headerRowIndex = i;
          break;
        }
      }

      const headers = data[headerRowIndex] || [];
      const dataRows = data.slice(headerRowIndex + 1).filter(row => 
        row && row.some(cell => cell !== null && cell !== undefined && cell !== '')
      );

      // Use AI to help identify and map columns
      const headersText = headers.map(h => h ? h.toString().trim() : '').join(', ');
      const sampleData = dataRows.slice(0, 5).map(row => 
        row.map(cell => cell ? cell.toString().trim() : '').join(', ')
      ).join('\n');

      const aiPrompt = `Analyze this Excel financial projection data and identify which columns map to restaurant financial fields.

Headers: ${headersText}

Sample data rows:
${sampleData}

Map these columns to restaurant financial data fields. Return a JSON object with this structure:
{
  "revenue": { "column_index": "field_name", ... },
  "cogs": { "column_index": "field_name", ... },
  "operatingExpenses": { "column_index": "field_name", ... },
  "startupCosts": { "column_index": "field_name", ... },
  "restaurantOperations": { "column_index": "field_name", ... }
}

Available fields:
- Revenue: foodSales, beverageSales, merchandiseSales, cateringSales, otherRevenue
- COGS: foodCogsPercent, beverageCogsPercent, merchandiseCogsPercent, cateringCogsPercent
- Operating Expenses: rent, utilities, insurance, marketing, legalAccounting, repairsMaintenance, supplies, adminOffice, otherOperatingExpenses, salaryOwners, salaryFullTime, salaryPartTime, payrollTaxRate
- Startup Costs: leaseholdImprovements, kitchenEquipment, furnitureFixtures, initialInventory, preOpeningSalaries, depositsLicenses, initialMarketing, contingency
- Restaurant Operations: seats, squareFootage

Only map columns that clearly match. Use column index (0-based) as keys.`;

      const aiResponse = await aiService.generateCompletion(aiPrompt, {
        maxTokens: 1500,
        temperature: 0.3
      });

      // Try to parse AI response (might be JSON or text with JSON)
      let mapping = {};
      try {
        // Extract JSON from response
        const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          mapping = JSON.parse(jsonMatch[0]);
        }
      } catch (e) {
        console.warn('Could not parse AI mapping, using manual matching:', e);
      }

      // Fallback: Manual column matching
      if (!mapping || Object.keys(mapping).length === 0) {
        mapping = manualColumnMatching(headers, dataRows);
      }

      setColumnMapping({
        headers,
        headerRowIndex,
        mapping,
        dataRows
      });

      setImportProgress('Extracting financial data...');
      const extractedData = extractFinancialData(headers, dataRows, mapping);
      setParsedData(extractedData);
      setIsProcessing(false);
    } catch (err) {
      console.error('Error analyzing data:', err);
      // Fallback to manual matching
      const headers = data[0] || [];
      const dataRows = data.slice(1);
      const mapping = manualColumnMatching(headers, dataRows);
      setColumnMapping({
        headers,
        headerRowIndex: 0,
        mapping,
        dataRows
      });
      const extractedData = extractFinancialData(headers, dataRows, mapping);
      setParsedData(extractedData);
      setIsProcessing(false);
    }
  };

  const manualColumnMatching = (headers, dataRows) => {
    const mapping = {
      revenue: {},
      cogs: {},
      operatingExpenses: {},
      startupCosts: {},
      restaurantOperations: {}
    };

    headers.forEach((header, index) => {
      if (!header) return;
      const headerLower = header.toString().toLowerCase().trim();

      // Check all field mappings
      Object.keys(fieldMappings).forEach(section => {
        Object.keys(fieldMappings[section]).forEach(key => {
          if (headerLower.includes(key)) {
            if (!mapping[section]) mapping[section] = {};
            mapping[section][index] = fieldMappings[section][key];
          }
        });
      });
    });

    return mapping;
  };

  const extractFinancialData = (headers, dataRows, mapping) => {
    const financialData = {
      revenue: {},
      cogs: {},
      operatingExpenses: {},
      startupCosts: {},
      restaurantOperations: {}
    };

    // Extract values from first data row (or sum if multiple rows)
    const firstRow = dataRows[0] || [];
    
    // Revenue
    if (mapping.revenue) {
      Object.keys(mapping.revenue).forEach(colIndex => {
        const field = mapping.revenue[colIndex];
        const value = parseFloat(firstRow[colIndex]) || 0;
        if (value > 0) {
          financialData.revenue[field] = value;
        }
      });
    }

    // COGS (might be percentages or dollar amounts)
    if (mapping.cogs) {
      Object.keys(mapping.cogs).forEach(colIndex => {
        const field = mapping.cogs[colIndex];
        let value = parseFloat(firstRow[colIndex]) || 0;
        // If value > 1, assume it's a percentage (e.g., 28 for 28%)
        // If value <= 1, assume it's already a decimal (e.g., 0.28)
        if (value > 1 && value <= 100) {
          value = value / 100;
        }
        if (value > 0 && value <= 1) {
          financialData.cogs[field] = value;
        }
      });
    }

    // Operating Expenses
    if (mapping.operatingExpenses) {
      Object.keys(mapping.operatingExpenses).forEach(colIndex => {
        const field = mapping.operatingExpenses[colIndex];
        const value = parseFloat(firstRow[colIndex]) || 0;
        if (value > 0) {
          financialData.operatingExpenses[field] = value;
        }
      });
    }

    // Startup Costs
    if (mapping.startupCosts) {
      Object.keys(mapping.startupCosts).forEach(colIndex => {
        const field = mapping.startupCosts[colIndex];
        const value = parseFloat(firstRow[colIndex]) || 0;
        if (value > 0) {
          financialData.startupCosts[field] = value;
        }
      });
    }

    // Restaurant Operations
    if (mapping.restaurantOperations) {
      Object.keys(mapping.restaurantOperations).forEach(colIndex => {
        const field = mapping.restaurantOperations[colIndex];
        const value = parseFloat(firstRow[colIndex]) || 0;
        if (value > 0) {
          financialData.restaurantOperations[field] = value;
        }
      });
    }

    return financialData;
  };

  const handleImport = () => {
    if (!parsedData) {
      setError('No data to import. Please wait for the file to be parsed.');
      return;
    }

    try {
      // Import revenue
      if (parsedData.revenue && Object.keys(parsedData.revenue).length > 0) {
        actions.updateFinancialData('revenue', {
          ...state.financialData?.revenue,
          ...parsedData.revenue
        });
      }

      // Import COGS
      if (parsedData.cogs && Object.keys(parsedData.cogs).length > 0) {
        actions.updateFinancialData('cogs', {
          ...state.financialData?.cogs,
          ...parsedData.cogs
        });
      }

      // Import Operating Expenses
      if (parsedData.operatingExpenses && Object.keys(parsedData.operatingExpenses).length > 0) {
        actions.updateFinancialData('operatingExpenses', {
          ...state.financialData?.operatingExpenses,
          ...parsedData.operatingExpenses
        });
      }

      // Import Startup Costs
      if (parsedData.startupCosts && Object.keys(parsedData.startupCosts).length > 0) {
        actions.updateFinancialData('startupCosts', {
          ...state.financialData?.startupCosts,
          ...parsedData.startupCosts
        });
      }

      // Import Restaurant Operations
      if (parsedData.restaurantOperations && Object.keys(parsedData.restaurantOperations).length > 0) {
        actions.updateFinancialData('restaurantOperations', {
          ...state.financialData?.restaurantOperations,
          ...parsedData.restaurantOperations
        });
      }

      actions.showMessage('Success', 'Financial data imported successfully!', 'success');
      setUploadedFile(null);
      setParsedData(null);
      setWorksheetData(null);
      setColumnMapping(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err) {
      setError(err.message || 'Failed to import data.');
      actions.showMessage('Error', 'Failed to import financial data.', 'error');
    }
  };

  return (
    <SectionCard 
      title="Import Financial Projections from Excel" 
      description="Upload your Excel financial projections file (.xlsx) and automatically import revenue, expenses, and startup costs."
      color="green"
    >
      <div className="space-y-6">
        {/* File Upload */}
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx,.xls"
            onChange={handleFileSelect}
            className="hidden"
            id="excel-upload"
          />
          <label
            htmlFor="excel-upload"
            className="cursor-pointer flex flex-col items-center space-y-4"
          >
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <Upload className="w-8 h-8 text-green-600" />
            </div>
            <div>
              <p className="text-lg font-semibold text-gray-900">
                {uploadedFile ? uploadedFile.name : 'Click to upload Excel file'}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Supports .xlsx and .xls files (Max 10MB)
              </p>
            </div>
          </label>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-red-800">Error</p>
              <p className="text-sm text-red-600 mt-1">{error}</p>
            </div>
          </div>
        )}

        {/* Processing Status */}
        {isProcessing && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
              <div className="flex-1">
                <p className="text-sm font-medium text-blue-800">Processing...</p>
                <p className="text-sm text-blue-600 mt-1">{importProgress}</p>
              </div>
            </div>
          </div>
        )}

        {/* Preview Button */}
        {parsedData && !isProcessing && (
          <div className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="text-sm font-medium text-green-800">File parsed successfully!</p>
                    <p className="text-xs text-green-600 mt-1">
                      Found data for {Object.keys(parsedData).filter(k => parsedData[k] && Object.keys(parsedData[k]).length > 0).length} sections
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowPreview(!showPreview)}
                  className="flex items-center space-x-2 px-3 py-2 bg-white border border-green-300 rounded-lg text-sm font-medium text-green-700 hover:bg-green-100 transition-colors"
                >
                  <Eye className="w-4 h-4" />
                  <span>{showPreview ? 'Hide' : 'Show'} Preview</span>
                </button>
              </div>
            </div>

            {/* Data Preview */}
            {showPreview && (
              <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-4 max-h-96 overflow-y-auto">
                {Object.keys(parsedData).map(section => {
                  const sectionData = parsedData[section];
                  if (!sectionData || Object.keys(sectionData).length === 0) return null;

                  return (
                    <div key={section} className="border-b border-gray-200 pb-4 last:border-b-0">
                      <h4 className="font-semibold text-gray-900 mb-2 capitalize">
                        {section.replace(/([A-Z])/g, ' $1').trim()}
                      </h4>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        {Object.keys(sectionData).map(field => (
                          <div key={field} className="flex justify-between">
                            <span className="text-gray-600">{field}:</span>
                            <span className="font-medium text-gray-900">
                              {typeof sectionData[field] === 'number' 
                                ? (field.includes('Percent') || field.includes('Rate') || field === 'payrollTaxRate'
                                    ? (sectionData[field] * 100).toFixed(1) + '%'
                                    : '$' + sectionData[field].toLocaleString('en-US', {
                                        minimumFractionDigits: 0,
                                        maximumFractionDigits: 0
                                      }))
                                : sectionData[field]}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Import Button */}
            <button
              onClick={handleImport}
              className="w-full btn-primary flex items-center justify-center space-x-2"
            >
              <ArrowRight className="w-4 h-4" />
              <span>Import Financial Data</span>
            </button>
          </div>
        )}

        {/* Instructions */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h4 className="font-semibold text-gray-900 mb-2 flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span>How it works:</span>
          </h4>
          <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
            <li>Upload your Excel financial projections file</li>
            <li>AI automatically identifies and maps columns to financial fields</li>
            <li>Review the preview to verify data extraction</li>
            <li>Click "Import Financial Data" to populate your plan</li>
          </ul>
          <div className="mt-3 pt-3 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              <strong>Tip:</strong> Use clear column headers like "Food Sales", "Rent", "Kitchen Equipment" for best results.
            </p>
          </div>
        </div>
      </div>
    </SectionCard>
  );
};

export default ExcelFinancialImporter;

