/**
 * Derive in-app notification items from draft data, opening plan, compliance, and trial.
 * Used by the notification center in the header.
 */

import { OPENING_PLAN_TOTAL_TASKS } from '../components/startup/OpeningPlan';

/**
 * @param {Object} state - App state
 * @returns {{ id: string, type: string, title: string, body: string, actionTab?: string, due?: string }[]}
 */
export function getNotifications(state) {
  const readIds = state.notificationReadIds || [];
  const items = [];

  // Opening plan: incomplete tasks
  const completedTaskIds = state.openingPlanProgress?.completedTaskIds || [];
  const remaining = OPENING_PLAN_TOTAL_TASKS - completedTaskIds.length;
  if (remaining > 0) {
    items.push({
      id: 'opening-plan-incomplete',
      type: 'opening-plan',
      title: 'Opening plan in progress',
      body: `${remaining} of ${OPENING_PLAN_TOTAL_TASKS} tasks remaining. Complete your opening checklist.`,
      actionTab: 'startup-and-opening'
    });
  }

  // Trial / subscription reminder (if you have trial end in state)
  const periodEnd = state.subscription?.currentPeriodEnd;
  if (periodEnd) {
    const end = new Date(periodEnd);
    const now = new Date();
    const daysLeft = Math.ceil((end - now) / (1000 * 60 * 60 * 24));
    if (daysLeft <= 7 && daysLeft > 0) {
      items.push({
        id: 'trial-ending-soon',
        type: 'trial',
        title: 'Trial ending soon',
        body: `Your trial ends in ${daysLeft} day${daysLeft === 1 ? '' : 's'}. Upgrade to keep full access.`,
        actionTab: 'pricing'
      });
    } else if (daysLeft <= 0) {
      items.push({
        id: 'trial-ended',
        type: 'trial',
        title: 'Trial ended',
        body: 'Upgrade to restore full access to your plans and documents.',
        actionTab: 'pricing'
      });
    }
  }

  // Compliance: generic reminder to review licenses (quarterly feel)
  const currentMonth = new Date().getMonth();
  if ([2, 5, 8, 11].includes(currentMonth)) {
    items.push({
      id: 'compliance-quarterly',
      type: 'compliance',
      title: 'Review permits & licenses',
      body: 'Quarterly check: review your permits, business certificate, and tax filings.',
      actionTab: 'compliance'
    });
  }

  return items.filter((item) => !readIds.includes(item.id));
}
