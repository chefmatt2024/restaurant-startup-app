const PENDING_STARTUP_CHECKLIST_KEY = 'iterum_pending_startup_checklist';

export const savePendingStartupChecklist = (checklist) => {
  if (typeof window === 'undefined' || !checklist) return;
  try {
    localStorage.setItem(PENDING_STARTUP_CHECKLIST_KEY, JSON.stringify(checklist));
  } catch (error) {
    // Ignore storage failures
  }
};

export const getPendingStartupChecklist = () => {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(PENDING_STARTUP_CHECKLIST_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (error) {
    return null;
  }
};

export const clearPendingStartupChecklist = () => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(PENDING_STARTUP_CHECKLIST_KEY);
  } catch (error) {}
};
