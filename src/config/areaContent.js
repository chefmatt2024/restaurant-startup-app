/**
 * Location-specific content for the opening plan and process map.
 * Use getAreaConfig(area) to get copy, tips, and timeline for the selected city/town.
 */

import { LOCATION_OPTIONS, DEFAULT_LOCATION } from './locationOptions';

const AREA_CONFIG = {
  Boston: {
    label: 'Boston',
    permitAuthority: 'City of Boston (boston.gov), Boston Licensing Board, Boston Public Health Commission',
    typicalTimeline: 'Roughly 6–12 months from idea to open in Boston (idea & plan 1–2 months, funding & location 2–3 months, permits & buildout 4–8 months in parallel, launch 1–2 months).',
    leaseToOpeningNote: 'Typical: 4–8 months from lease signing to opening in Boston.',
    leaseToOpeningStepsNote: 'Permits often run in parallel with construction.',
    taskTips: {
      'business-concept': 'Boston loves authentic, chef-driven concepts. Consider seasonal menus and local sourcing.',
      'team-planning': 'Boston has a strong culinary talent pool. Plan for competitive salaries and benefits.',
      'cost-analysis': 'Boston restaurant startup costs: $175K-$400K. Include 20% contingency for unexpected expenses.',
      'funding-strategy': 'Consider SBA loans, local grants, and angel investors. Boston lenders appreciate detailed market analysis and conservative projections.',
      'boston-funding-opportunities': 'Boston offers several small business grants and programs. Check the Mayor\'s Office of Economic Development for current opportunities.',
      'neighborhood-research': 'Consider foot traffic, parking, T-accessibility, and neighborhood character. Popular areas: Back Bay, South End, Cambridge.',
      'property-search': 'Work with commercial real estate agents familiar with Boston restaurant market. Space moves quickly.',
      'lease-negotiation': 'Boston commercial leases are complex. Consider buildout allowances, rent escalations, and renewal options.',
      'boston-zoning-compliance': 'Boston has strict zoning laws. Some neighborhoods have additional restrictions on restaurant operations.',
      'business-certificate': 'The Business Certificate is mandatory for all businesses operating in Boston. Apply online through the City of Boston website.',
      'business-licenses': 'Boston requires multiple specialized licenses. Each has different requirements and timelines.',
      'alcohol-licensing': 'Alcohol licenses in Boston are highly regulated. Consider hiring a licensing attorney for complex applications.',
      'building-permits': 'Boston building permits require detailed plans. Work with experienced architects and contractors.',
      'food-establishment-permit': 'Download the official Food Establishment Permit Application (Form 4/14) from the Documents & Compliance section. Submit to Boston Public Health Commission.',
      'certificate-of-occupancy': 'Review the "When to Apply for CO" guide before starting. You cannot open without this certificate.',
      'inspections': 'Schedule inspections early. Boston inspectors are thorough and may require multiple visits.',
      'boston-specific-requirements': 'Boston has unique requirements including accessibility compliance, environmental regulations, and neighborhood-specific rules.',
      'design-planning': 'Boston diners appreciate thoughtful design. Consider seasonal outdoor dining options.',
      'equipment-selection': 'Boston has excellent restaurant equipment suppliers. Consider energy efficiency and maintenance.',
      'construction': 'Boston construction costs are high. Get multiple bids and plan for delays.',
      'staffing': 'Boston has a competitive labor market. Offer competitive wages and benefits to attract talent.',
      'menu-development': 'Boston diners appreciate seasonal menus and local ingredients. Price competitively for your neighborhood.',
      'marketing-launch': 'Boston has active food media and social media communities. Leverage local influencers and food bloggers.',
      'soft-opening': 'Use soft opening to refine operations. Boston diners are forgiving during this phase.',
      'boston-operations-compliance': 'Boston has ongoing compliance requirements including waste management, accessibility, and labor regulations.',
      'pos-payments': 'Test all payment flows (card, contactless, tips) and ensure PCI compliance.',
      'opening-inventory': 'Coordinate delivery windows with buildout completion. Order perishables for delivery just before soft open.',
      'insurance-certificates': 'Landlords and the city often require certificates of insurance (COI) before occupancy.',
      'bank-cash': 'Separate business and personal funds from day one. Plan daily cash drops and bank runs.',
      'training-schedule': 'Include ServSafe (or equivalent), POS, menu tasting, and role-playing for service.',
      'first-week-staffing': 'Overstaff slightly for the first few days; adjust after you see volume.',
      'health-inspection-prep': 'Boston Public Health Commission inspects before granting Food Establishment Permit. Use a checklist so nothing is missed.',
      'grand-opening-run-of-show': 'Assign a dedicated "runner" for problems so the GM can stay visible.'
    }
  },
  Cambridge: {
    label: 'Cambridge',
    permitAuthority: 'City of Cambridge (cambridgema.gov), Cambridge License Commission, Cambridge Public Health',
    typicalTimeline: 'Roughly 6–12 months from idea to open in Cambridge. Timelines similar to Boston; check Cambridge License Commission and Inspectional Services for current processing times.',
    leaseToOpeningNote: 'Typical: 4–8 months from lease signing to opening in Cambridge.',
    leaseToOpeningStepsNote: 'Cambridge permits often run in parallel with buildout. Check zoning and alcohol licensing early.',
    taskTips: {
      'business-concept': 'Cambridge diners value diverse, innovative concepts and strong beverage programs. Consider MIT/Harvard and Kendall Square demographics.',
      'cost-analysis': 'Cambridge startup costs can be comparable to Boston. Include contingency for high rent and buildout.',
      'boston-funding-opportunities': 'Research Cambridge and state grants. Massachusetts Growth Capital Corporation and local economic development offices may have programs.',
      'neighborhood-research': 'Consider Kendall, Harvard Square, Central, Inman, and Porter. Foot traffic and transit (Red Line, buses) matter.',
      'boston-zoning-compliance': 'Cambridge zoning is strict. Verify restaurant use and any conditional permits with Inspectional Services.',
      'business-certificate': 'Cambridge requires a business certificate. Apply through the City of Cambridge. Check cambridgema.gov for current process.',
      'alcohol-licensing': 'Cambridge has a limited number of liquor licenses. Apply early and check License Commission requirements.',
      'food-establishment-permit': 'Cambridge Public Health issues food permits. Requirements align with state code; submit plans and pass inspection.'
    }
  },
  Somerville: {
    label: 'Somerville',
    permitAuthority: 'City of Somerville (somervillema.gov), Somerville Licensing Commission, Board of Health',
    typicalTimeline: 'Roughly 6–12 months from idea to open in Somerville. Permit and inspection timelines vary; plan for health and building approvals.',
    leaseToOpeningNote: 'Typical: 4–8 months from lease signing to opening in Somerville.',
    leaseToOpeningStepsNote: 'Somerville permits and buildout can run in parallel. Check zoning and alcohol license availability early.',
    taskTips: {
      'business-concept': 'Somerville supports diverse, neighborhood-oriented restaurants. Consider Davis, Union, and Assembly areas.',
      'neighborhood-research': 'Davis Square, Union Square, and Assembly Row have strong foot traffic. Green Line Extension improves access.',
      'boston-zoning-compliance': 'Verify restaurant use and parking/loading in Somerville zoning. Some areas have mixed-use and special permits.',
      'business-certificate': 'Somerville requires a business certificate. See somervillema.gov for application and fees.',
      'alcohol-licensing': 'Somerville has a limited quota of liquor licenses. Contact the Licensing Commission for availability and process.'
    }
  },
  Brookline: {
    label: 'Brookline',
    permitAuthority: 'Town of Brookline (brooklinema.gov), Brookline Health Department, Select Board',
    typicalTimeline: 'Roughly 6–12 months from idea to open in Brookline. Brookline has its own health and licensing requirements.',
    leaseToOpeningNote: 'Typical: 4–8 months from lease signing to opening in Brookline.',
    leaseToOpeningStepsNote: 'Check Brookline health and zoning requirements early; some areas have strict use rules.',
    taskTips: {
      'neighborhood-research': 'Coolidge Corner, Washington Square, and Brookline Village are key commercial areas. Parking and transit matter.',
      'boston-zoning-compliance': 'Brookline zoning is strict. Confirm restaurant use and any special permit requirements with the Planning Department.',
      'business-certificate': 'Brookline requires local business registration. See brooklinema.gov for current process.',
      'food-establishment-permit': 'Brookline Health Department issues food service permits. Align with state and local code.'
    }
  },
  Quincy: {
    label: 'Quincy',
    permitAuthority: 'City of Quincy (quincyma.gov), Quincy Health Department, Licensing Board',
    typicalTimeline: 'Roughly 6–12 months from idea to open in Quincy. Timelines depend on health and building approvals.',
    leaseToOpeningNote: 'Typical: 4–8 months from lease signing to opening in Quincy.',
    leaseToOpeningStepsNote: 'Apply for local licenses and permits early; coordinate with health and building departments.',
    taskTips: {
      'neighborhood-research': 'Quincy Center and surrounding areas offer foot traffic. Consider Red Line access and parking.',
      'business-certificate': 'Quincy requires a business certificate and any food/alcohol licenses. Check quincyma.gov.',
      'food-establishment-permit': 'Quincy Health Department oversees food establishment permits. Follow state and local requirements.'
    }
  },
  Newton: {
    label: 'Newton',
    permitAuthority: 'City of Newton (newtonma.gov), Newton Health & Human Services, Licensing',
    typicalTimeline: 'Roughly 6–12 months from idea to open in Newton. Newton has village-based commercial areas.',
    leaseToOpeningNote: 'Typical: 4–8 months from lease signing to opening in Newton.',
    leaseToOpeningStepsNote: 'Newton villages have different characters; check zoning and parking for your site.',
    taskTips: {
      'neighborhood-research': 'Newton Centre, Newtonville, and other villages have distinct demographics and traffic. Parking is important.',
      'boston-zoning-compliance': 'Newton zoning varies by village. Verify restaurant use and any special permits.',
      'business-certificate': 'Newton requires local business registration and compliance. See newtonma.gov.'
    }
  },
  Worcester: {
    label: 'Worcester',
    permitAuthority: 'City of Worcester (worcesterma.gov), Worcester Division of Public Health, License Commission',
    typicalTimeline: 'Roughly 6–12 months from idea to open in Worcester. Costs and timelines can be lower than Boston metro.',
    leaseToOpeningNote: 'Typical: 4–8 months from lease signing to opening in Worcester.',
    leaseToOpeningStepsNote: 'Worcester has its own licensing and health process. Apply early for alcohol if needed.',
    taskTips: {
      'cost-analysis': 'Worcester startup and rent costs are generally lower than Boston. Plan for solid working capital.',
      'neighborhood-research': 'Downtown, Canal District, and Shrewsbury Street are strong restaurant corridors.',
      'business-certificate': 'Worcester requires a business certificate and applicable licenses. See worcesterma.gov.',
      'food-establishment-permit': 'Worcester Division of Public Health issues food permits. Follow state and local code.'
    }
  },
  Springfield: {
    label: 'Springfield',
    permitAuthority: 'City of Springfield (springfieldma.gov), Springfield Health & Human Services, License Commission',
    typicalTimeline: 'Roughly 6–12 months from idea to open in Springfield. Local and state permits apply.',
    leaseToOpeningNote: 'Typical: 4–8 months from lease signing to opening in Springfield.',
    leaseToOpeningStepsNote: 'Check Springfield licensing and health requirements; state alcohol rules apply.',
    taskTips: {
      'cost-analysis': 'Springfield can offer lower startup and operating costs than eastern Massachusetts.',
      'business-certificate': 'Springfield requires local business registration and licenses. See springfieldma.gov.',
      'food-establishment-permit': 'Springfield Health Department oversees food service permits. Align with state code.'
    }
  },
  'Other MA': {
    label: 'Other (Massachusetts)',
    permitAuthority: 'Your city or town clerk, board of health, and state agencies (Mass.gov).',
    typicalTimeline: 'Roughly 6–12 months from idea to open. Timelines vary by town; check local health, zoning, and licensing.',
    leaseToOpeningNote: 'Typical: 4–8 months from lease signing to opening; varies by municipality.',
    leaseToOpeningStepsNote: 'Permits and buildout often run in parallel. Confirm requirements with your town.',
    taskTips: {}
  },
  Other: {
    label: 'Other',
    permitAuthority: 'Your local city or town government and state agencies. Research health, zoning, and business licensing for your jurisdiction.',
    typicalTimeline: 'Timelines vary by location. Plan for concept and funding (1–3 months), then location, permits, and buildout (4–8+ months), then launch (1–2 months).',
    leaseToOpeningNote: 'Typical: 4–8 months from lease to opening in many markets; confirm with local experts.',
    leaseToOpeningStepsNote: 'Check local permit and inspection requirements early.',
    taskTips: {}
  }
};

/**
 * Get config for the selected area (city/town). Falls back to Boston if area not found.
 * @param {string} area - Value from LOCATION_OPTIONS (e.g. 'Boston', 'Cambridge')
 * @returns {{ label, permitAuthority, typicalTimeline, leaseToOpeningNote, leaseToOpeningStepsNote, taskTips }}
 */
export function getAreaConfig(area) {
  const key = (area && String(area).trim()) || DEFAULT_LOCATION;
  return AREA_CONFIG[key] || AREA_CONFIG[DEFAULT_LOCATION];
}

/**
 * Get the tip for a specific opening-plan task in the given area.
 * Uses area-specific taskTips if present; for Boston falls back to task.bostonTip; for other areas returns '' if no tip.
 */
export function getTipForTask(area, task) {
  const config = getAreaConfig(area);
  const tip = config.taskTips && config.taskTips[task.id];
  if (tip != null) return tip;
  if (area === 'Boston') return task.bostonTip || '';
  return '';
}

export { LOCATION_OPTIONS, DEFAULT_LOCATION };
