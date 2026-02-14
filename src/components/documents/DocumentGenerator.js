import React, { useState, useMemo } from 'react';
import { useApp } from '../../contexts/AppContext';
import jsPDF from 'jspdf';
import { FileText, Download, File, Presentation, BarChart3, Loader } from 'lucide-react';

const DocumentGenerator = ({ onDocumentGenerated }) => {
  const { state } = useApp();
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatingDoc, setGeneratingDoc] = useState(null);

  const businessPlan = state.businessPlan;
  const financialData = state.financialData;

  // Calculate financial summaries
  const financialSummary = useMemo(() => {
    const revenue = financialData.revenue || {};
    const expenses = financialData.operatingExpenses || {};
    const startup = financialData.startupCosts || {};
    const funding = financialData.fundingSources || {};

    const totalRevenue = (revenue.foodSales || 0) + (revenue.beverageSales || 0) + 
                        (revenue.merchandiseSales || 0) + (revenue.cateringSales || 0) + 
                        (revenue.otherRevenue || 0);

    const totalOpEx = (expenses.rent || 0) + (expenses.utilities || 0) + 
                      (expenses.insurance || 0) + (expenses.marketing || 0) + 
                      (expenses.labor?.totals?.totalCost || 0) || 0;

    const totalStartup = (startup.leaseholdImprovements || 0) + 
                        (startup.kitchenEquipment || 0) + 
                        (startup.furnitureFixtures || 0) + 
                        (startup.initialInventory || 0) + 
                        (startup.preOpeningSalaries || 0) + 
                        (startup.depositsLicenses || 0) + 
                        (startup.initialMarketing || 0) + 
                        (startup.contingency || 0);

    const totalFunding = Object.values(funding).reduce((sum, val) => {
      return sum + (typeof val === 'number' ? val : 0);
    }, 0);

    return {
      totalRevenue,
      totalOpEx,
      totalStartup,
      totalFunding,
      fundingGap: totalStartup - totalFunding,
      netIncome: totalRevenue - totalOpEx
    };
  }, [financialData]);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value || 0);
  };

  // Hours of operation: use financials (single source of truth) or fall back to business plan text
  const getHoursOfOperationText = () => {
    const hours = financialData?.restaurantOperations?.hoursOfOperation;
    if (hours && typeof hours === 'object') {
      const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
      const fmt = (t) => {
        if (!t) return '11:00';
        const [h, m] = String(t).split(':');
        const hr = parseInt(h, 10);
        if (hr === 0) return `12:${m || '00'} AM`;
        if (hr < 12) return `${h}:${m || '00'} AM`;
        if (hr === 12) return `12:${m || '00'} PM`;
        return `${hr - 12}:${m || '00'} PM`;
      };
      return days.map((day) => {
        const h = hours[day];
        const label = day.charAt(0).toUpperCase() + day.slice(1);
        if (!h || h.closed) return `${label}: Closed`;
        return `${label}: ${fmt(h.open)}-${fmt(h.close)}`;
      }).join(', ');
    }
    return businessPlan?.operationsPlan?.hoursOfOperation || '';
  };

  // Generate Pitch Deck PDF
  const generatePitchDeck = async () => {
    setIsGenerating(true);
    setGeneratingDoc('Pitch Deck');
    
    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 20;
      let yPos = margin;

      // Helper function to add a new page
      const addNewPage = () => {
        doc.addPage();
        yPos = margin;
      };

      // Helper function to add text with wrapping
      const addText = (text, fontSize = 12, isBold = false, color = [0, 0, 0]) => {
        doc.setFontSize(fontSize);
        doc.setFont('helvetica', isBold ? 'bold' : 'normal');
        doc.setTextColor(color[0], color[1], color[2]);
        
        const lines = doc.splitTextToSize(text, pageWidth - 2 * margin);
        if (yPos + (lines.length * fontSize * 0.4) > pageHeight - margin) {
          addNewPage();
        }
        
        lines.forEach(line => {
          doc.text(line, margin, yPos);
          yPos += fontSize * 0.4;
        });
        yPos += 5;
      };

      // Slide 1: Title Slide
      doc.setFillColor(41, 128, 185);
      doc.rect(0, 0, pageWidth, pageHeight, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(32);
      doc.setFont('helvetica', 'bold');
      doc.text(businessPlan.executiveSummary.businessName || 'Restaurant Business', pageWidth / 2, pageHeight / 2 - 20, { align: 'center' });
      doc.setFontSize(18);
      doc.setFont('helvetica', 'normal');
      doc.text('Investor Pitch Deck', pageWidth / 2, pageHeight / 2 + 10, { align: 'center' });
      doc.text(new Date().toLocaleDateString(), pageWidth / 2, pageHeight / 2 + 30, { align: 'center' });

      // Slide 2: Problem
      addNewPage();
      doc.setFillColor(255, 255, 255);
      doc.rect(0, 0, pageWidth, pageHeight, 'F');
      doc.setTextColor(0, 0, 0);
      addText('THE PROBLEM', 24, true, [41, 128, 185]);
      yPos += 10;
      addText(businessPlan.ideation.initialProblem || businessPlan.elevatorPitch.problem || 'Market opportunity in restaurant industry', 14);

      // Slide 3: Solution
      addNewPage();
      addText('THE SOLUTION', 24, true, [41, 128, 185]);
      yPos += 10;
      addText(businessPlan.ideation.solutionIdea || businessPlan.elevatorPitch.solution || 'Our restaurant concept addresses this need', 14);

      // Slide 4: Market Opportunity
      addNewPage();
      addText('MARKET OPPORTUNITY', 24, true, [41, 128, 185]);
      yPos += 10;
      addText(`Market Size: ${businessPlan.marketAnalysis.marketSize || 'TBD'}`, 14);
      yPos += 5;
      addText(`Target Market: ${businessPlan.marketAnalysis.targetMarket || businessPlan.ideation.targetAudience || 'TBD'}`, 14);
      yPos += 5;
      addText(businessPlan.marketAnalysis.industryOverview || '', 12);

      // Slide 5: Business Model
      addNewPage();
      addText('BUSINESS MODEL', 24, true, [41, 128, 185]);
      yPos += 10;
      addText(`Business Type: ${businessPlan.executiveSummary.businessType || businessPlan.ideation.businessType || 'Restaurant'}`, 14);
      yPos += 5;
      addText(`Location: ${businessPlan.executiveSummary.location || businessPlan.ideation.location || 'TBD'}`, 14);
      yPos += 5;
      addText(`Seats: ${financialData.restaurantOperations?.seats || 50}`, 14);
      yPos += 5;
      addText(`Square Footage: ${financialData.restaurantDetails?.squareFootage || 2000} sq ft`, 14);

      // Slide 6: Products & Services
      addNewPage();
      addText('PRODUCTS & SERVICES', 24, true, [41, 128, 185]);
      yPos += 10;
      addText(businessPlan.serviceDescription.productsServices || businessPlan.serviceDescription.uniqueSellingProposition || 'Restaurant services', 14);

      // Slide 7: Competitive Advantage
      addNewPage();
      addText('COMPETITIVE ADVANTAGE', 24, true, [41, 128, 185]);
      yPos += 10;
      addText(businessPlan.ideation.differentiator || businessPlan.elevatorPitch.uniqueValue || 'Unique value proposition', 14);
      yPos += 5;
      addText(businessPlan.serviceDescription.uniqueSellingProposition || '', 12);

      // Slide 8: Marketing Strategy
      addNewPage();
      addText('MARKETING STRATEGY', 24, true, [41, 128, 185]);
      yPos += 10;
      addText(businessPlan.marketingStrategy.marketingMix || businessPlan.marketingStrategy.customerAcquisition || 'Marketing approach', 14);
      yPos += 5;
      addText(businessPlan.marketingStrategy.digitalMarketing || '', 12);

      // Slide 9: Management Team
      addNewPage();
      addText('MANAGEMENT TEAM', 24, true, [41, 128, 185]);
      yPos += 10;
      addText(businessPlan.managementTeam.keyPersonnel || 'Experienced restaurant management team', 14);
      yPos += 5;
      addText(businessPlan.managementTeam.organizationalStructure || '', 12);

      // Slide 10: Financial Highlights
      addNewPage();
      addText('FINANCIAL HIGHLIGHTS', 24, true, [41, 128, 185]);
      yPos += 10;
      addText(`Projected Annual Revenue: ${formatCurrency(financialSummary.totalRevenue)}`, 14, true);
      yPos += 8;
      addText(`Startup Costs: ${formatCurrency(financialSummary.totalStartup)}`, 14);
      yPos += 5;
      addText(`Funding Secured: ${formatCurrency(financialSummary.totalFunding)}`, 14);
      yPos += 5;
      addText(`Funding Gap: ${formatCurrency(financialSummary.fundingGap)}`, 14, false, financialSummary.fundingGap > 0 ? [231, 76, 60] : [46, 204, 113]);
      yPos += 8;
      addText(`Projected Net Income: ${formatCurrency(financialSummary.netIncome)}`, 14);

      // Slide 11: Use of Funds
      addNewPage();
      addText('USE OF FUNDS', 24, true, [41, 128, 185]);
      yPos += 10;
      const startupItems = [
        { label: 'Leasehold Improvements', value: financialData.startupCosts?.leaseholdImprovements || 0 },
        { label: 'Kitchen Equipment', value: financialData.startupCosts?.kitchenEquipment || 0 },
        { label: 'Furniture & Fixtures', value: financialData.startupCosts?.furnitureFixtures || 0 },
        { label: 'Initial Inventory', value: financialData.startupCosts?.initialInventory || 0 },
        { label: 'Pre-Opening Salaries', value: financialData.startupCosts?.preOpeningSalaries || 0 },
        { label: 'Deposits & Licenses', value: financialData.startupCosts?.depositsLicenses || 0 },
        { label: 'Initial Marketing', value: financialData.startupCosts?.initialMarketing || 0 },
        { label: 'Contingency', value: financialData.startupCosts?.contingency || 0 }
      ];
      startupItems.forEach(item => {
        if (item.value > 0) {
          addText(`${item.label}: ${formatCurrency(item.value)}`, 12);
        }
      });

      // Slide 12: The Ask
      addNewPage();
      addText('THE ASK', 24, true, [41, 128, 185]);
      yPos += 10;
      addText(`Funding Request: ${formatCurrency(parseFloat(businessPlan.executiveSummary.fundingRequest) || financialSummary.fundingGap)}`, 18, true);
      yPos += 10;
      addText(businessPlan.elevatorPitch.ask || 'Investment opportunity in growing restaurant market', 14);
      yPos += 10;
      addText('Contact Information:', 12, true);
      addText(businessPlan.managementTeam.keyPersonnel || 'Management Team', 12);

      // Slide 13: Next Steps
      addNewPage();
      addText('NEXT STEPS', 24, true, [41, 128, 185]);
      yPos += 10;
      addText('1. Secure funding', 14);
      yPos += 5;
      addText('2. Finalize location and lease', 14);
      yPos += 5;
      addText('3. Complete build-out and equipment installation', 14);
      yPos += 5;
      addText('4. Hire and train staff', 14);
      yPos += 5;
      addText('5. Launch and marketing campaign', 14);

      // Save PDF
      const fileName = `${(businessPlan.executiveSummary.businessName || 'Restaurant').replace(/[^a-zA-Z0-9]/g, '_')}_Pitch_Deck.pdf`;
      doc.save(fileName);
      
      setIsGenerating(false);
      setGeneratingDoc(null);
    } catch (error) {
      console.error('Error generating pitch deck:', error);
      setIsGenerating(false);
      setGeneratingDoc(null);
      alert('Error generating pitch deck. Please try again.');
    }
  };

  // Generate Business Plan PDF
  const generateBusinessPlan = async () => {
    setIsGenerating(true);
    setGeneratingDoc('Business Plan');
    
    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 20;
      let yPos = margin;

      const addNewPage = () => {
        doc.addPage();
        yPos = margin;
      };

      const addText = (text, fontSize = 12, isBold = false, color = [0, 0, 0]) => {
        if (!text) return;
        doc.setFontSize(fontSize);
        doc.setFont('helvetica', isBold ? 'bold' : 'normal');
        doc.setTextColor(color[0], color[1], color[2]);
        
        const lines = doc.splitTextToSize(text, pageWidth - 2 * margin);
        if (yPos + (lines.length * fontSize * 0.4) > pageHeight - margin) {
          addNewPage();
        }
        
        lines.forEach(line => {
          doc.text(line, margin, yPos);
          yPos += fontSize * 0.4;
        });
        yPos += 5;
      };

      const addSection = (title) => {
        if (yPos > pageHeight - 40) addNewPage();
        yPos += 10;
        addText(title, 18, true, [41, 128, 185]);
        yPos += 5;
      };

      // Cover Page
      doc.setFillColor(41, 128, 185);
      doc.rect(0, 0, pageWidth, pageHeight, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(28);
      doc.setFont('helvetica', 'bold');
      doc.text('BUSINESS PLAN', pageWidth / 2, pageHeight / 2 - 30, { align: 'center' });
      doc.setFontSize(20);
      doc.text(businessPlan.executiveSummary.businessName || 'Restaurant Business', pageWidth / 2, pageHeight / 2, { align: 'center' });
      doc.setFontSize(14);
      doc.setFont('helvetica', 'normal');
      doc.text(businessPlan.executiveSummary.location || '', pageWidth / 2, pageHeight / 2 + 20, { align: 'center' });
      doc.text(new Date().toLocaleDateString(), pageWidth / 2, pageHeight / 2 + 40, { align: 'center' });

      // Table of Contents
      addNewPage();
      addSection('TABLE OF CONTENTS');
      const toc = [
        '1. Executive Summary',
        '2. Company Description',
        '3. Market Analysis',
        '4. Organization & Management',
        '5. Service/Product Line',
        '6. Marketing & Sales Strategy',
        '7. Operations Plan',
        '8. Financial Projections',
        '9. Funding Request',
        '10. Appendices'
      ];
      toc.forEach(item => addText(item, 12));

      // Executive Summary
      addNewPage();
      addSection('1. EXECUTIVE SUMMARY');
      addText(businessPlan.executiveSummary.missionStatement || '', 12);
      yPos += 5;
      addText(`Business Name: ${businessPlan.executiveSummary.businessName || 'TBD'}`, 12, true);
      addText(`Business Type: ${businessPlan.executiveSummary.businessType || 'TBD'}`, 12);
      addText(`Location: ${businessPlan.executiveSummary.location || 'TBD'}`, 12);
      addText(`Funding Request: ${formatCurrency(parseFloat(businessPlan.executiveSummary.fundingRequest) || 0)}`, 12);
      yPos += 5;
      addText(businessPlan.executiveSummary.financialSummary || '', 12);
      addText(businessPlan.executiveSummary.keySuccessFactors || '', 12);

      // Company Description
      addNewPage();
      addSection('2. COMPANY DESCRIPTION');
      addText(businessPlan.ideation.businessConcept || '', 12);
      yPos += 5;
      addText('Core Inspiration:', 12, true);
      addText(businessPlan.ideation.coreInspiration || '', 12);
      yPos += 5;
      addText('Personal Motivation:', 12, true);
      addText(businessPlan.ideation.personalMotivation || '', 12);

      // Market Analysis
      addNewPage();
      addSection('3. MARKET ANALYSIS');
      addText('Industry Overview:', 12, true);
      addText(businessPlan.marketAnalysis.industryOverview || '', 12);
      yPos += 5;
      addText('Target Market:', 12, true);
      addText(businessPlan.marketAnalysis.targetMarket || businessPlan.ideation.targetAudience || '', 12);
      yPos += 5;
      addText('Market Size:', 12, true);
      addText(businessPlan.marketAnalysis.marketSize || '', 12);
      yPos += 5;
      addText('Customer Demographics:', 12, true);
      addText(businessPlan.marketAnalysis.customerDemographics || '', 12);
      yPos += 5;
      addText('Competitive Analysis:', 12, true);
      addText(businessPlan.marketAnalysis.competitiveAnalysis || '', 12);
      yPos += 5;
      addText('Market Trends:', 12, true);
      addText(businessPlan.marketAnalysis.marketTrends || '', 12);

      // Organization & Management
      addNewPage();
      addSection('4. ORGANIZATION & MANAGEMENT');
      addText('Key Personnel:', 12, true);
      addText(businessPlan.managementTeam.keyPersonnel || '', 12);
      yPos += 5;
      addText('Organizational Structure:', 12, true);
      addText(businessPlan.managementTeam.organizationalStructure || '', 12);
      yPos += 5;
      addText('Advisors:', 12, true);
      addText(businessPlan.managementTeam.advisors || '', 12);
      yPos += 5;
      addText('Compensation Plan:', 12, true);
      addText(businessPlan.managementTeam.compensationPlan || '', 12);

      // Service/Product Line
      addNewPage();
      addSection('5. SERVICE/PRODUCT LINE');
      addText('Products & Services:', 12, true);
      addText(businessPlan.serviceDescription.productsServices || '', 12);
      yPos += 5;
      addText('Unique Selling Proposition:', 12, true);
      addText(businessPlan.serviceDescription.uniqueSellingProposition || '', 12);
      yPos += 5;
      addText('Pricing Strategy:', 12, true);
      addText(businessPlan.serviceDescription.pricingStrategy || '', 12);
      yPos += 5;
      addText('Product Lifecycle:', 12, true);
      addText(businessPlan.serviceDescription.lifecycle || '', 12);

      // Marketing & Sales Strategy
      addNewPage();
      addSection('6. MARKETING & SALES STRATEGY');
      addText('Marketing Mix:', 12, true);
      addText(businessPlan.marketingStrategy.marketingMix || '', 12);
      yPos += 5;
      addText('Sales Strategy:', 12, true);
      addText(businessPlan.marketingStrategy.salesStrategy || '', 12);
      yPos += 5;
      addText('Customer Acquisition:', 12, true);
      addText(businessPlan.marketingStrategy.customerAcquisition || '', 12);
      yPos += 5;
      addText('Branding Strategy:', 12, true);
      addText(businessPlan.marketingStrategy.brandingStrategy || '', 12);
      yPos += 5;
      addText('Digital Marketing:', 12, true);
      addText(businessPlan.marketingStrategy.digitalMarketing || '', 12);

      // Operations Plan
      addNewPage();
      addSection('7. OPERATIONS PLAN');
      addText('Location:', 12, true);
      addText(businessPlan.operationsPlan.location || businessPlan.executiveSummary.location || '', 12);
      yPos += 5;
      addText('Facility Requirements:', 12, true);
      addText(businessPlan.operationsPlan.facilityRequirements || '', 12);
      yPos += 5;
      addText('Hours of Operation:', 12, true);
      addText(getHoursOfOperationText(), 12);
      yPos += 5;
      addText('Staffing Plan:', 12, true);
      addText(businessPlan.operationsPlan.staffingPlan || '', 12);
      yPos += 5;
      addText('Supplier Relationships:', 12, true);
      addText(businessPlan.operationsPlan.supplierRelationships || '', 12);
      yPos += 5;
      addText('Quality Control:', 12, true);
      addText(businessPlan.operationsPlan.qualityControl || '', 12);

      // Financial Projections
      addNewPage();
      addSection('8. FINANCIAL PROJECTIONS');
      addText('Revenue Projections:', 12, true);
      addText(`Annual Revenue: ${formatCurrency(financialSummary.totalRevenue)}`, 12);
      yPos += 5;
      addText('Startup Costs:', 12, true);
      addText(`Total Startup Investment: ${formatCurrency(financialSummary.totalStartup)}`, 12);
      yPos += 5;
      addText('Operating Expenses:', 12, true);
      addText(`Annual Operating Expenses: ${formatCurrency(financialSummary.totalOpEx)}`, 12);
      yPos += 5;
      addText('Projected Net Income:', 12, true);
      addText(`${formatCurrency(financialSummary.netIncome)}`, 14, true);

      // Funding Request
      addNewPage();
      addSection('9. FUNDING REQUEST');
      addText(`Funding Request: ${formatCurrency(parseFloat(businessPlan.executiveSummary.fundingRequest) || financialSummary.fundingGap)}`, 16, true);
      yPos += 10;
      addText('Use of Funds:', 12, true);
      const startupBreakdown = [
        `Leasehold Improvements: ${formatCurrency(financialData.startupCosts?.leaseholdImprovements || 0)}`,
        `Kitchen Equipment: ${formatCurrency(financialData.startupCosts?.kitchenEquipment || 0)}`,
        `Furniture & Fixtures: ${formatCurrency(financialData.startupCosts?.furnitureFixtures || 0)}`,
        `Initial Inventory: ${formatCurrency(financialData.startupCosts?.initialInventory || 0)}`,
        `Pre-Opening Salaries: ${formatCurrency(financialData.startupCosts?.preOpeningSalaries || 0)}`,
        `Deposits & Licenses: ${formatCurrency(financialData.startupCosts?.depositsLicenses || 0)}`,
        `Initial Marketing: ${formatCurrency(financialData.startupCosts?.initialMarketing || 0)}`,
        `Contingency: ${formatCurrency(financialData.startupCosts?.contingency || 0)}`
      ];
      startupBreakdown.forEach(item => addText(item, 11));

      // Appendices
      addNewPage();
      addSection('10. APPENDICES');
      addText('Elevator Pitch:', 12, true);
      addText(businessPlan.elevatorPitch.finalPitch || '', 12);
      yPos += 5;
      addText('Market Opportunity:', 12, true);
      addText(businessPlan.ideation.marketOpportunity || '', 12);
      yPos += 5;
      addText('Resources Needed:', 12, true);
      addText(businessPlan.ideation.resourcesNeeded || '', 12);
      yPos += 5;
      addText('Risk Assessment:', 12, true);
      addText(businessPlan.ideation.riskAssessment || '', 12);

      const fileName = `${(businessPlan.executiveSummary.businessName || 'Restaurant').replace(/[^a-zA-Z0-9]/g, '_')}_Business_Plan.pdf`;
      doc.save(fileName);
      if (typeof onDocumentGenerated === 'function') onDocumentGenerated('business-plan');
      setIsGenerating(false);
      setGeneratingDoc(null);
    } catch (error) {
      console.error('Error generating business plan:', error);
      setIsGenerating(false);
      setGeneratingDoc(null);
      alert('Error generating business plan. Please try again.');
    }
  };

  // Generate Financial Projections Report
  const generateFinancialProjections = async () => {
    setIsGenerating(true);
    setGeneratingDoc('Financial Projections');
    
    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 20;
      let yPos = margin;

      const addNewPage = () => {
        doc.addPage();
        yPos = margin;
      };

      const addText = (text, fontSize = 12, isBold = false, color = [0, 0, 0], align = 'left') => {
        if (!text && text !== 0) return;
        doc.setFontSize(fontSize);
        doc.setFont('helvetica', isBold ? 'bold' : 'normal');
        doc.setTextColor(color[0], color[1], color[2]);
        
        const xPos = align === 'right' ? pageWidth - margin : align === 'center' ? pageWidth / 2 : margin;
        const maxWidth = align === 'center' ? pageWidth - 2 * margin : pageWidth - margin - (align === 'right' ? 0 : margin);
        
        const lines = doc.splitTextToSize(String(text), maxWidth);
        if (yPos + (lines.length * fontSize * 0.4) > pageHeight - margin) {
          addNewPage();
        }
        
        lines.forEach(line => {
          doc.text(line, xPos, yPos, { align });
          yPos += fontSize * 0.4;
        });
        yPos += 5;
      };

      const addTableRow = (label, value, isHeader = false, color = [0, 0, 0]) => {
        if (yPos > pageHeight - 30) addNewPage();
        addText(label, isHeader ? 12 : 11, isHeader, [0, 0, 0], 'left');
        const currentY = yPos - 5;
        addText(value, isHeader ? 12 : 11, isHeader, color, 'right');
        yPos = currentY + 8;
      };

      // Cover
      doc.setFillColor(46, 204, 113);
      doc.rect(0, 0, pageWidth, pageHeight, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(28);
      doc.setFont('helvetica', 'bold');
      doc.text('FINANCIAL PROJECTIONS', pageWidth / 2, pageHeight / 2 - 20, { align: 'center' });
      doc.setFontSize(18);
      doc.text(businessPlan.executiveSummary.businessName || 'Restaurant Business', pageWidth / 2, pageHeight / 2 + 10, { align: 'center' });
      doc.setFontSize(14);
      doc.setFont('helvetica', 'normal');
      doc.text(new Date().toLocaleDateString(), pageWidth / 2, pageHeight / 2 + 30, { align: 'center' });

      // Executive Summary
      addNewPage();
      doc.setFillColor(255, 255, 255);
      doc.rect(0, 0, pageWidth, pageHeight, 'F');
      doc.setTextColor(0, 0, 0);
      addText('EXECUTIVE FINANCIAL SUMMARY', 18, true, [46, 204, 113]);
      yPos += 10;
      addTableRow('Projected Annual Revenue', formatCurrency(financialSummary.totalRevenue), true);
      addTableRow('Annual Operating Expenses', formatCurrency(financialSummary.totalOpEx));
      addTableRow('Projected Net Income', formatCurrency(financialSummary.netIncome), true);
      yPos += 10;
      addTableRow('Total Startup Costs', formatCurrency(financialSummary.totalStartup), true);
      addTableRow('Funding Secured', formatCurrency(financialSummary.totalFunding));
      addTableRow('Funding Gap', formatCurrency(financialSummary.fundingGap), false, financialSummary.fundingGap > 0 ? [231, 76, 60] : [46, 204, 113]);

      // Revenue Breakdown
      addNewPage();
      addText('REVENUE BREAKDOWN', 18, true, [46, 204, 113]);
      yPos += 10;
      const revenue = financialData.revenue || {};
      addTableRow('Food Sales', formatCurrency(revenue.foodSales || 0));
      addTableRow('Beverage Sales', formatCurrency(revenue.beverageSales || 0));
      addTableRow('Merchandise Sales', formatCurrency(revenue.merchandiseSales || 0));
      addTableRow('Catering Sales', formatCurrency(revenue.cateringSales || 0));
      addTableRow('Other Revenue', formatCurrency(revenue.otherRevenue || 0));
      addTableRow('TOTAL REVENUE', formatCurrency(financialSummary.totalRevenue), true);

      // Operating Expenses
      addNewPage();
      addText('OPERATING EXPENSES', 18, true, [46, 204, 113]);
      yPos += 10;
      const expenses = financialData.operatingExpenses || {};
      addTableRow('Rent', formatCurrency(expenses.rent || 0));
      addTableRow('Utilities', formatCurrency(expenses.utilities || 0));
      addTableRow('Insurance', formatCurrency(expenses.insurance || 0));
      addTableRow('Marketing', formatCurrency(expenses.marketing || 0));
      addTableRow('Legal & Accounting', formatCurrency(expenses.legalAccounting || 0));
      addTableRow('Repairs & Maintenance', formatCurrency(expenses.repairsMaintenance || 0));
      addTableRow('Supplies', formatCurrency(expenses.supplies || 0));
      addTableRow('Labor Costs', formatCurrency(expenses.labor?.totals?.totalCost || 0));
      addTableRow('Other Operating Expenses', formatCurrency(expenses.otherOperatingExpenses || 0));
      addTableRow('TOTAL OPERATING EXPENSES', formatCurrency(financialSummary.totalOpEx), true);

      // Startup Costs
      addNewPage();
      addText('STARTUP COSTS BREAKDOWN', 18, true, [46, 204, 113]);
      yPos += 10;
      const startup = financialData.startupCosts || {};
      addTableRow('Leasehold Improvements', formatCurrency(startup.leaseholdImprovements || 0));
      addTableRow('Kitchen Equipment', formatCurrency(startup.kitchenEquipment || 0));
      addTableRow('Furniture & Fixtures', formatCurrency(startup.furnitureFixtures || 0));
      addTableRow('Initial Inventory', formatCurrency(startup.initialInventory || 0));
      addTableRow('Pre-Opening Salaries', formatCurrency(startup.preOpeningSalaries || 0));
      addTableRow('Deposits & Licenses', formatCurrency(startup.depositsLicenses || 0));
      addTableRow('Initial Marketing', formatCurrency(startup.initialMarketing || 0));
      addTableRow('Contingency', formatCurrency(startup.contingency || 0));
      addTableRow('TOTAL STARTUP COSTS', formatCurrency(financialSummary.totalStartup), true);

      // Funding Sources
      addNewPage();
      addText('FUNDING SOURCES', 18, true, [46, 204, 113]);
      yPos += 10;
      const funding = financialData.fundingSources || {};
      addTableRow('Personal Savings', formatCurrency(funding.personalSavings || 0));
      addTableRow('Bank Loans', formatCurrency(funding.bankLoans || 0));
      addTableRow('SBA Loans', formatCurrency(funding.sbaLoans || 0));
      addTableRow('Angel Investors', formatCurrency(funding.angelInvestors || 0));
      addTableRow('Venture Capital', formatCurrency(funding.ventureCapital || 0));
      addTableRow('Other Sources', formatCurrency(funding.otherSources || 0));
      addTableRow('TOTAL FUNDING', formatCurrency(financialSummary.totalFunding), true);

      // Key Metrics
      addNewPage();
      addText('KEY FINANCIAL METRICS', 18, true, [46, 204, 113]);
      yPos += 10;
      const seats = financialData.restaurantOperations?.seats || 50;
      const revenuePerSeat = financialSummary.totalRevenue / seats;
      const avgCheck = financialData.restaurantOperations?.averageCheck?.dinner || 32;
      addTableRow('Revenue per Seat', formatCurrency(revenuePerSeat));
      addTableRow('Average Check', formatCurrency(avgCheck));
      addTableRow('Number of Seats', seats.toString());
      addTableRow('Gross Margin', `${((financialSummary.netIncome / financialSummary.totalRevenue) * 100).toFixed(1)}%`);
      addTableRow('Break-even Revenue', formatCurrency(financialSummary.totalOpEx));

      const fileName = `${(businessPlan.executiveSummary.businessName || 'Restaurant').replace(/[^a-zA-Z0-9]/g, '_')}_Financial_Projections.pdf`;
      doc.save(fileName);
      
      setIsGenerating(false);
      setGeneratingDoc(null);
    } catch (error) {
      console.error('Error generating financial projections:', error);
      setIsGenerating(false);
      setGeneratingDoc(null);
      alert('Error generating financial projections. Please try again.');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center mb-6">
        <FileText className="w-6 h-6 text-blue-600 mr-2" />
        <h2 className="text-2xl font-bold text-gray-900">Document Generator</h2>
      </div>
      <p className="text-gray-600 mb-6">
        Generate professional documents for investors: Pitch Deck, Business Plan, and Financial Projections.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Pitch Deck */}
        <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
          <Presentation className="w-12 h-12 text-purple-600 mb-4" />
          <h3 className="text-xl font-semibold mb-2">Pitch Deck</h3>
          <p className="text-sm text-gray-600 mb-4">
            Professional investor presentation with 13 slides covering problem, solution, market, and financials.
          </p>
          <button
            onClick={generatePitchDeck}
            disabled={isGenerating}
            className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center disabled:opacity-50"
          >
            {isGenerating && generatingDoc === 'Pitch Deck' ? (
              <>
                <Loader className="w-4 h-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Download className="w-4 h-4 mr-2" />
                Generate Pitch Deck
              </>
            )}
          </button>
        </div>

        {/* Business Plan */}
        <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
          <File className="w-12 h-12 text-blue-600 mb-4" />
          <h3 className="text-xl font-semibold mb-2">Business Plan</h3>
          <p className="text-sm text-gray-600 mb-4">
            Comprehensive business plan document with all sections including executive summary, market analysis, and operations.
          </p>
          <button
            onClick={generateBusinessPlan}
            disabled={isGenerating}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center disabled:opacity-50"
          >
            {isGenerating && generatingDoc === 'Business Plan' ? (
              <>
                <Loader className="w-4 h-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Download className="w-4 h-4 mr-2" />
                Generate Business Plan
              </>
            )}
          </button>
        </div>

        {/* Financial Projections */}
        <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
          <BarChart3 className="w-12 h-12 text-green-600 mb-4" />
          <h3 className="text-xl font-semibold mb-2">Financial Projections</h3>
          <p className="text-sm text-gray-600 mb-4">
            Detailed financial report with revenue breakdown, expenses, startup costs, and funding analysis.
          </p>
          <button
            onClick={generateFinancialProjections}
            disabled={isGenerating}
            className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center disabled:opacity-50"
          >
            {isGenerating && generatingDoc === 'Financial Projections' ? (
              <>
                <Loader className="w-4 h-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Download className="w-4 h-4 mr-2" />
                Generate Financial Report
              </>
            )}
          </button>
        </div>
      </div>

      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-800">
          <strong>Note:</strong> All documents are generated from your current business plan and financial data. 
          Make sure all sections are filled out completely for the best results.
        </p>
      </div>
    </div>
  );
};

export default DocumentGenerator;

