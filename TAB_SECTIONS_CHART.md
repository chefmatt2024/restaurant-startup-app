# Dashboard Tabs — Pre-opening vs Operations vs Both

Single reference for every dashboard tab and which phase(s) it belongs to. Tabs are grouped in the sidebar by these sections so users can see at a glance what’s for planning, what’s for running the restaurant, and what’s used in both.

---

## Phase definitions

| Phase | Meaning |
|-------|--------|
| **Pre-opening / Plan** | Used mainly when planning *before* opening: concept, permits, financial projections, timeline, branding, vendor setup, etc. |
| **Operations** | Used mainly when the restaurant is *open*: P&L reports, ledger, SOPs, business analytics. |
| **Both** | Used in both phases: e.g. financials (projections + ongoing), compliance (permits + renewals), vendors, documents. |

---

## Full tab chart

| Tab ID | Label | Phase | Description |
|--------|--------|--------|-------------|
| `startup-and-opening` | Startup & Opening Plan | **Pre-opening** | Journey & local roadmap; task checklist to open. |
| `process-map` | Process map | **Pre-opening** | Start-to-opening: full journey map. |
| `concept-pitch` | Concept & Pitch | **Pre-opening** | Idea, elevator pitch, exec summary. |
| `market-competition` | Market & Competition | **Pre-opening** | Market & competitive analysis. |
| `offer-marketing` | Offer & Marketing | **Pre-opening** | Products, services, marketing plan. |
| `financials` | Financial Projections | **Both** | Projections pre-open; track actuals and P&L ongoing. |
| `team-cap-table` | Team & Cap Table | **Both** | Plan team & cap table pre-open; update as you hire. |
| `operations` | Operations | **Both** | Operations plan pre-open; run ops day-to-day. |
| `timeline` | Project Timeline | **Pre-opening** | Milestones and timeline to open. |
| `vendors-expenses` | Vendors & Expenses | **Both** | Vendors, expenses & ledger in one tab (sub-tabs: Vendors \| Expenses & Ledger). |
| `equipment-menu` | Equipment & Menu | **Both** | Plan equipment & menu pre-open; update menu ongoing. |
| `branding` | Branding Planner | **Pre-opening** | Brand identity & materials. |
| `compliance` | Compliance | **Both** | Permits & licenses pre-open; renewals & certs ongoing. |
| `documents` | Documents | **Both** | Onboarding doc workflow + ongoing docs. |
| `reports` | Reports | **Operations** | P&L, variance, progress (post-open). |
| `sops` | SOPs | **Operations** | Standard operating procedures (post-open). |
| `import` | Import Document | **Both** | Upload & extract data (plan or actuals). |
| `business-analytics` | Business Analytics | **Operations** | Analytics (post-open). |

---

## Sidebar section order

The sidebar groups tabs into three sections, in this order (smooth journey: plan first, shared next, post-open last):

1. **Pre-opening & Plan** — Tabs used mainly before opening (startup plan, process map, concept, market, offer, timeline, branding).
2. **Plan & Operations** — Tabs used in both phases (financials, team, operations, vendors & expenses, equipment & menu, compliance, documents, import).
3. **Operations (post-open)** — Tabs used mainly after opening (reports, SOPs, business analytics).

Within each section, tabs keep the same order as in `DETAIL_VIEW_TABS`.

---

## Progress bar (pre-opening only)

The dashboard “sections complete” progress bar counts only **pre-opening / plan** sections that are in `PROGRESS_SECTION_ORDER` in `src/utils/sectionStatus.js`:

- startup-and-opening, concept-pitch, market-competition, offer-marketing, financials, team-cap-table, operations, timeline, vendors-expenses, equipment-menu, branding, compliance.

It does **not** include: process-map, documents, reports, sops, import, business-analytics (so progress reflects “plan completeness,” not operations tabs).

---

## Where this is defined

| Item | Location |
|------|----------|
| Tab list + phase | `src/components/layout/TabNavigation.js` (`DETAIL_VIEW_TABS`, each tab has `phase`) |
| Progress section order | `src/utils/sectionStatus.js` (`PROGRESS_SECTION_ORDER`) |
| Feature presets (which tabs can be enabled) | `src/config/featurePresets.js` (`ALL_FEATURE_IDS`, `FEATURE_PRESETS`) |
