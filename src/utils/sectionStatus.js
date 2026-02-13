/**
 * Canonical order for pre-opening progress (journey order).
 * Progress bar, tabs, and checklists use this order.
 */
export const PROGRESS_SECTION_ORDER = [
  'startup-and-opening',   // 1. Opening plan & task tracking
  'concept-pitch',         // 2. Concept & pitch
  'market-competition',    // 3. Market & competition
  'offer-marketing',       // 4. Offer & marketing
  'financials',            // 5. Financial projections
  'team-cap-table',        // 6. Team & cap table
  'operations',            // 7. Operations plan
  'timeline',              // 8. Project timeline
  'vendors',               // 9. Vendor management
  'equipment-menu',        // 10. Equipment & menu
  'branding',              // 11. Branding planner
  'compliance'             // 12. Permits & compliance
];

/**
 * Compute completion status for each plan section from draft data.
 * Keys are in PROGRESS_SECTION_ORDER so progress bar and lists show in journey order.
 * @param {Object} draft - Current draft (from state.drafts)
 * @param {string[]} [openingPlanCompletedIds] - Optional list of completed opening plan task IDs (from state.openingPlanProgress)
 * @returns {{ [tabId: string]: { completed: boolean, label: string } }}
 */
export function getSectionStatus(draft, openingPlanCompletedIds = []) {
  if (!draft) return {};

  const ideaDone = !!(draft.businessPlan?.ideation?.businessConcept || draft.businessPlan?.ideation?.coreInspiration || draft.businessPlan?.ideation?.solutionIdea);
  const pitchDone = !!(draft.businessPlan?.elevatorPitch?.finalPitch || draft.businessPlan?.elevatorPitch?.hook);
  const summaryDone = !!(draft.businessPlan?.executiveSummary?.businessName || draft.businessPlan?.executiveSummary?.missionStatement);
  const marketDone = !!(draft.businessPlan?.marketAnalysis?.targetMarket || draft.businessPlan?.marketAnalysis?.marketSize || draft.businessPlan?.marketAnalysis?.competitiveAnalysis);
  const competitiveDone = !!(draft.businessPlan?.marketAnalysis?.competitiveAnalysis);
  const servicesDone = !!(draft.businessPlan?.serviceDescription?.productsServices);
  const marketingDone = !!(draft.businessPlan?.marketingStrategy?.marketingMix || draft.businessPlan?.marketingStrategy?.customerAcquisition);
  const managementDone = !!(draft.businessPlan?.managementTeam?.keyPersonnel);
  const capTableDone = !!(draft.financialData?.capTable?.entries?.length > 0);
  const equipmentDone = !!(draft.equipmentData?.equipment?.length > 0);
  const menuDone = !!(draft.menuData?.menuItems?.length > 0);
  const documentsDone = !!(draft.complianceData?.documents?.length > 0);
  const openingPlanStarted = (openingPlanCompletedIds && openingPlanCompletedIds.length > 0);
  const timelineDone = !!(draft.timeline?.milestones?.length > 0);
  const financialsDone = !!(draft.financialData?.revenue?.foodSales > 0 ||
    draft.financialData?.revenue?.beverageSales > 0 ||
    draft.financialData?.operatingExpenses?.rent > 0 ||
    draft.financialData?.startupCosts?.totalBuildCost > 0 ||
    draft.financialData?.startupCosts?.purchasePrice > 0 ||
    draft.financialData?.restaurantOperations?.seats > 0 ||
    draft.financialData?.restaurantType?.buildCosts > 0 ||
    draft.financialData?.restaurantType?.purchasePrice > 0);

  const sections = {
    'startup-and-opening': {
      label: 'Startup & Opening Plan',
      completed: openingPlanStarted
    },
    'concept-pitch': {
      label: 'Concept & Pitch',
      completed: !!(ideaDone || pitchDone || summaryDone)
    },
    'market-competition': {
      label: 'Market & Competition',
      completed: !!(marketDone || competitiveDone)
    },
    'offer-marketing': {
      label: 'Offer & Marketing',
      completed: !!(servicesDone || marketingDone)
    },
    'financials': {
      label: 'Financial Projections',
      completed: financialsDone
    },
    'team-cap-table': {
      label: 'Team & Cap Table',
      completed: !!(managementDone || capTableDone)
    },
    'operations': {
      label: 'Operations Plan',
      completed: !!(draft.businessPlan?.operationsPlan?.location ||
        draft.businessPlan?.operationsPlan?.staffingPlan)
    },
    'timeline': {
      label: 'Project Timeline',
      completed: timelineDone
    },
    'vendors': {
      label: 'Vendor Management',
      completed: !!(draft.vendors && draft.vendors.length > 0)
    },
    'equipment-menu': {
      label: 'Equipment & Menu',
      completed: !!(equipmentDone || menuDone)
    },
    'branding': {
      label: 'Branding Planner',
      completed: !!(draft.brandingData?.brandName)
    },
    'compliance': {
      label: 'Compliance',
      completed: documentsDone
    }
  };

  // Return object in PROGRESS_SECTION_ORDER so progress bar and lists stay in journey order
  const ordered = {};
  PROGRESS_SECTION_ORDER.forEach(id => {
    if (sections[id]) ordered[id] = sections[id];
  });
  return ordered;
}
