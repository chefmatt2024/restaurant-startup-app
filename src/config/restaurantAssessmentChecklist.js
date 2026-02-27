/**
 * Secret-shopper style restaurant assessment checklist.
 * Used for a free pre–due diligence evaluation (one visit).
 * Each item: Pass / Fail / N/A. Red-flag items are called out in the summary.
 */
export const ASSESSMENT_SECTIONS = [
  {
    id: 'first-impressions',
    title: 'First impressions',
    description: 'Exterior, signage, and initial welcome',
    icon: 'Eye',
    items: [
      { id: 'signage-clear', label: 'Signage and branding are clear and in good condition' },
      { id: 'entrance-clean', label: 'Entrance and windows are clean and inviting' },
      { id: 'wait-stated', label: 'Wait time or seating process was clearly stated' },
      { id: 'greeted', label: 'Greeted within a reasonable time' },
    ],
  },
  {
    id: 'service',
    title: 'Service',
    description: 'Staff, timing, and hospitality',
    icon: 'Users',
    items: [
      { id: 'staff-attentive', label: 'Staff appeared attentive and present (not on phones)' },
      { id: 'order-accuracy', label: 'Order taken accurately; questions answered' },
      { id: 'pace-appropriate', label: 'Pacing felt appropriate (not rushed or neglected)' },
      { id: 'check-in', label: 'Server checked in during meal (drinks, satisfaction)' },
      { id: 'bill-handled', label: 'Bill and payment handled smoothly' },
    ],
  },
  {
    id: 'food-beverage',
    title: 'Food & beverage',
    description: 'Quality, consistency, and value',
    icon: 'Utensils',
    items: [
      { id: 'food-quality', label: 'Food quality met expectations for concept and price' },
      { id: 'temp-portion', label: 'Temperature and portion size were appropriate' },
      { id: 'beverages', label: 'Beverages (non-alcoholic and/or alcoholic) were well executed' },
      { id: 'value', label: 'Perceived value for price was fair' },
    ],
  },
  {
    id: 'cleanliness-safety',
    title: 'Cleanliness & safety',
    description: 'Dining area, restrooms, visible BOH',
    icon: 'ShieldCheck',
    items: [
      { id: 'tables-clean', label: 'Tables, seats, and condiments were clean' },
      { id: 'floors-clear', label: 'Floors and walkways were clear and clean' },
      { id: 'restrooms', label: 'Restrooms were clean and stocked' },
      { id: 'visible-hygiene', label: 'No visible hygiene or safety red flags in view' },
    ],
  },
  {
    id: 'operations',
    title: 'Operations (what you can see)',
    description: 'Flow, organization, and readiness',
    icon: 'LayoutGrid',
    items: [
      { id: 'host-station', label: 'Host/stand area seemed organized' },
      { id: 'expo-runner', label: 'Food running / expo appeared coordinated' },
      { id: 'stock-levels', label: 'No obvious out-of-stock or “86” chaos' },
      { id: 'pos-tech', label: 'POS/tech in use without visible meltdowns' },
    ],
  },
  {
    id: 'vibe-atmosphere',
    title: 'Vibe & atmosphere',
    description: 'Fit for concept and target guest',
    icon: 'Sparkles',
    items: [
      { id: 'music-volume', label: 'Music/ambience fit the concept and volume was reasonable' },
      { id: 'seating-comfort', label: 'Seating was comfortable for the visit length' },
      { id: 'crowd-fit', label: 'Crowd and energy matched the concept' },
    ],
  },
  {
    id: 'red-flags',
    title: 'Red flags (deal-breakers)',
    description: 'Items that warrant deeper due diligence or walking away',
    icon: 'AlertTriangle',
    redFlag: true,
    items: [
      { id: 'rf-cleanliness', label: 'Serious cleanliness or pest concerns' },
      { id: 'rf-rude-staff', label: 'Rude or unprofessional staff' },
      { id: 'rf-major-wait', label: 'Excessive wait or chaos with no acknowledgment' },
      { id: 'rf-food-safety', label: 'Obvious food safety or handling concerns' },
      { id: 'rf-empty-dead', label: 'Restaurant empty or “dead” at expected peak' },
      { id: 'rf-equipment-broken', label: 'Visible broken or poorly maintained equipment' },
    ],
  },
];

export const SCORE_LABELS = {
  high: { label: 'Strong first impression', color: 'green', min: 80 },
  medium: { label: 'Worth a closer look', color: 'amber', min: 60 },
  low: { label: 'Proceed with caution', color: 'red', min: 0 },
};
