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

  return {
    'idea-formation': {
      label: 'Idea Formation',
      completed: !!(draft.businessPlan?.ideation?.businessConcept ||
        draft.businessPlan?.ideation?.coreInspiration ||
        draft.businessPlan?.ideation?.solutionIdea)
    },
    'elevator-pitch': {
      label: 'Elevator Pitch',
      completed: !!(draft.businessPlan?.elevatorPitch?.finalPitch ||
        draft.businessPlan?.elevatorPitch?.hook)
    },
    'executive-summary': {
      label: 'Executive Summary',
      completed: !!(draft.businessPlan?.executiveSummary?.businessName ||
        draft.businessPlan?.executiveSummary?.missionStatement)
    },
    'market-analysis': {
      label: 'Market Analysis',
      completed: !!(draft.businessPlan?.marketAnalysis?.targetMarket ||
        draft.businessPlan?.marketAnalysis?.marketSize ||
        draft.businessPlan?.marketAnalysis?.competitiveAnalysis)
    },
    'competitive-analysis': {
      label: 'Competitive Analysis',
      completed: !!(draft.businessPlan?.marketAnalysis?.competitiveAnalysis)
    },
    'services': {
      label: 'Products/Services',
      completed: !!(draft.businessPlan?.serviceDescription?.productsServices)
    },
    'operations': {
      label: 'Operations Plan',
      completed: !!(draft.businessPlan?.operationsPlan?.location ||
        draft.businessPlan?.operationsPlan?.staffingPlan)
    },
    'management': {
      label: 'Management Team',
      completed: !!(draft.businessPlan?.managementTeam?.keyPersonnel)
    },
    'marketing': {
      label: 'Marketing Strategy',
      completed: !!(draft.businessPlan?.marketingStrategy?.marketingMix ||
        draft.businessPlan?.marketingStrategy?.customerAcquisition)
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
    'equipment-planning': {
      label: 'Equipment Planning',
      completed: !!(draft.equipmentData?.equipment?.length > 0)
    },
    'menu-builder': {
      label: 'Menu Builder',
      completed: !!(draft.menuData?.menuItems?.length > 0)
    },
    'branding': {
      label: 'Branding Planner',
      completed: !!(draft.brandingData?.brandName)
    },
    'documents': {
      label: 'Documents & Compliance',
      completed: !!(draft.complianceData?.documents?.length > 0)
    }
  };
}
