const PENDING_ASSESSMENT_KEY = 'iterum_pending_free_assessment';

export const savePendingAssessment = (assessment) => {
  if (typeof window === 'undefined' || !assessment) return;
  try {
    localStorage.setItem(PENDING_ASSESSMENT_KEY, JSON.stringify(assessment));
  } catch (error) {
    // Ignore storage failures in restricted environments
  }
};

export const getPendingAssessment = () => {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(PENDING_ASSESSMENT_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (error) {
    return null;
  }
};

export const clearPendingAssessment = () => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(PENDING_ASSESSMENT_KEY);
  } catch (error) {
    // Ignore storage failures in restricted environments
  }
};
