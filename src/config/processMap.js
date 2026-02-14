/**
 * Full process map: start to opening the restaurant.
 * Used by ProcessMapView for the single end-to-end journey view.
 */

export const JOURNEY_STAGES = [
  { id: 'idea', label: 'Idea', short: 'Concept & vision', duration: '1–2 weeks', icon: 'Lightbulb' },
  { id: 'plan', label: 'Plan & pitch', short: 'Business plan, pitch, team', duration: '2–4 weeks', icon: 'FileText' },
  { id: 'money-location', label: 'Money & location', short: 'Funding, lease, zoning', duration: '2–3 months', icon: 'MapPin' },
  { id: 'permits', label: 'Permits & compliance', short: 'Licenses, health, building', duration: '2–4 months', icon: 'Shield' },
  { id: 'buildout', label: 'Buildout & equipment', short: 'Design, construction, equipment', duration: '2–4 months', icon: 'Wrench' },
  { id: 'launch', label: 'Launch prep', short: 'Staff, training, soft open', duration: '1–2 months', icon: 'Rocket' },
  { id: 'open', label: 'Open', short: 'Certificate of occupancy, open doors', duration: '—', icon: 'CheckCircle' }
];

/** Six detailed phases (match Opening Plan phases) with tab/section links */
export const PROCESS_PHASES = [
  {
    id: 'preparation',
    phaseNumber: 1,
    title: 'Preparation & planning',
    description: 'Define your concept, elevator pitch, executive summary, and management team structure.',
    duration: '2–4 weeks',
    tabId: 'concept-pitch',
    openingPlanPhaseId: 'preparation',
    taskSummary: 'Concept, pitch, exec summary, team plan',
    color: 'blue'
  },
  {
    id: 'financial',
    phaseNumber: 2,
    title: 'Financial planning & funding',
    description: 'Calculate startup costs, develop funding strategy, and research Boston-specific grants and loans.',
    duration: '3–6 weeks',
    tabId: 'financials',
    openingPlanPhaseId: 'financial',
    taskSummary: 'Startup costs, funding package, lender materials',
    color: 'green'
  },
  {
    id: 'location',
    phaseNumber: 3,
    title: 'Location & real estate',
    description: 'Research neighborhoods, find properties, negotiate lease, and confirm Boston zoning compliance.',
    duration: '4–8 weeks',
    tabId: 'operations',
    openingPlanPhaseId: 'location',
    taskSummary: 'Neighborhood research, property search, lease, zoning',
    color: 'purple'
  },
  {
    id: 'permits',
    phaseNumber: 4,
    title: 'Permits & compliance',
    description: 'Business certificate, food establishment permit, building permits, alcohol (if applicable), inspections, Certificate of Occupancy.',
    duration: '2–4 months',
    tabId: 'compliance',
    openingPlanPhaseId: 'permits',
    taskSummary: 'Business cert, licenses, building & health permits, CO',
    color: 'red'
  },
  {
    id: 'buildout',
    phaseNumber: 5,
    title: 'Buildout & equipment',
    description: 'Design and layout, select and order equipment, manage construction and buildout.',
    duration: '2–4 months',
    tabId: 'equipment-menu',
    openingPlanPhaseId: 'buildout',
    taskSummary: 'Design, equipment selection, construction',
    color: 'orange'
  },
  {
    id: 'operations',
    phaseNumber: 6,
    title: 'Operations & launch',
    description: 'Hire and train staff, finalize menu, POS and inventory, insurance, training week, first-week schedule, health prep, soft open, grand opening.',
    duration: '1–2 months',
    tabId: 'startup-and-opening',
    openingPlanPhaseId: 'operations',
    taskSummary: 'Staffing, POS, inventory, training, soft open, open',
    color: 'indigo'
  }
];

/** Once lease is signed: simplified path (often parallel work) */
export const LEASE_TO_OPENING_STEPS = [
  { step: 1, name: 'Lease & pre-construction', summary: 'Sign lease, lock design, line up contractor and permit applications', duration: '2–4 weeks' },
  { step: 2, name: 'Permits (apply early)', summary: 'Business certificate, building permits, food establishment permit, alcohol if applicable', duration: '2–4 months (parallel with buildout)' },
  { step: 3, name: 'Construction & buildout', summary: 'Buildout, equipment install, inspections as required', duration: '2–4 months' },
  { step: 4, name: 'Final permits & inspections', summary: 'Certificate of Occupancy, health inspection, fire, Food Establishment Permit', duration: '2–4 weeks before opening' },
  { step: 5, name: 'Pre-opening & opening', summary: 'Staffing, training, soft open, then open to the public', duration: '2–4 weeks' }
];

/** Final 30 days: critical gates before opening (task IDs match Opening Plan) */
export const FINAL_30_GATES = [
  { id: 'health-inspection-prep', label: 'Health inspection prep checklist done', tabId: 'compliance' },
  { id: 'inspections', label: 'All required inspections scheduled and passed', tabId: 'compliance' },
  { id: 'food-establishment-permit', label: 'Food Establishment Permit (health passed)', tabId: 'compliance' },
  { id: 'certificate-of-occupancy', label: 'Certificate of Occupancy obtained', tabId: 'compliance' },
  { id: 'insurance-certificates', label: 'Insurance certificates filed', tabId: 'compliance' },
  { id: 'bank-cash', label: 'Bank account & cash handling set', tabId: 'financials' },
  { id: 'pos-payments', label: 'POS & payments go-live (tested)', tabId: 'financials' },
  { id: 'opening-inventory', label: 'Opening inventory ordered and scheduled', tabId: 'vendors' },
  { id: 'training-schedule', label: 'Training week completed', tabId: 'team-cap-table' },
  { id: 'first-week-staffing', label: 'First-week staffing schedule published', tabId: 'team-cap-table' },
  { id: 'soft-opening', label: 'Soft opening completed', tabId: 'startup-and-opening' },
  { id: 'grand-opening-run-of-show', label: 'Grand opening day run-of-show ready', tabId: 'startup-and-opening' }
];

/** Typical total timeline (from idea to open) */
export const TYPICAL_TIMELINE = 'Roughly 6–12 months from idea to open in Boston (idea & plan 1–2 months, funding & location 2–3 months, permits & buildout 4–8 months in parallel, launch 1–2 months).';
