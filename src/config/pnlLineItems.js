/**
 * P&L line items: full lists of operating and startup expenses for projections,
 * monthly parsing, and vendor linkage (like an actual P&L).
 */

// All operating expense keys (annual) – match financialData.operatingExpenses
// Used for: Financial Projections form, Monthly Statement (annual/12), vendor assignment
export const OPERATING_EXPENSE_KEYS = [
  'rent', 'utilities', 'insurance', 'marketing', 'legalAccounting', 'repairsMaintenance',
  'supplies', 'adminOffice', 'otherOperatingExpenses',
  'linenService', 'trashCollection', 'compostService', 'cleaningService', 'hoodCleaning', 'greaseTrapCleaning',
  'internetPhone', 'securitySystem', 'pestControl', 'wasteManagement', 'equipmentMaintenance', 'uniformService',
  'dishwareReplacement', 'cleaningSupplies', 'paperGoods', 'kitchenSupplies', 'pointOfSale', 'creditCardProcessing',
  'bankFees', 'permitsLicenses', 'musicLicensing', 'deliveryServiceFees', 'trainingCertification', 'employeeBenefits',
  'workersCompensation', 'unemploymentInsurance', 'healthInsurance', 'retirementBenefits', 'uniformLaundry',
  'parkingFees', 'storageFees', 'professionalServices', 'technologySupport', 'softwareSubscriptions',
  'inventoryManagement', 'qualityControl', 'safetyTraining', 'equipmentRental', 'temporaryStaffing', 'consulting',
  'travelEntertainment', 'charitableDonations', 'localTaxes', 'propertyTaxes', 'businessTaxes',
  'depreciation', 'amortization', 'interestExpense', 'loanFees', 'vehicleExpenses',
  'menuPrinting', 'websiteMaintenance', 'emailMarketing', 'socialMediaManagement', 'photography',
  'reservationSystem', 'giftCardFees', 'thirdPartyDeliveryFees', 'employeeMeals', 'smallwares', 'eventHosting'
];

// Human-readable labels for operating expenses
export const OPERATING_EXPENSE_LABELS = {
  rent: 'Rent',
  utilities: 'Utilities',
  insurance: 'Insurance',
  marketing: 'Marketing & Advertising',
  legalAccounting: 'Legal & Accounting',
  repairsMaintenance: 'Repairs & Maintenance',
  supplies: 'Supplies',
  adminOffice: 'Admin & Office',
  otherOperatingExpenses: 'Other Operating',
  linenService: 'Linen Service',
  trashCollection: 'Trash Collection',
  compostService: 'Compost Service',
  cleaningService: 'Cleaning Service',
  hoodCleaning: 'Hood Cleaning',
  greaseTrapCleaning: 'Grease Trap Cleaning',
  internetPhone: 'Internet & Phone',
  securitySystem: 'Security System',
  pestControl: 'Pest Control',
  wasteManagement: 'Waste Management',
  equipmentMaintenance: 'Equipment Maintenance',
  uniformService: 'Uniform Service',
  dishwareReplacement: 'Dishware Replacement',
  cleaningSupplies: 'Cleaning Supplies',
  paperGoods: 'Paper Goods',
  kitchenSupplies: 'Kitchen Supplies',
  pointOfSale: 'Point of Sale',
  creditCardProcessing: 'Credit Card Processing',
  bankFees: 'Bank Fees',
  permitsLicenses: 'Permits & Licenses',
  musicLicensing: 'Music Licensing',
  deliveryServiceFees: 'Delivery Service Fees',
  trainingCertification: 'Training & Certification',
  employeeBenefits: 'Employee Benefits',
  workersCompensation: 'Workers Compensation',
  unemploymentInsurance: 'Unemployment Insurance',
  healthInsurance: 'Health Insurance',
  retirementBenefits: 'Retirement Benefits',
  uniformLaundry: 'Uniform Laundry',
  parkingFees: 'Parking Fees',
  storageFees: 'Storage Fees',
  professionalServices: 'Professional Services',
  technologySupport: 'Technology Support',
  softwareSubscriptions: 'Software Subscriptions',
  inventoryManagement: 'Inventory Management',
  qualityControl: 'Quality Control',
  safetyTraining: 'Safety Training',
  equipmentRental: 'Equipment Rental',
  temporaryStaffing: 'Temporary Staffing',
  consulting: 'Consulting',
  travelEntertainment: 'Travel & Entertainment',
  charitableDonations: 'Charitable Donations',
  localTaxes: 'Local Taxes',
  propertyTaxes: 'Property Taxes',
  businessTaxes: 'Business Taxes',
  depreciation: 'Depreciation',
  amortization: 'Amortization',
  interestExpense: 'Interest Expense',
  loanFees: 'Loan Fees',
  vehicleExpenses: 'Vehicle Expenses',
  menuPrinting: 'Menu Printing',
  websiteMaintenance: 'Website Maintenance',
  emailMarketing: 'Email Marketing',
  socialMediaManagement: 'Social Media',
  photography: 'Photography',
  reservationSystem: 'Reservation System',
  giftCardFees: 'Gift Card Fees',
  thirdPartyDeliveryFees: 'Third-Party Delivery Fees',
  employeeMeals: 'Employee Meals',
  smallwares: 'Smallwares',
  eventHosting: 'Event Hosting'
};

// Startup cost keys (one-time, can be amortized over months for P&L)
export const STARTUP_COST_KEYS = [
  'leaseholdImprovements', 'kitchenEquipment', 'furnitureFixtures', 'initialInventory',
  'preOpeningSalaries', 'depositsLicenses', 'initialMarketing', 'contingency',
  'signage', 'posHardware', 'smallwaresStartup', 'openingBeverageInventory',
  'trainingPreOpen', 'securityInstall', 'hoodVentilation', 'plumbingElectrical',
  'professionalFees', 'preOpeningRent', 'otherStartup'
];

// Labels and optional amortization months (for monthly P&L; null = one-time in month 0)
export const STARTUP_COST_LABELS = {
  leaseholdImprovements: 'Leasehold Improvements',
  kitchenEquipment: 'Kitchen Equipment',
  furnitureFixtures: 'Furniture & Fixtures',
  initialInventory: 'Initial Food Inventory',
  preOpeningSalaries: 'Pre-Opening Salaries',
  depositsLicenses: 'Deposits & Licenses',
  initialMarketing: 'Pre-Opening Marketing',
  contingency: 'Contingency Reserve',
  signage: 'Signage',
  posHardware: 'POS Hardware & Setup',
  smallwaresStartup: 'Smallwares (Opening)',
  openingBeverageInventory: 'Opening Beverage Inventory',
  trainingPreOpen: 'Pre-Opening Training',
  securityInstall: 'Security System Install',
  hoodVentilation: 'Hood & Ventilation',
  plumbingElectrical: 'Plumbing & Electrical',
  professionalFees: 'Legal/Architect/Design',
  preOpeningRent: 'Pre-Opening Rent',
  otherStartup: 'Other Startup'
};

/** Months over which to spread this startup cost in monthly P&L (e.g. 12 = first year) */
export const STARTUP_AMORTIZE_MONTHS = {
  leaseholdImprovements: 60,
  kitchenEquipment: 84,
  furnitureFixtures: 60,
  initialInventory: 1,
  preOpeningSalaries: 1,
  depositsLicenses: 1,
  initialMarketing: 1,
  contingency: 12,
  signage: 60,
  posHardware: 36,
  smallwaresStartup: 12,
  openingBeverageInventory: 1,
  trainingPreOpen: 1,
  securityInstall: 60,
  hoodVentilation: 60,
  plumbingElectrical: 60,
  professionalFees: 1,
  preOpeningRent: 1,
  otherStartup: 12
};

/** Annual operating total from opEx object (excludes labor; labor is separate) */
export function sumOperatingExpenses(opEx, keys = OPERATING_EXPENSE_KEYS) {
  if (!opEx) return 0;
  return keys.reduce((sum, key) => sum + (Number(opEx[key]) || 0), 0);
}

/** Monthly amount for a startup cost (amortized over amortizeMonths) */
export function startupMonthlyAmount(startupCosts, key, amortizeMonthsMap = STARTUP_AMORTIZE_MONTHS) {
  const amount = Number(startupCosts?.[key]) || 0;
  const months = amortizeMonthsMap[key] ?? 12;
  return months > 0 ? amount / months : 0;
}
