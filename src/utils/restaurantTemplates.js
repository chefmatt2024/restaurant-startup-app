// Restaurant Type Templates
// Pre-filled templates for different restaurant concepts

export const RESTAURANT_TEMPLATES = {
  'italian': {
    name: 'Italian Restaurant',
    description: 'Traditional or modern Italian cuisine',
    financialData: {
      restaurantOperations: {
        seats: 60,
        averageCheck: {
          lunch: 22,
          dinner: 45,
          brunch: 28,
          beverages: 12
        },
        tableTurnover: {
          lunch: 1.5,
          dinner: 2.0,
          brunch: 2.5,
          average: 2.0
        },
        occupancyRate: {
          lunch: 0.65,
          dinner: 0.85,
          brunch: 0.75,
          average: 0.75
        }
      },
      cogs: {
        foodCogsPercent: 0.30,
        beverageCogsPercent: 0.25
      },
      operatingExpenses: {
        marketing: 5000,
        initialMarketing: 15000
      }
    },
    businessPlan: {
      executiveSummary: {
        businessType: 'fine-dining',
        location: 'north-end'
      },
      ideation: {
        businessConcept: 'Authentic Italian restaurant serving traditional Northern Italian cuisine with an extensive wine program',
        businessType: 'italian-restaurant'
      }
    }
  },
  
  'bbq': {
    name: 'BBQ Restaurant',
    description: 'American BBQ with smoked meats and sides',
    financialData: {
      restaurantOperations: {
        seats: 80,
        averageCheck: {
          lunch: 18,
          dinner: 32,
          brunch: 0,
          beverages: 8
        },
        tableTurnover: {
          lunch: 2.0,
          dinner: 2.5,
          brunch: 0,
          average: 2.25
        },
        occupancyRate: {
          lunch: 0.70,
          dinner: 0.90,
          brunch: 0,
          average: 0.80
        }
      },
      cogs: {
        foodCogsPercent: 0.32,
        beverageCogsPercent: 0.22
      },
      operatingExpenses: {
        marketing: 4000,
        initialMarketing: 12000
      }
    },
    businessPlan: {
      executiveSummary: {
        businessType: 'casual-dining',
        location: 'south-end'
      },
      ideation: {
        businessConcept: 'Authentic American BBQ restaurant featuring slow-smoked meats, house-made sauces, and traditional sides',
        businessType: 'bbq-restaurant'
      }
    }
  },
  
  'fast-casual': {
    name: 'Fast Casual',
    description: 'Quick service with higher quality ingredients',
    financialData: {
      restaurantOperations: {
        seats: 40,
        averageCheck: {
          lunch: 14,
          dinner: 18,
          brunch: 0,
          beverages: 5
        },
        tableTurnover: {
          lunch: 3.0,
          dinner: 2.5,
          brunch: 0,
          average: 2.75
        },
        occupancyRate: {
          lunch: 0.80,
          dinner: 0.70,
          brunch: 0,
          average: 0.75
        }
      },
      cogs: {
        foodCogsPercent: 0.28,
        beverageCogsPercent: 0.20
      },
      operatingExpenses: {
        marketing: 3000,
        initialMarketing: 10000
      }
    },
    businessPlan: {
      executiveSummary: {
        businessType: 'fast-casual',
        location: 'downtown'
      },
      ideation: {
        businessConcept: 'Fast casual restaurant offering fresh, healthy, and customizable meals with quick service',
        businessType: 'fast-casual'
      }
    }
  },
  
  'cafe': {
    name: 'Cafe/Coffee Shop',
    description: 'Coffee shop with light food offerings',
    financialData: {
      restaurantOperations: {
        seats: 30,
        averageCheck: {
          lunch: 12,
          dinner: 0,
          brunch: 15,
          beverages: 6
        },
        tableTurnover: {
          lunch: 2.5,
          dinner: 0,
          brunch: 2.0,
          average: 2.25
        },
        occupancyRate: {
          lunch: 0.75,
          dinner: 0,
          brunch: 0.80,
          average: 0.78
        }
      },
      cogs: {
        foodCogsPercent: 0.25,
        beverageCogsPercent: 0.18
      },
      operatingExpenses: {
        marketing: 2000,
        initialMarketing: 8000
      }
    },
    businessPlan: {
      executiveSummary: {
        businessType: 'cafe',
        location: 'back-bay'
      },
      ideation: {
        businessConcept: 'Neighborhood cafe serving specialty coffee, fresh pastries, and light lunch options',
        businessType: 'cafe'
      }
    }
  },
  
  'bar-grill': {
    name: 'Bar & Grill',
    description: 'Full-service restaurant with bar focus',
    financialData: {
      restaurantOperations: {
        seats: 100,
        averageCheck: {
          lunch: 16,
          dinner: 35,
          brunch: 20,
          beverages: 15
        },
        tableTurnover: {
          lunch: 1.8,
          dinner: 2.2,
          brunch: 2.0,
          average: 2.0
        },
        occupancyRate: {
          lunch: 0.60,
          dinner: 0.85,
          brunch: 0.70,
          average: 0.72
        }
      },
      cogs: {
        foodCogsPercent: 0.30,
        beverageCogsPercent: 0.28
      },
      operatingExpenses: {
        marketing: 6000,
        initialMarketing: 18000
      }
    },
    businessPlan: {
      executiveSummary: {
        businessType: 'bar-grill',
        location: 'fenway'
      },
      ideation: {
        businessConcept: 'Sports bar and grill featuring American comfort food, craft beers, and multiple TVs for game viewing',
        businessType: 'bar-grill'
      }
    }
  },
  
  'fine-dining': {
    name: 'Fine Dining',
    description: 'Upscale restaurant with premium service',
    financialData: {
      restaurantOperations: {
        seats: 50,
        averageCheck: {
          lunch: 35,
          dinner: 85,
          brunch: 45,
          beverages: 25
        },
        tableTurnover: {
          lunch: 1.2,
          dinner: 1.5,
          brunch: 1.3,
          average: 1.33
        },
        occupancyRate: {
          lunch: 0.50,
          dinner: 0.75,
          brunch: 0.60,
          average: 0.62
        }
      },
      cogs: {
        foodCogsPercent: 0.35,
        beverageCogsPercent: 0.30
      },
      operatingExpenses: {
        marketing: 8000,
        initialMarketing: 25000
      }
    },
    businessPlan: {
      executiveSummary: {
        businessType: 'fine-dining',
        location: 'back-bay'
      },
      ideation: {
        businessConcept: 'Fine dining restaurant offering contemporary cuisine with seasonal menus, wine pairings, and exceptional service',
        businessType: 'fine-dining'
      }
    }
  },
  
  'ethnic': {
    name: 'Ethnic Cuisine',
    description: 'Specialized ethnic cuisine restaurant',
    financialData: {
      restaurantOperations: {
        seats: 55,
        averageCheck: {
          lunch: 16,
          dinner: 38,
          brunch: 0,
          beverages: 10
        },
        tableTurnover: {
          lunch: 1.8,
          dinner: 2.0,
          brunch: 0,
          average: 1.9
        },
        occupancyRate: {
          lunch: 0.70,
          dinner: 0.80,
          brunch: 0,
          average: 0.75
        }
      },
      cogs: {
        foodCogsPercent: 0.28,
        beverageCogsPercent: 0.22
      },
      operatingExpenses: {
        marketing: 4500,
        initialMarketing: 14000
      }
    },
    businessPlan: {
      executiveSummary: {
        businessType: 'ethnic',
        location: 'cambridge'
      },
      ideation: {
        businessConcept: 'Authentic ethnic cuisine restaurant bringing traditional flavors and cooking techniques to Boston',
        businessType: 'ethnic'
      }
    }
  }
};

// Apply template to draft
export const applyTemplate = (templateKey, draft) => {
  const template = RESTAURANT_TEMPLATES[templateKey];
  if (!template) return draft;
  
  return {
    ...draft,
    businessPlan: {
      ...draft.businessPlan,
      ...template.businessPlan,
      executiveSummary: {
        ...draft.businessPlan?.executiveSummary,
        ...template.businessPlan.executiveSummary
      },
      ideation: {
        ...draft.businessPlan?.ideation,
        ...template.businessPlan.ideation
      }
    },
    financialData: {
      ...draft.financialData,
      ...template.financialData,
      restaurantOperations: {
        ...draft.financialData?.restaurantOperations,
        ...template.financialData.restaurantOperations
      },
      cogs: {
        ...draft.financialData?.cogs,
        ...template.financialData.cogs
      },
      operatingExpenses: {
        ...draft.financialData?.operatingExpenses,
        ...template.financialData.operatingExpenses
      }
    }
  };
};

// Get template options for dropdown
export const getTemplateOptions = () => {
  return Object.entries(RESTAURANT_TEMPLATES).map(([key, template]) => ({
    value: key,
    label: template.name,
    description: template.description
  }));
};

