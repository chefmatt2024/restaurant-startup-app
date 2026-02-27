# Restauranteur — Restaurant Business Planning App

A comprehensive business planning application for restaurant entrepreneurs, with local market insights, equipment planning, financial projections, regulatory guidance, and optional AI assistance. Built for Boston and adaptable to other markets.

## Live app

**Production:** [restaurant-startup-app.web.app](https://restaurant-startup-app.web.app)

**Full feature and route map:** See [APP_AND_SITE_MAP.md](APP_AND_SITE_MAP.md) for routes, dashboard tabs, project setup, and user workflows.

---

## Features

### Project setup (first project / new project)

- **Project intent** — Opening a new restaurant, potentially buying an existing one, or helping an existing restaurant.
- **Project name** — Optional; e.g. “My First Restaurant Plan”.
- **Feature selection** — Choose how much of the app to use:
  - **Just the basics** — Opening plan, concept, financials, compliance.
  - **Full planning** — All plan-building sections (no reports/ledger/analytics).
  - **Everything** — All features.
  - **Choose specific areas** — Custom checklist of sections.

Smaller or “just getting started” projects can limit visible sections to reduce overwhelm.

### Planning (dashboard sections)

- **Startup & Opening Plan** — Phase-based roadmap, task tracking, local requirements.
- **Process map** — Start-to-opening journey view.
- **Concept & Pitch** — Idea formation, elevator pitch, executive summary.
- **Market & Competition** — Market and competitive analysis (with optional AI research).
- **Offer & Marketing** — Products, services, marketing strategy.
- **Financial Projections** — P&L, revenue/cost modeling, projections.
- **Team & Cap Table** — Staffing, management team, cap table.
- **Operations** — Operations plan.
- **Project Timeline** — Timeline / Gantt-style tasks.
- **Vendor Management** — Vendors and contacts.
- **Equipment & Menu** — Equipment planning and menu builder.
- **Branding Planner** — Brand identity and materials.
- **Compliance** — Documents, licenses, certifications (including Boston-specific).
- **Documents** — Onboarding document workflow.
- **Reports** — P&L, variance, progress.
- **Ledger** — Expenses and invoices.
- **SOPs** — Standard operating procedures.
- **Import Document** — Upload and extract data.
- **Business Analytics** — Analytics (premium / gated).

Sections shown in the app depend on the project’s **enabled features** (see [APP_AND_SITE_MAP.md](APP_AND_SITE_MAP.md)).

### AI assistance (optional)

- Auto-fill forms, market research, financial advice, content generation, Q&A.
- Requires API key (OpenAI or Anthropic). See `AI_SETUP_GUIDE.md` if present.

### User & account

- **Authentication** — Email/password and Google sign-in (required to use the app).
- **Multi-draft support** — Create, switch, duplicate, and compare business plan drafts.
- **Concepts** — Group drafts by concept (e.g. “North End Italian”).
- **Sharing & invitations** — Share projects and accept invitations.
- **Trial & subscription** — Free trial; upgrade via Stripe (when backend is configured).
- **Profile** — User profile and subscription management.

### Other app areas

- **Pricing** — Plans and “Start trial” / checkout.
- **Subscription** — Manage subscription and portal.
- **Admin** — Admin dashboard (when enabled).
- **Floating tools** — AI assistant, step-by-step guide, feedback button.
- **Welcome tour** — First-login onboarding.
- **Trial expiration banner** — Upgrade CTA when trial is ending.

### Public pages (no login)

- **Free Restaurant Assessment** — One-visit checklist; results can be saved after signup.
- **Landing** — Product landing and trial CTA.
- **Investors** — Investor pitch and information.
- **Terms, Privacy, Tech, FAQ, Sitemap** — Legal, tech, and navigation.

---

## Technology stack

- **Frontend:** React 18, JavaScript ES6+
- **Styling:** Tailwind CSS, custom CSS (`App.css`)
- **Icons:** Lucide React
- **Backend:** Firebase (Authentication, Firestore, Hosting)
- **State:** React Context API (`AppContext`)
- **Payments:** Stripe (optional; requires backend for full flow)
- **AI:** Optional OpenAI or Anthropic (env config)
- **Build:** Create React App (react-scripts)

---

## Quick start

### Prerequisites

- Node.js 16+
- npm or yarn
- Firebase account

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/chefmatt2024/restaurant-startup-app.git
   cd restaurant-startup-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Firebase**
   - Create a project at [console.firebase.google.com](https://console.firebase.google.com)
   - Enable Authentication (Email/Password and Google)
   - Enable Firestore
   - Copy your Firebase config into `.env.local`

4. **Configure environment**
   ```bash
   cp env.example .env.local
   ```
   Edit `.env.local` with Firebase (and optionally Stripe, AI keys). See `env.example` for variables.

5. **Start development server**
   ```bash
   npm start
   ```
   Open [http://localhost:3000](http://localhost:3000).

---

## Usage

1. **Sign up** — Create an account (email/password or Google).
2. **Set up first project** — Choose intent (opening new / buying / helping existing), optional name, and which features to use.
3. **Use the dashboard** — Overview and section tabs show only your chosen features.
4. **Create more drafts** — Header or Draft Manager → “New” opens project setup again for another project.
5. **Save & share** — Data syncs to Firestore; use sharing and invitations as needed.

---

## Firebase setup

- **Authentication:** Enable Email/Password and Google; add `localhost` to authorized domains.
- **Firestore:** Create database; use project’s security rules for user data.
- **Hosting (optional):** `firebase init hosting` then `firebase deploy`.

---

## Project structure

```
src/
├── components/
│   ├── admin/          # Admin dashboard, user/lead/email management
│   ├── ai/             # AI assistant, research panel, mascot
│   ├── auth/           # Sign-in, signup, profile, trial, protected route
│   ├── business-plan/  # Market, offer, operations, team, exec summary
│   ├── compliance/     # Compliance hub, documents, permitting, certifications
│   ├── dashboard/     # Dashboard overview
│   ├── equipment/     # Equipment & menu
│   ├── feedback/      # Feedback collector
│   ├── financial/     # Projections, P&L, cap table, importers
│   ├── ideation/      # Concept, pitch, idea formation
│   ├── import/        # Document importer
│   ├── landing/       # Landings (investor, branded, etc.)
│   ├── layout/        # Header, footer, tabs, draft manager, project setup modal
│   ├── ledger/        # Ledger view
│   ├── menu/          # Menu builder
│   ├── onboarding/    # Welcome tour, guide, documents workflow, checklists
│   ├── payment/       # Pricing, subscription, feature gate
│   ├── process/       # Process map view
│   ├── reports/       # Reports view
│   ├── sharing/       # Share project, invitations
│   ├── sops/          # SOP manager
│   ├── startup/       # Opening plan, startup & opening plan
│   ├── trial/         # Trial banner, onboarding
│   ├── ui/            # FormField, SectionCard, modals, loading
│   ├── unified/       # Unified landing, sales funnel
│   └── vendors/       # Vendor management
├── config/            # Feature presets, AI context, area content, process map
├── contexts/          # AppContext (state, drafts, auth)
├── hooks/             # useTrialLimitations, useSubscription
├── pages/             # Dashboard, assessment, terms, privacy, tech, FAQ, sitemap
├── services/          # Firebase, Stripe, analytics, AI, sharing
└── utils/             # Section status, templates, UTM, access control
```

---

## Documentation

- **[APP_AND_SITE_MAP.md](APP_AND_SITE_MAP.md)** — Routes, dashboard tabs, project setup, workflows, implementation references.
- **env.example** — Environment variables (Firebase, Stripe, AI, etc.).
- **AI_SETUP_GUIDE.md** — If present, AI integration setup.

---

## License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---

**Built for restaurant entrepreneurs**
