/**
 * Tailored recommendations based on assessment score, red flags, and weak sections.
 */
import { ASSESSMENT_SECTIONS } from '../config/restaurantAssessmentChecklist';

const VALUE_PASS = 'pass';
const VALUE_NA = 'na';

export const getSectionScores = (answers) => {
  const normalSections = ASSESSMENT_SECTIONS.filter((s) => !s.redFlag);
  const scores = {};

  normalSections.forEach((sec) => {
    let applicable = 0;
    let passed = 0;
    sec.items.forEach((item) => {
      const v = answers[item.id];
      if (v === VALUE_NA) return;
      applicable += 1;
      if (v === VALUE_PASS) passed += 1;
    });
    scores[sec.id] =
      applicable > 0
        ? { score: Math.round((passed / applicable) * 100), passed, applicable, label: sec.title }
        : null;
  });

  return scores;
};

export const getWeakSections = (sectionScores, threshold = 70) => {
  return Object.entries(sectionScores)
    .filter(([_, data]) => data && data.score < threshold)
    .map(([id, data]) => ({ id, ...data }));
};

export const getRecommendations = (tier, redFlagCount, weakSections) => {
  const recs = [];

  if (redFlagCount > 0) {
    recs.push({
      priority: 'high',
      title: 'Address red flags before proceeding',
      text: `You observed ${redFlagCount} deal-breaker${redFlagCount > 1 ? 's' : ''}. Verify permits, financials, and operations before committing. Consider a professional due diligence review.`,
    });
  }

  if (tier === 'low' && redFlagCount === 0) {
    recs.push({
      priority: 'high',
      title: 'Proceed with caution',
      text: 'The first-visit score suggests significant gaps. Before walking away, consider a second visit at a different day/time, or dig into financials to understand the full picture.',
    });
  }

  if (tier === 'medium') {
    recs.push({
      priority: 'medium',
      title: 'Worth a closer look',
      text: 'The place passed your first filter. Next: review permits, P&L, lease, and labor. Use the Restauranteur App to build a due diligence plan before you commit.',
    });
  }

  if (tier === 'high') {
    recs.push({
      priority: 'low',
      title: 'Strong first impression',
      text: 'Your one-visit assessment looks positive. Move to financial and legal due diligence. Save your results and build your full plan in the Restauranteur App.',
    });
  }

  if (weakSections.length > 0) {
    const sectionNames = weakSections.map((s) => s.label).join(', ');
    recs.push({
      priority: 'medium',
      title: 'Focus on weak areas',
      text: `Sections with lower scores: ${sectionNames}. Consider a follow-up visit to verify, or ask the seller/operator about these areas during due diligence.`,
    });
  }

  recs.push({
    priority: 'low',
    title: 'Next step',
    text: 'Sign up free to save this assessment and build your full due diligence plan—business plan, financials, permits—in one place with the Restauranteur App.',
  });

  return recs;
};
