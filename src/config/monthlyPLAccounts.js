/**
 * Monthly P&L chart of accounts for revenue and expense estimates.
 * Structure: section id -> { title, totalLabel, lines: [ { code, label } ] }
 */

export const MONTHLY_PL_SECTIONS = [
  {
    id: 'revenue',
    title: '10 Revenue',
    totalLabel: 'Total 10 Revenue',
    lines: [
      { code: '4105', label: 'Sales- Food' },
      { code: '4110', label: 'Sales- Beverage' },
      { code: '4115', label: 'Sales- Retail Food' },
      { code: '4120', label: 'Sales- Retail Beverage' },
      { code: '4125', label: 'Sales- Paper Goods' },
      { code: '4130', label: 'Sales- Doggo Supplies' },
      { code: '4135', label: 'Sales - Merch' },
      { code: '4140', label: 'Sales- Service Fee' },
      { code: '4145', label: 'Discounts given' },
      { code: '4170', label: 'Catering Revenue' },
      { code: '4180', label: 'Infi Sales' }
    ]
  },
  {
    id: 'cogs',
    title: '11 Cost of Goods Sold',
    totalLabel: 'Total 11 Cost of Goods Sold',
    lines: [
      { code: '5105', label: 'COGS- Food' },
      { code: '5110', label: 'COGS- Beverage' },
      { code: '5115', label: 'COGS- Retail Food' },
      { code: '5120', label: 'COGS- Retail Beverage' },
      { code: '5125', label: 'COGS- Paper Goods' },
      { code: '5130', label: 'COGS- Doggo Supplies' },
      { code: '5135', label: 'COGS- Merch' }
    ]
  },
  {
    id: 'labor',
    title: '12 Labor',
    totalLabel: 'Total 12 Labor',
    lines: [
      { code: '5205', label: 'Payroll Wage Expenses' },
      { code: '5245', label: 'Payroll Taxes Paychex' },
      { code: '5315', label: 'Payroll Tax Expense' },
      { code: '5335', label: 'Employee Benefits' }
    ]
  },
  {
    id: 'directOperating',
    title: '13 Direct Operating Expenses',
    totalLabel: 'Total 13 Direct Operating Expenses',
    lines: [
      { code: '6110', label: 'Equipment Lease Rental' },
      { code: '6115', label: 'Cleaning Supplies' },
      { code: '6150', label: 'Kitchen Smallwares' }
    ]
  },
  {
    id: 'transaction',
    title: '14 Transaction Related Expenses',
    totalLabel: 'Total 14 Transaction Related Expenses',
    lines: [
      { code: '6205', label: 'Credit Card Fees Processing' },
      { code: '6215', label: 'Grubhub Processing Fees' },
      { code: '6220', label: 'Monthly Service Fee (BLDC)' },
      { code: '6235', label: 'Grubhub Delivery Commission' },
      { code: '6240', label: 'INFI Processing Fee' },
      { code: '6245', label: 'EZ Cater Commission' },
      { code: '6250', label: 'Uber Eats - Marketplace fee' }
    ]
  },
  {
    id: 'marketing',
    title: '15 Marketing and Advertising',
    totalLabel: 'Total 15 Marketing and Advertising',
    lines: [
      { code: '6260', label: 'Advertising/Promotional' },
      { code: '6270', label: 'Marketing by Grubhub' },
      { code: '6275', label: 'Grubhub Promotions' },
      { code: '6280', label: 'Uber Eats - Merchant promotions' }
    ]
  },
  {
    id: 'generalAdmin',
    title: '16 General & Administrative Expenses',
    totalLabel: 'Total 16 General & Administrative Expenses',
    lines: [
      { code: '6505', label: 'Accounting & Bookkeeping' },
      { code: '6525', label: 'Payroll Subscription fees - Paychex' },
      { code: '6530', label: 'Payroll Processing Fees' },
      { code: '6535', label: 'Software, IT & Website' },
      { code: '6550', label: 'Dues and Subscriptions' },
      { code: '6560', label: 'Bank Charges & Fees' },
      { code: '6570', label: 'License & Permits' },
      { code: '6575', label: 'Office Supplies & Expenses' },
      { code: '6590', label: 'Insurance General' },
      { code: '6591', label: 'Business Owners Insurance' },
      { code: '6592', label: 'Insurance Workers Comp' },
      { code: '6600', label: 'Penalties and Settlements' },
      { code: '6605', label: 'Phone and Internet' },
      { code: '6610', label: 'Security Expense' },
      { code: '6615', label: 'Cash Collection Over-Under' },
      { code: '6620', label: 'QuickBooks Payments Fees' },
      { code: '6625', label: 'General Paper Goods' }
    ]
  },
  {
    id: 'travelMeals',
    title: '17 Travel, Meals & Entertainment',
    totalLabel: 'Total 17 Travel, Meals & Entertainment',
    lines: [
      { code: '6710', label: 'Meals & Entertainment' },
      { code: '6725', label: 'Fuel' }
    ]
  },
  {
    id: 'repairsMaintenance',
    title: '18 Repairs & Maintenance',
    totalLabel: 'Total 18 Repairs & Maintenance',
    lines: [
      { code: '6815', label: 'Repairs & Maintenance, Facility' },
      { code: '6820', label: 'Pest Control' }
    ]
  },
  {
    id: 'property',
    title: '19 Property Expenses',
    totalLabel: 'Total 19 Property Expenses',
    lines: [
      { code: '7105', label: 'Rent/Lease' },
      { code: '7115', label: 'Property/RE Tax' },
      { code: '7125', label: 'Utilities- Electric/Gas' },
      { code: '7135', label: 'Utility, Trash Removal' },
      { code: '7140', label: 'Utility, Water & Sewage' },
      { code: '7145', label: 'Storage' }
    ]
  },
  {
    id: 'otherIncome',
    title: '20 Other Income',
    totalLabel: 'Total 20 Other Income',
    lines: [
      { code: '8120', label: 'Credit Card Rewards' },
      { code: '8130', label: 'Grant' }
    ]
  },
  {
    id: 'otherExpenses',
    title: '21 Other Expenses',
    totalLabel: 'Total 21 Other Expenses',
    lines: [
      { code: '8205', label: 'BLDC Notes Payable Interest Expenses' },
      { code: '8210', label: 'Leaf Loan Interest Expense' },
      { code: '8215', label: 'Trinity Loan Interest' },
      { code: '8220', label: 'Other Interest Expense' },
      { code: '8330', label: 'Prior Year Income/Expense' }
    ]
  }
];

/** Build initial monthlyPL state (all zeros) from MONTHLY_PL_SECTIONS */
export function getInitialMonthlyPL() {
  const pl = {};
  MONTHLY_PL_SECTIONS.forEach((section) => {
    pl[section.id] = {};
    section.lines.forEach(({ code }) => {
      pl[section.id][code] = 0;
    });
  });
  return pl;
}
