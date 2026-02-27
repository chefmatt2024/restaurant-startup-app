/**
 * Feature presets for project setup. Lets users choose "just the basics" or specific areas
 * so smaller projects feel less daunting. null/empty enabledFeatures = show all features.
 */

// All planning tab IDs (from TabNavigation DETAIL_VIEW_TABS) — used for "Full" and filtering.
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
  'vendors',
  'equipment-menu',
  'branding',
  'compliance',
  'documents',
  'reports',
  'ledger',
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
    description: 'Everything to write and structure your plan (no reports/ledger/analytics yet).',
    featureIds: [
      'startup-and-opening',
      'process-map',
      'concept-pitch',
      'market-competition',
      'offer-marketing',
      'financials',
      'team-cap-table',
      'operations',
      'timeline',
      'vendors',
      'equipment-menu',
      'branding',
      'compliance',
      'documents',
    ],
  },
  {
    id: 'full',
    label: 'Everything',
    description: 'All features including reports, ledger, SOPs, import, and analytics.',
    featureIds: [...ALL_FEATURE_IDS],
  },
];

/**
 * Resolve enabled features for a draft. Returns null = "all features".
 * @param {string[]|null|undefined} enabledFeatures
 * @returns {string[]|null} List of tab ids to show, or null for all
 */
export function getEnabledFeatureIds(enabledFeatures) {
  if (!enabledFeatures || !Array.isArray(enabledFeatures) || enabledFeatures.length === 0) {
    return null;
  }
  return enabledFeatures;
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
  return ids.includes(tabId);
}
