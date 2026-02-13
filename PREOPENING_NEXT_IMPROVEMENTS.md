# What’s Next to Update and Improve for Pre-Opening

Prioritized improvements for the pre-opening flow (Opening Plan, Startup Journey, permits, buildout → open). Use this with **OPENING_PROCESS_LEASE_TO_OPENING.md** and the in-app **Process review** card.

---

## 1. Persist Opening Plan task completion (high impact, medium effort)

**Issue:** In **Opening Plan**, checked tasks are stored only in React state (`completedTasks`). Refreshing the page or switching drafts clears progress.

**Improvement:**
- Store completed task IDs in the draft, e.g. `draft.openingPlanProgress = { completedTaskIds: ['business-concept', 'cost-analysis', ...] }`.
- Add a reducer/action (e.g. `updateOpeningPlanProgress`) and merge this into draft save/load in AppContext.
- Opening Plan reads/writes from `state` (current draft) instead of local `useState`.

**Result:** Users keep their checklist progress across sessions and devices.

---

## 2. Link Opening Plan tasks to app sections (high impact, medium effort)

**Issue:** Tasks say “Complete Idea Formation”, “Create Financial Projections”, etc., but there’s no link to those tabs and no automatic “done” from actually completing the section.

**Improvement:**
- Add an optional `tabId` (or `sectionId`) to each task in `openingPhases` (e.g. `tabId: 'idea-formation'`, `tabId: 'financials'`).
- In the task card: “Open in app” button that calls `actions.setActiveTab(tabId)` and optionally switches to Detailed View.
- Optionally: treat a task as completed if `sectionStatus[tabId]?.completed` is true (using existing `getSectionStatus`), so progress in the plan and in the app stay in sync.

**Result:** One place to see what to do next and jump straight to the right tab.

---

## 3. Connect Permitting Wizard and Open Restaurant to Opening Plan (medium impact, medium effort)

**Issue:** Opening Plan Phase 4 (Permits) and Phase 6 (Operations) mention permits and documents, but they don’t share state with **Permitting Wizard** or **Open Restaurant Manager**.

**Improvement:**
- In Opening Plan task definitions, add `relatedComponent: 'permitting-wizard'` or `relatedTab: 'open-restaurant'` where relevant.
- “Open Permitting Wizard” / “Open Open Restaurant” buttons that switch to that tab (and optionally to the right step).
- Optionally persist Permitting Wizard `completedSteps` and Open Restaurant document status in the draft, and show “X of Y steps done” in the Opening Plan task.

**Result:** One coherent pre-opening checklist that includes permits and document status.

---

## 4. Pre-opening budget / runway view (medium impact, low–medium effort)

**Issue:** Startup costs include pre-opening items (pre-opening salaries, rent, training, etc.) but there’s no single “pre-opening budget” or “runway until open” view.

**Improvement:**
- In **Financial Projections** (or a small card on Dashboard/Opening Plan): a “Pre-opening budget” block that sums:
  - Pre-opening salaries, pre-opening rent, training/pre-open, deposits, and any other pre-opening line items from startup costs.
- Optionally: “Months of runway” or “Weeks until target open date” if user has set an opening date (e.g. in Timeline or a new “Target open date” field).

**Result:** Clear view of how much is allocated to the pre-opening period.

---

## 5. Timeline ↔ Opening Plan phase sync (medium impact, medium effort)

**Issue:** **Project Timeline** and **Opening Plan** both represent stages (lease → permits → buildout → open) but are separate. Users may update one and not the other.

**Improvement:**
- Add a high-level “Opening phases” section to Timeline (or template) that mirrors the Process review: Lease, Permits, Buildout, Final inspections, Pre-opening.
- Link from Opening Plan “Process review” card to Timeline: “Edit dates in Project Timeline”.
- Optionally: single “Target opening date” in draft that both Timeline and Opening Plan use (e.g. for “weeks until open” or phase deadlines).

**Result:** One timeline and one checklist that stay aligned.

---

## 6. Boston-specific links and forms (lower effort, high value for Boston users)

**Issue:** Boston tips and Form 4/14 are referenced; direct links and “what you need” could be easier to find.

**Improvement:**
- In Opening Plan (and Permitting Wizard), add stable links: BPHC Food Establishment Permit, ISD (building/site), Boston Fire, Secretary of State, etc.
- In **Documents & Compliance** (or Open Restaurant), add a “Boston restaurant permits” quick list with official links and, where applicable, “Form 4/14” and other required forms.
- Ensure the Form 4/14 PDF (or link) is easy to reach from the Food Establishment Permit task and from Documents.

**Result:** Faster path to the right agency and form.

---

## 7. “What needs to be done” from Opening Plan (low effort)

**Issue:** Dashboard “What needs to be done” and “Next priority tasks” are useful; they could also reflect Opening Plan progress.

**Improvement:**
- Include “Next Opening Plan tasks” (e.g. top 2–3 incomplete tasks from `getNextPriorityTasks()`) in the Dashboard overview or in the Getting Started checklist.
- If Opening Plan progress is persisted (see #1), show “Opening Plan: X% complete” on the overview.

**Result:** Pre-opening progress visible without opening the Opening Plan tab.

---

## 8. Getting Started checklist and Opening Plan alignment (low effort)

**Issue:** **Getting Started Checklist** (idea, financials, market, operations, timeline, team) is separate from Opening Plan phases; both guide new users.

**Improvement:**
- Add one checklist item: “Start Opening Plan” or “Complete Phase 1 of Opening Plan” that links to the Startup & Opening Plan tab and considers “completed” when e.g. Phase 1 progress &gt; 0% or when key tasks are done (once #1 is done).
- Ensure checklist “operations” check doesn’t rely on `draft.businessPlan.operations` (array) if that’s not used; consider `operationsPlan` or hours/facility filled instead.

**Result:** New users are guided into the Opening Plan from day one.

---

## Suggested order

| Priority | Item | Why first |
|----------|------|-----------|
| 1 | Persist Opening Plan task completion (#1) | Progress is lost on refresh; fixes a major gap. |
| 2 | Link tasks to app sections (#2) | Makes the plan actionable and ties it to real app usage. |
| 3 | Pre-opening budget view (#4) | Quick win; uses existing startup cost data. |
| 4 | Opening Plan ↔ Permitting / Open Restaurant (#3) | Unifies permits and documents with the plan. |
| 5 | Timeline ↔ Opening Plan (#5) | Keeps dates and phases aligned. |
| 6 | Boston links and forms (#6) | High value for Boston-focused users. |
| 7 | Dashboard “next” from Opening Plan (#7) + Getting Started alignment (#8) | Improves discoverability and onboarding. |

---

## Already in place

- **Process review** card (lease → permits → buildout → opening) at top of Opening Plan.
- **OPENING_PROCESS_LEASE_TO_OPENING.md** as the single end-to-end checklist.
- Opening Plan phases 1–6 with Boston tips and task lists.
- Operations hours/days shared between Operations tab and Financials.
- Documents & Compliance, Permitting Wizard, Open Restaurant Manager, Yearly License Checklist, Certifications.
- Financials: startup costs (including pre-opening salaries, rent, training), revenue projections by day/hour.

Use this list to pick the next sprint focus for pre-opening; start with #1 and #2 for the biggest impact.
