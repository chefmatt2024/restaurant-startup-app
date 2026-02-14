/**
 * Step-specific context for the AI assistant when shown on each step of the process.
 * Used by the Dashboard to pass activeTab and placeholder to the global AI panel.
 */
import { DETAIL_VIEW_TABS } from '../components/layout/TabNavigation';

const TAB_IDS = DETAIL_VIEW_TABS.map(t => t.id);

/** Placeholder and section name for each tab so the AI can tailor help */
export const AI_STEP_PLACEHOLDERS = {
  'startup-and-opening': "Ask about your opening plan: 'What order should I do permits and buildout?', 'What are the Final 30 Days?', 'How do I track tasks?'",
  'process-map': "Ask about the journey: 'How long from idea to open?', 'What are the six phases?', 'When do I need a Certificate of Occupancy?'",
  'concept-pitch': "Ask about your concept: 'How do I write an elevator pitch?', 'What goes in an executive summary?', 'How do I define my target audience?'",
  'market-competition': "Ask about market: 'How do I research my competition?', 'What's a good market size for a restaurant?', 'How do I differentiate?'",
  'offer-marketing': "Ask about offer & marketing: 'How do I describe my menu?', 'What's a marketing mix?', 'How do I acquire customers?'",
  'financials': "Ask about financials: 'Are my startup costs realistic?', 'How do I project revenue?', 'What COGS % is typical?', 'How do I compare to benchmarks?'",
  'team-cap-table': "Ask about team: 'What roles do I need?', 'How do I structure a cap table?', 'What compensation is competitive?'",
  'operations': "Ask about operations: 'What goes in an operations plan?', 'How do I plan seating and turnover?', 'Facility requirements?'",
  'timeline': "Ask about timeline: 'How do I set opening milestones?', 'What order should milestones be in?', 'How long for permits vs buildout?'",
  'vendors': "Ask about vendors: 'What vendors do I need?', 'How do I track vendor costs?', 'Food vs beverage suppliers?'",
  'equipment-menu': "Ask about equipment & menu: 'What equipment do I need for my concept?', 'How do I build a menu?', 'How do I cost a dish?'",
  'branding': "Ask about branding: 'How do I name my restaurant?', 'What's a brand voice?', 'What materials do I need?'",
  'compliance': "Ask about compliance: 'What permits do I need?', 'How long do permits take?', 'Health inspection checklist?', 'Alcohol license process?'",
  'documents': "Ask about documents: 'What order should I generate documents?', 'What goes in a business plan PDF?', 'Investor pack vs pitch deck?'",
  'reports': "Ask about reports: 'How do I read variance?', 'What's a P&L summary?', 'How do I track opening progress?'",
  'ledger': "Ask about the ledger: 'How do I track expenses vs invoices?', 'What categories for expenses?', 'When to mark an invoice paid?'",
  'sops': "Ask about SOPs: 'What SOPs do I need for opening?', 'How do I write a closing checklist?', 'Food safety SOP examples?'",
  'import': "Ask about import: 'What documents can I import?', 'How do I extract data from a PDF?'",
  'business-analytics': "Ask about analytics: 'What metrics should I track?', 'How do I measure progress?'"
};

/**
 * Get placeholder for the current step/tab. Falls back to generic if tab not in map.
 */
export function getAIPlaceholderForStep(activeTab) {
  return AI_STEP_PLACEHOLDERS[activeTab] || "Ask me anything about this step or your restaurant business plan...";
}

/**
 * Build context object for the AI based on current tab and app state.
 * Pass businessPlan, financialData, etc. so the AI can reference the user's data.
 */
export function getAIContextForStep(activeTab, state) {
  const currentDraft = state.drafts?.find(d => d.id === state.currentDraftId) || null;
  const location = state.financialData?.restaurantDetails?.location || 'Boston';
  return {
    activeTab,
    stepLabel: DETAIL_VIEW_TABS.find(t => t.id === activeTab)?.label || activeTab,
    location,
    businessPlan: state.businessPlan,
    financialData: state.financialData,
    vendors: state.vendors,
    openingPlanProgress: state.openingPlanProgress,
    draftName: currentDraft?.name
  };
}
