# App & Site Map — Features and Workflow

Single reference for all routes, app features (dashboard tabs), project setup, and user workflows.

---

## 1. Site map (routes)

### Restauranteur App (restaurant-startup-app.web.app)

| Path | Description | Auth |
|------|-------------|------|
| `/` | Dashboard (main app) | Required |
| `/dashboard` | Dashboard (alias) | Required |
| `/landing` | In-app landing (Restaurant Business Planner) | No |
| `/assessment` | Free Restaurant Assessment (public) | No |
| `/restaurant-startup-app` | Same as Restauranteur landing | No |
| `/investors` | Investor landing | No |
| `/terms` | Terms of Service | No |
| `/privacy` | Privacy Policy | No |
| `/tech` | Tech stack / platform | No |
| `/faq` | FAQ | No |
| `/sitemap` | Human sitemap (this structure) | No |

**Catch-all:** `*` → redirects to `/`.

### External sites (not in the React app)

| URL | Purpose |
|-----|---------|
| **iterumfoods.xyz** | App/tech hub: links to assessment, Restauranteur App, trial; Firebase landing target. |
| **iterumfoods.xyz/restauranteur-app** | Restauranteur product landing (static). |
| **iterumfoods.com** | Consulting: packages, “Work with us,” “Book a call.” |

---

## 2. Project setup (first project / new project)

Before or when creating a project, users set:

1. **Project intent** (what they’re planning):
   - **Opening a new restaurant** — Planning from scratch: concept, location, permits, launch.
   - **Potentially buying an existing restaurant** — Due diligence, valuation, transition planning.
   - **Helping an existing restaurant** — Improving operations, marketing, or planning for a current business.

2. **Project name** (optional) — e.g. “My First Restaurant Plan”, “Downtown location”.

3. **Feature selection** (which areas to use):
   - **Just the basics** — Startup & Opening, Concept & Pitch, Financials, Compliance.
   - **Full planning** — All plan-building sections (no Reports, Ledger, SOPs, Import, Analytics).
   - **Everything** — All features.
   - **Choose specific areas** — Custom checklist of sections.

**When it appears:** First project (no drafts) shows project setup before the dashboard; “New project” / “New draft” in Header or Draft Manager opens the same setup modal. Stored on the draft as `projectIntent` and `enabledFeatures` (null = all features).

**Implemented in:** `src/components/layout/ProjectSetupModal.js`, `src/config/featurePresets.js`, `src/contexts/AppContext.js` (createDraft, createNewDraft), `src/pages/Dashboard.js` (no-drafts gate), `src/components/layout/Header.js`, `src/components/layout/DraftManager.js`.

---

## 3. App map (dashboard features)

After login, the **Dashboard** (`/` or `/dashboard`) shows:

- **Planning vs Open Restaurant** mode toggle (overview vs detailed view).
- **Overview** — Progress, next tasks, quick links to sections (filtered by project’s enabled features).
- **Detailed view** — Sidebar of sections (tabs) + main content. Only tabs in the project’s `enabledFeatures` are shown (or all if `enabledFeatures` is null).

### Sidebar tabs (planning sections)

| Tab ID | Label | Description |
|--------|--------|-------------|
| `startup-and-opening` | Startup & Opening Plan | Journey & local roadmap |
| `process-map` | Process map | Start to opening: full journey |
| `concept-pitch` | Concept & Pitch | Idea, elevator pitch, exec summary |
| `market-competition` | Market & Competition | Market & competitive analysis |
| `offer-marketing` | Offer & Marketing | Products, services, marketing |
| `financials` | Financial Projections | P&L, projections (available to all) |
| `team-cap-table` | Team & Cap Table | Staffing, management team & cap table |
| `operations` | Operations | Operations plan |
| `timeline` | Project Timeline | Timeline / Gantt-style tasks |
| `vendors` | Vendor Management | Vendors and contacts |
| `equipment-menu` | Equipment & Menu | Equipment planning & menu builder |
| `branding` | Branding Planner | Brand identity & materials |
| `compliance` | Compliance | Documents, licenses, certifications |
| `documents` | Documents | Onboarding doc workflow |
| `reports` | Reports | P&L, variance, progress |
| `ledger` | Ledger | Expenses & invoices |
| `sops` | SOPs | Standard operating procedures |
| `import` | Import Document | Upload & extract data |
| `business-analytics` | Business Analytics | Analytics (premium / gated) |

### Additional app areas (not in sidebar tabs)

| Area | Where | Description |
|------|--------|-------------|
| Pricing | Header / `activeTab: 'pricing'` | Plans and “Start trial” / checkout |
| Subscription | Profile or `activeTab: 'subscription'` | Manage subscription, portal |
| Admin | `activeTab: 'admin'` | Admin dashboard (if enabled) |
| Draft manager | Header | Switch/create/duplicate drafts, concepts, compare |
| Project setup | First project or “New” / “New draft” | Intent + name + feature selection |
| AI assistant | Floating button (spatula) | In-context AI help |
| Guide assistant | Floating button | Step-by-step guide |
| Welcome tour | First login | Onboarding tour |
| Trial expiration banner | Top of dashboard | Upgrade CTA when trial ending |
| Feedback | Floating button | Share feedback modal |
| Invitations | Header (when pending) | Accept project invitations |
| Share project | Draft manager | Share project with others |

---

## 4. User workflows

### A. Anonymous → Assessment → Signup → Trial (app)

1. User lands on **iterumfoods.xyz** or **restaurant-startup-app.web.app/assessment**.
2. Completes **Free Restaurant Assessment** (no account).
3. Clicks “Sign up free to save & continue” → **signup** (terms → auth).
4. After signup, lands on **Project setup** (intent + name + features), then **Dashboard** with **trial** (full access).
5. Trial ending → **TrialExpirationBanner**; user can go to **Pricing** → **Checkout** (Stripe) → **Paid subscription** (if functions are deployed).

### B. Direct trial (no assessment)

1. User lands on **iterumfoods.xyz** or **/landing** → “Start free trial.”
2. **Terms** → **Sign up** → **Project setup** → **Dashboard** (trial).
3. Same as A from step 4.

### C. Consulting (no app)

1. User lands on **iterumfoods.com** or follows “Work with us” from .xyz/app.
2. Chooses a package → **Book a call** / contact form.
3. Lead captured; follow up offline.

### D. App user → Consulting

1. User is in app (trial or paid).
2. Clicks “Want hands-on help?” / “Book a strategy call” (consulting bridge).
3. Linked to **iterumfoods.com** (or Calendly) → same as C.

### E. Consulting client → App

1. Recommend the app during or after an engagement.
2. Client signs up at **restaurant-startup-app.web.app** or **iterumfoods.xyz** → same as A or B.

---

## 5. Where this is implemented

| Item | Location |
|------|----------|
| Routes | `src/App.js` |
| Project setup modal | `src/components/layout/ProjectSetupModal.js` |
| Feature presets | `src/config/featurePresets.js` |
| Dashboard tabs config | `src/components/layout/TabNavigation.js` (`DETAIL_VIEW_TABS`), filtering by `enabledFeatures` |
| Dashboard content | `src/pages/Dashboard.js` (`renderActiveTab`, no-drafts → project setup) |
| Overview (filtered sections) | `src/components/dashboard/DashboardOverview.js` |
| Human sitemap page | `src/pages/SitemapPage.js` |
| SEO sitemap (URL list) | `public/sitemap.xml` |
| Funnel stages | `MARKETING_FUNNEL_MAP.md`, `src/services/analytics.js` (FUNNEL_STAGES, FUNNEL_MAP) |
| Draft shape (projectIntent, enabledFeatures) | `src/contexts/AppContext.js` (createNewDraft, CREATE_DRAFT, createDraft) |

---

## 6. Quick reference

- **Public (no login):** `/assessment`, `/landing`, `/restaurant-startup-app`, `/investors`, `/terms`, `/privacy`, `/tech`, `/faq`, `/sitemap`
- **App (login required):** `/`, `/dashboard` (sidebar tabs + pricing, subscription, admin, draft manager, project setup, AI, guide, feedback, invitations)
- **Consulting:** iterumfoods.com (outside this app)
- **Workflow:** Assessment → Signup → Project setup → Trial → Paid (app); or any path → iterumfoods.com (consulting)
