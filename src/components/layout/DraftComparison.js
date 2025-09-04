import React from 'react';
import { useApp } from '../../contexts/AppContext';
import { X, ArrowRight, GitCompare, DollarSign, TrendingUp, Users } from 'lucide-react';

const DraftComparison = () => {
  const { state, actions } = useApp();
  
  if (!state.draftComparison.isVisible || state.draftComparison.draftIds.length !== 2) {
    return null;
  }

  const [leftDraftId, rightDraftId] = state.draftComparison.draftIds;
  const leftDraft = state.drafts.find(d => d.id === leftDraftId);
  const rightDraft = state.drafts.find(d => d.id === rightDraftId);

  if (!leftDraft || !rightDraft) {
    return null;
  }

  const handleClose = () => {
    actions.setDraftComparison({ isVisible: false, draftIds: [] });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount || 0);
  };

  // Calculate key metrics for comparison
  const getMetrics = (draft) => {
    const revenue = draft.financialData?.revenue || {};
    const totalRevenue = Object.values(revenue).reduce((sum, val) => sum + (val || 0), 0);
    
    const cogs = draft.financialData?.cogs || {};
    const totalCogs = (revenue.foodSales || 0) * (cogs.foodCogsPercent || 0) +
                     (revenue.beverageSales || 0) * (cogs.beverageCogsPercent || 0);
    
    const grossProfit = totalRevenue - totalCogs;
    const grossMargin = totalRevenue > 0 ? (grossProfit / totalRevenue) * 100 : 0;

    const opex = draft.financialData?.operatingExpenses || {};
    const totalOpex = Object.values(opex).reduce((sum, val) => typeof val === 'number' ? sum + val : sum, 0);
    
    const startupCosts = draft.financialData?.startupCosts || {};
    const totalStartupCosts = Object.values(startupCosts).reduce((sum, val) => sum + (val || 0), 0);

    return {
      totalRevenue,
      grossProfit,
      grossMargin,
      totalOpex,
      totalStartupCosts,
      netIncome: grossProfit - totalOpex
    };
  };

  const leftMetrics = getMetrics(leftDraft);
  const rightMetrics = getMetrics(rightDraft);

  // Comparison sections
  const ComparisonSection = ({ title, leftContent, rightContent, isDifferent = false }) => (
    <div className={`p-4 rounded-lg border ${isDifferent ? 'bg-yellow-50 border-yellow-200' : 'bg-white border-gray-200'}`}>
      <h3 className="font-semibold text-gray-900 mb-3">{title}</h3>
      <div className="grid grid-cols-2 gap-4">
        <div className="text-sm">
          <h4 className="font-medium text-blue-600 mb-2">{leftDraft.name}</h4>
          {leftContent}
        </div>
        <div className="text-sm">
          <h4 className="font-medium text-green-600 mb-2">{rightDraft.name}</h4>
          {rightContent}
        </div>
      </div>
    </div>
  );

  const FieldComparison = ({ label, leftValue, rightValue }) => {
    const isDifferent = leftValue !== rightValue;
    return (
      <div className={`p-2 rounded ${isDifferent ? 'bg-yellow-100' : 'bg-gray-50'}`}>
        <div className="font-medium text-xs text-gray-600 mb-1">{label}</div>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="text-blue-700">{leftValue || 'Not specified'}</div>
          <div className="text-green-700">{rightValue || 'Not specified'}</div>
        </div>
      </div>
    );
  };

  const MetricComparison = ({ label, leftValue, rightValue, format = 'currency', icon: Icon }) => {
    const formatValue = (value) => {
      if (format === 'currency') return formatCurrency(value);
      if (format === 'percentage') return `${value.toFixed(1)}%`;
      return value?.toString() || '0';
    };

    const leftFormatted = formatValue(leftValue);
    const rightFormatted = formatValue(rightValue);
    const difference = rightValue - leftValue;
    const percentChange = leftValue !== 0 ? ((difference / leftValue) * 100) : 0;

    return (
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <div className="flex items-center space-x-2 mb-3">
          {Icon && <Icon className="w-5 h-5 text-gray-600" />}
          <h4 className="font-semibold text-gray-900">{label}</h4>
        </div>
        <div className="grid grid-cols-3 gap-4 items-center">
          <div className="text-center">
            <div className="text-sm text-blue-600 font-medium">{leftDraft.name}</div>
            <div className="text-xl font-bold text-blue-700">{leftFormatted}</div>
          </div>
          <div className="text-center">
            <ArrowRight className="w-5 h-5 text-gray-400 mx-auto" />
            <div className={`text-sm font-medium ${difference >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {difference >= 0 ? '+' : ''}{formatValue(difference)}
              {leftValue !== 0 && (
                <div className="text-xs">
                  ({percentChange >= 0 ? '+' : ''}{percentChange.toFixed(1)}%)
                </div>
              )}
            </div>
          </div>
          <div className="text-center">
            <div className="text-sm text-green-600 font-medium">{rightDraft.name}</div>
            <div className="text-xl font-bold text-green-700">{rightFormatted}</div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-7xl w-full max-h-[95vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <GitCompare className="w-6 h-6 text-blue-600" />
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Draft Comparison</h2>
              <p className="text-gray-600">
                Comparing "{leftDraft.name}" vs "{rightDraft.name}"
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[80vh] p-6 space-y-8">
          {/* Financial Metrics Overview */}
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-6">Financial Overview</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <MetricComparison
                label="Total Revenue"
                leftValue={leftMetrics.totalRevenue}
                rightValue={rightMetrics.totalRevenue}
                format="currency"
                icon={DollarSign}
              />
              <MetricComparison
                label="Gross Profit"
                leftValue={leftMetrics.grossProfit}
                rightValue={rightMetrics.grossProfit}
                format="currency"
                icon={TrendingUp}
              />
              <MetricComparison
                label="Gross Margin"
                leftValue={leftMetrics.grossMargin}
                rightValue={rightMetrics.grossMargin}
                format="percentage"
                icon={TrendingUp}
              />
              <MetricComparison
                label="Net Income"
                leftValue={leftMetrics.netIncome}
                rightValue={rightMetrics.netIncome}
                format="currency"
                icon={DollarSign}
              />
              <MetricComparison
                label="Operating Expenses"
                leftValue={leftMetrics.totalOpex}
                rightValue={rightMetrics.totalOpex}
                format="currency"
                icon={Users}
              />
              <MetricComparison
                label="Startup Costs"
                leftValue={leftMetrics.totalStartupCosts}
                rightValue={rightMetrics.totalStartupCosts}
                format="currency"
                icon={DollarSign}
              />
            </div>
          </div>

          {/* Executive Summary Comparison */}
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-6">Executive Summary</h3>
            <div className="space-y-4">
              <FieldComparison
                label="Restaurant Name"
                leftValue={leftDraft.businessPlan?.executiveSummary?.businessName}
                rightValue={rightDraft.businessPlan?.executiveSummary?.businessName}
              />
              <FieldComparison
                label="Restaurant Type"
                leftValue={leftDraft.businessPlan?.executiveSummary?.businessType}
                rightValue={rightDraft.businessPlan?.executiveSummary?.businessType}
              />
              <FieldComparison
                label="Location"
                leftValue={leftDraft.businessPlan?.executiveSummary?.location}
                rightValue={rightDraft.businessPlan?.executiveSummary?.location}
              />
              <FieldComparison
                label="Funding Request"
                leftValue={leftDraft.businessPlan?.executiveSummary?.fundingRequest}
                rightValue={rightDraft.businessPlan?.executiveSummary?.fundingRequest}
              />
            </div>
          </div>

          {/* Detailed Revenue Breakdown */}
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-6">Revenue Breakdown</h3>
            <div className="space-y-4">
              <FieldComparison
                label="Food Sales"
                leftValue={formatCurrency(leftDraft.financialData?.revenue?.foodSales)}
                rightValue={formatCurrency(rightDraft.financialData?.revenue?.foodSales)}
              />
              <FieldComparison
                label="Beverage Sales"
                leftValue={formatCurrency(leftDraft.financialData?.revenue?.beverageSales)}
                rightValue={formatCurrency(rightDraft.financialData?.revenue?.beverageSales)}
              />
              <FieldComparison
                label="Catering Sales"
                leftValue={formatCurrency(leftDraft.financialData?.revenue?.cateringSales)}
                rightValue={formatCurrency(rightDraft.financialData?.revenue?.cateringSales)}
              />
            </div>
          </div>

          {/* Mission Statement Comparison */}
          <ComparisonSection
            title="Mission Statement"
            leftContent={
              <p className="text-gray-700 whitespace-pre-wrap">
                {leftDraft.businessPlan?.executiveSummary?.missionStatement || 'Not specified'}
              </p>
            }
            rightContent={
              <p className="text-gray-700 whitespace-pre-wrap">
                {rightDraft.businessPlan?.executiveSummary?.missionStatement || 'Not specified'}
              </p>
            }
            isDifferent={
              leftDraft.businessPlan?.executiveSummary?.missionStatement !== 
              rightDraft.businessPlan?.executiveSummary?.missionStatement
            }
          />

          {/* Key Success Factors Comparison */}
          <ComparisonSection
            title="Key Success Factors"
            leftContent={
              <p className="text-gray-700 whitespace-pre-wrap">
                {leftDraft.businessPlan?.executiveSummary?.keySuccessFactors || 'Not specified'}
              </p>
            }
            rightContent={
              <p className="text-gray-700 whitespace-pre-wrap">
                {rightDraft.businessPlan?.executiveSummary?.keySuccessFactors || 'Not specified'}
              </p>
            }
            isDifferent={
              leftDraft.businessPlan?.executiveSummary?.keySuccessFactors !== 
              rightDraft.businessPlan?.executiveSummary?.keySuccessFactors
            }
          />

          {/* Vendor Comparison */}
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-6">Vendor Relationships</h3>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-blue-600 mb-3">{leftDraft.name}</h4>
                <div className="text-sm text-gray-600">
                  {leftDraft.vendors?.length || 0} vendors configured
                </div>
                {leftDraft.vendors?.slice(0, 3).map((vendor, idx) => (
                  <div key={idx} className="text-xs text-gray-500 mt-1">
                    • {vendor.company} ({vendor.category})
                  </div>
                ))}
                {leftDraft.vendors?.length > 3 && (
                  <div className="text-xs text-gray-500">
                    ... and {leftDraft.vendors.length - 3} more
                  </div>
                )}
              </div>
              <div>
                <h4 className="font-medium text-green-600 mb-3">{rightDraft.name}</h4>
                <div className="text-sm text-gray-600">
                  {rightDraft.vendors?.length || 0} vendors configured
                </div>
                {rightDraft.vendors?.slice(0, 3).map((vendor, idx) => (
                  <div key={idx} className="text-xs text-gray-500 mt-1">
                    • {vendor.company} ({vendor.category})
                  </div>
                ))}
                {rightDraft.vendors?.length > 3 && (
                  <div className="text-xs text-gray-500">
                    ... and {rightDraft.vendors.length - 3} more
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 bg-gray-50 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              💡 Differences are highlighted in yellow. Use this comparison to evaluate different scenarios and choose the best approach.
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => actions.setCurrentDraftId(leftDraftId)}
                className="btn-secondary"
              >
                Switch to {leftDraft.name}
              </button>
              <button
                onClick={() => actions.setCurrentDraftId(rightDraftId)}
                className="btn-secondary"
              >
                Switch to {rightDraft.name}
              </button>
              <button onClick={handleClose} className="btn-primary">
                Close Comparison
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DraftComparison; 