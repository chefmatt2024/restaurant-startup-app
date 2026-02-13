/**
 * Compute completion status for each plan section from draft data.
 * Used for tab indicators and overview progress.
 * @param {Object} draft - Current draft (from state.drafts)
 * @returns {{ [tabId: string]: { completed: boolean, label: string } }}
 */
export function getSectionStatus(draft) {
  if (!draft) return {};

  const hasContent = (obj) => {
    if (!obj) return false;
    if (typeof obj === 'string') return obj.trim().length > 0;
    if (Array.isArray(obj)) return obj.length > 0;
    if (typeof obj === 'object') {
      return Object.values(obj).some(val => {
        if (typeof val === 'string') return val.trim().length > 0;
        if (typeof val === 'number') return val > 0;
        if (Array.isArray(val)) return val.length > 0;
        if (typeof val === 'object') return hasContent(val);
        return false;
      });
    }
    return false;
  };

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

  return {
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
    'operations': {
      label: 'Operations Plan',
      completed: !!(draft.businessPlan?.operationsPlan?.location ||
        draft.businessPlan?.operationsPlan?.staffingPlan)
    },
    'team-cap-table': {
      label: 'Team & Cap Table',
      completed: !!(managementDone || capTableDone)
    },
    'financials': {
      label: 'Financial Projections',
      completed: !!(draft.financialData?.revenue?.foodSales > 0 ||
        draft.financialData?.revenue?.beverageSales > 0 ||
        draft.financialData?.operatingExpenses?.rent > 0 ||
        draft.financialData?.startupCosts?.totalBuildCost > 0 ||
        draft.financialData?.startupCosts?.purchasePrice > 0 ||
        draft.financialData?.restaurantOperations?.seats > 0 ||
        draft.financialData?.restaurantType?.buildCosts > 0 ||
        draft.financialData?.restaurantType?.purchasePrice > 0)
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
}
