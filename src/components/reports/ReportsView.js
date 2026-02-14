import React, { useMemo, useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import SectionCard from '../ui/SectionCard';
import { BarChart3, TrendingUp, CheckCircle, FileText, DollarSign, Calendar } from 'lucide-react';
import { MONTHLY_PL_SECTIONS } from '../../config/monthlyPLAccounts';
import { OPENING_PLAN_TOTAL_TASKS } from '../startup/OpeningPlan';

const formatCurrency = (n) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n ?? 0);

/** Sum one section from monthlyPL (plan) or from actuals pl[sectionId][code] */
function sumSection(pl, sectionId) {
  const section = MONTHLY_PL_SECTIONS.find((s) => s.id === sectionId);
  if (!section || !pl?.[sectionId]) return 0;
  return section.lines.reduce((sum, { code }) => sum + (Number(pl[sectionId][code]) || 0), 0);
}

/** Build P&L summary from a single month's plan or actuals (same structure) */
function plSummaryFromMonth(pl) {
  if (!pl) return null;
  const totalRevenue = sumSection(pl, 'revenue');
  const totalCogs = sumSection(pl, 'cogs');
  const grossProfit = totalRevenue - totalCogs;
  const labor = sumSection(pl, 'labor');
  const directOp = sumSection(pl, 'directOperating');
  const transaction = sumSection(pl, 'transaction');
  const marketing = sumSection(pl, 'marketing');
  const generalAdmin = sumSection(pl, 'generalAdmin');
  const travelMeals = sumSection(pl, 'travelMeals');
  const repairs = sumSection(pl, 'repairsMaintenance');
  const property = sumSection(pl, 'property');
  const totalExpenses =
    totalCogs + labor + directOp + transaction + marketing + generalAdmin + travelMeals + repairs + property;
  const otherIncome = sumSection(pl, 'otherIncome');
  const otherExpenses = sumSection(pl, 'otherExpenses');
  const noi = grossProfit - (labor + directOp + transaction + marketing + generalAdmin + travelMeals + repairs + property);
  const netIncome = noi + otherIncome - otherExpenses;
  return {
    totalRevenue,
    totalCogs,
    grossProfit,
    totalExpenses,
    noi,
    otherIncome,
    otherExpenses,
    netIncome
  };
}

const ReportsView = () => {
  const { state } = useApp();
  const [selectedMonthKey, setSelectedMonthKey] = useState(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
  });

  const monthlyPL = state.financialData?.monthlyPL || {};
  const monthlyActuals = state.financialData?.monthlyActuals || {};
  const completedTaskIds = state.openingPlanProgress?.completedTaskIds || [];

  // Plan summary: use first month that has data, or selected month from monthlyPL (plan is often same across months or we use one representative)
  const planSummary = useMemo(() => {
    return plSummaryFromMonth(monthlyPL) || plSummaryFromMonth(getFirstMonthPl(monthlyPL));
  }, [monthlyPL]);

  const monthKeys = useMemo(() => {
    const keys = new Set(Object.keys(monthlyActuals));
    if (Object.keys(monthlyPL).length > 0) keys.add(selectedMonthKey);
    return Array.from(keys).sort();
  }, [monthlyActuals, monthlyPL, selectedMonthKey]);

  const actualsForMonth = monthlyActuals[selectedMonthKey]?.pl;
  const actualSummary = plSummaryFromMonth(actualsForMonth);
  const planForSelected = planSummary;

  const variance = useMemo(() => {
    if (!actualSummary || !planForSelected) return null;
    return {
      revenue: (actualSummary.totalRevenue || 0) - (planForSelected.totalRevenue || 0),
      grossProfit: (actualSummary.grossProfit || 0) - (planForSelected.grossProfit || 0),
      netIncome: (actualSummary.netIncome || 0) - (planForSelected.netIncome || 0)
    };
  }, [actualSummary, planForSelected]);

  const openingProgress = useMemo(() => {
    const completed = completedTaskIds.length;
    const pct = totalTasks => (totalTasks ? Math.round((completed / totalTasks) * 100) : 0);
    return { completed, total: OPENING_PLAN_TOTAL_TASKS, pct: pct(OPENING_PLAN_TOTAL_TASKS) };
  }, [completedTaskIds.length]);

  return (
    <div className="space-y-6">
      <SectionCard title="Reports" color="blue">
        <p className="text-sm text-gray-600 mb-4">
          P&L summary, plan vs actuals variance, and opening plan progress.
        </p>
      </SectionCard>

      <SectionCard title="Opening plan progress" color="green">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-8 h-8 text-green-600" />
            <span className="text-2xl font-bold text-gray-900">{openingProgress.completed}</span>
            <span className="text-gray-600">/ {openingProgress.total} tasks</span>
          </div>
          <div className="flex-1 min-w-[120px] max-w-xs h-4 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-green-600 rounded-full transition-all"
              style={{ width: `${openingProgress.pct}%` }}
            />
          </div>
          <span className="text-sm font-medium text-gray-600">{openingProgress.pct}% complete</span>
        </div>
      </SectionCard>

      <SectionCard title="P&L summary (opening plan)" color="purple">
        {planSummary ? (
          <ul className="space-y-2 text-sm">
            <li className="flex justify-between"><span>Total Revenue</span><span>{formatCurrency(planSummary.totalRevenue)}</span></li>
            <li className="flex justify-between"><span>COGS</span><span>{formatCurrency(planSummary.totalCogs)}</span></li>
            <li className="flex justify-between font-medium"><span>Gross Profit</span><span>{formatCurrency(planSummary.grossProfit)}</span></li>
            <li className="flex justify-between"><span>Total Expenses</span><span>{formatCurrency(planSummary.totalExpenses)}</span></li>
            <li className="flex justify-between"><span>NOI</span><span>{formatCurrency(planSummary.noi)}</span></li>
            <li className="flex justify-between"><span>Other Income / (Expenses)</span><span>{formatCurrency(planSummary.otherIncome - planSummary.otherExpenses)}</span></li>
            <li className="flex justify-between font-semibold border-t pt-2"><span>Net Income</span><span>{formatCurrency(planSummary.netIncome)}</span></li>
          </ul>
        ) : (
          <p className="text-gray-500 text-sm">Complete opening P&L in Financial Projections to see plan summary here.</p>
        )}
      </SectionCard>

      <SectionCard title="Plan vs actuals (variance)" color="indigo">
        <div className="mb-3">
          <label className="block text-sm font-medium text-gray-700 mb-1">Month</label>
          <select
            value={selectedMonthKey}
            onChange={(e) => setSelectedMonthKey(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm"
          >
            {monthKeys.length ? monthKeys.map((key) => (
              <option key={key} value={key}>{key}</option>
            )) : (
              <option value={selectedMonthKey}>{selectedMonthKey}</option>
            )}
          </select>
        </div>
        {actualSummary && planForSelected ? (
          <ul className="space-y-2 text-sm">
            <li className="flex justify-between">
              <span>Revenue variance</span>
              <span className={variance.revenue >= 0 ? 'text-green-600' : 'text-red-600'}>
                {variance.revenue >= 0 ? '+' : ''}{formatCurrency(variance.revenue)}
              </span>
            </li>
            <li className="flex justify-between">
              <span>Gross profit variance</span>
              <span className={variance.grossProfit >= 0 ? 'text-green-600' : 'text-red-600'}>
                {variance.grossProfit >= 0 ? '+' : ''}{formatCurrency(variance.grossProfit)}
              </span>
            </li>
            <li className="flex justify-between font-medium">
              <span>Net income variance</span>
              <span className={variance.netIncome >= 0 ? 'text-green-600' : 'text-red-600'}>
                {variance.netIncome >= 0 ? '+' : ''}{formatCurrency(variance.netIncome)}
              </span>
            </li>
          </ul>
        ) : (
          <p className="text-gray-500 text-sm">Enter actuals in Financials (Monthly Statement) for the selected month to see variance.</p>
        )}
      </SectionCard>
    </div>
  );
};

export default ReportsView;
