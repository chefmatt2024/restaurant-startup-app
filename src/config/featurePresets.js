/**
 * Feature presets for project setup. Lets users choose "just the basics" or specific areas
 * so smaller projects feel less daunting. null/empty enabledFeatures = show all features.
 */

// All planning tab IDs (from TabNavigation DETAIL_VIEW_TABS) — used for "Full" and filtering.
// vendors + ledger are combined into vendors-expenses.
export const ALL_FEATURE_IDS = [
  'startup-and-opening',
  'process-map',
  'concept-pitch',
  'market-competition',
  'offer-marketing',
  'financials',
  'team-cap-table',
  'operations',
  'timeline',
  'vendors-expenses',
  'equipment-menu',
  'branding',
  'compliance',
  'documents',
  'reports',
  'sops',
  'import',
  'business-analytics',
];

/** Presets: id, label, description, featureIds */
export const FEATURE_PRESETS = [
  {
    id: 'starter',
    label: 'Just the basics',
    description: 'Opening plan, concept, financials, compliance — get started quickly.',
    featureIds: [
      'startup-and-opening',
      'concept-pitch',
      'financials',
      'compliance',
    ],
  },
  {
    id: 'planning',
    label: 'Full planning',
    description: 'Everything to write and structure your plan (no reports/analytics yet).',
    featureIds: [
      'startup-and-opening',
      'process-map',
      'concept-pitch',
      'market-competition',
      'offer-marketing',
      'timeline',
      'branding',
      'financials',
      'team-cap-table',
      'operations',
      'vendors-expenses',
      'equipment-menu',
      'compliance',
      'documents',
    ],
  },
  {
    id: 'full',
    label: 'Everything',
    description: 'All features including reports, SOPs, import, and analytics.',
    featureIds: [...ALL_FEATURE_IDS],
  },
];

/** Legacy tab ids that map to the combined vendors-expenses tab. */
const LEGACY_VENDORS_LEDGER_IDS = ['vendors', 'ledger'];

/**
 * Resolve enabled features for a draft. Returns null = "all features".
 * Normalizes legacy 'vendors'/'ledger' to 'vendors-expenses'.
 * @param {string[]|null|undefined} enabledFeatures
 * @returns {string[]|null} List of tab ids to show, or null for all
 */
export function getEnabledFeatureIds(enabledFeatures) {
  if (!enabledFeatures || !Array.isArray(enabledFeatures) || enabledFeatures.length === 0) {
    return null;
  }
  const normalized = enabledFeatures.map((id) =>
    LEGACY_VENDORS_LEDGER_IDS.includes(id) ? 'vendors-expenses' : id
  );
  return [...new Set(normalized)];
}

/**
 * Check if a tab id is enabled for this draft.
 * @param {string} tabId
 * @param {string[]|null|undefined} enabledFeatures
 * @returns {boolean}
 */
export function isFeatureEnabled(tabId, enabledFeatures) {
  const ids = getEnabledFeatureIds(enabledFeatures);
  if (ids === null) return true;
  if (tabId === 'vendors-expenses') {
    return ids.includes('vendors-expenses') || ids.includes('vendors') || ids.includes('ledger');
  }
  return ids.includes(tabId);
}
