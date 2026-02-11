# App & GitHub Assessment

**Date:** February 11, 2025  
**Repo:** [github.com/chefmatt2024/restaurant-startup-app](https://github.com/chefmatt2024/restaurant-startup-app)  
**Local branch:** `main` (tracking `origin/main`)

---

## 1. App overview

| Item | Details |
|------|---------|
| **Name** | Boston Restaurant Business Planner (`boston-restaurant-business-planner` in package.json) |
| **Live app** | https://restaurant-startup-app.web.app |
| **Landing / brand** | iterumfoods.xyz/restauranteur-app, iterumfoods.com |
| **Stack** | React 18, Firebase (Auth, Firestore, Hosting), Stripe, Tailwind, Lucide, react-router-dom |
| **AI** | OpenAI / Anthropic via `aiService.js` and AIAssistant / AIResearchPanel |
| **Build** | Create React App (`react-scripts`), Node 18 in CI |

### Feature areas (from codebase)

- **Auth:** Sign-in modal, trial onboarding/signup, user profile, protected routes, admin emails (e.g. matt@iterumfoods.com).
- **Business planning:** Idea formation, market analysis, competitive analysis, executive summary, management team, operations, marketing, service description.
- **Compliance:** Documents, certifications, open restaurant, permitting wizard, yearly license checklist, health inspection, document vault.
- **Financial:** Projections, P&amp;L importer, Excel importer, menu revenue, scenarios, monthly statement.
- **Other:** Branding planner, menu builder, vendors, dashboard, draft manager, payment/subscription/trial, landing (Iterum branded, investor), FAQ/Terms/Privacy/Tech/Sitemap pages, analytics, feedback.

---

## 2. GitHub cross-reference

### Repo and branch

- **Remote:** `origin` → `https://github.com/chefmatt2024/restaurant-startup-app.git`
- **Default branch:** `main` (remotes/origin/HEAD → origin/main)
- **Last commit on origin (and local):** `c4875fa` — *Fix Firebase workflow - remove invalid secrets check in if condition*
- **Sync:** Local `HEAD` = `origin/main` (no unpushed or unpulled commits)

### Working tree vs GitHub

What is **on GitHub** is the last committed state. What you run and deploy locally includes many **uncommitted** changes.

- **Modified (tracked) files:** 44 files changed but not committed, including:
  - Config: `.eslintrc.json`, `.github/workflows/deploy.yml`, `env.example`, `firebase.json`, `firestore.rules`, `package.json`, `package-lock.json`
  - App entry: `public/index.html`, `src/App.css`, `src/App.js`, `src/index.js`
  - Many components under `src/components/` (auth, branding, business-plan, compliance, dashboard, financial, import, landing, layout, menu, payment, startup, ui, unified, vendors)
  - Context: `src/contexts/AppContext.js`
  - Pages: `src/pages/Dashboard.js`
  - Services: `src/services/aiService.js`, `src/services/analytics.js`, `src/services/firebase.js`, `src/services/stripe.js`
  - Docs: `NEXT_STEPS_ACTION_PLAN.md`
- **Untracked files:** 70+ items, including:
  - Many `.md` guides (e.g. deployment, launch, analytics, Stripe, branding, testing)
  - `functions/` (Firebase Cloud Functions)
  - New components: e.g. `EnhancedAuthModal.js`, `ImprovedAuthFlow.js`, `ProtectedRoute.js`, `UnifiedAuthFlow.js`, compliance (CertificationManager, DocumentVault, OpenRestaurantManager, PermittingWizard, YearlyLicenseChecklist), financial (ExcelFinancialImporter, MonthlyStatement, ScenarioManager), `InvestorLanding.js`, `Footer.js`, onboarding/, trial/
  - New pages: `FAQPage.js`, `PrivacyPage.js`, `SitemapPage.js`, `TechPage.js`, `TermsPage.js`
  - New utils: `sampleRestaurantData.js`, `utmTracking.js`
  - `public/` assets: app-screenshot, favicon, food photos, founder/team photos, logo, manifest, og-image, robots.txt, sitemap.xml
  - PDFs and images (e.g. Food Establishment permit, Restauranteur System Logo)

**Implication:** The app you run and deploy locally is **ahead** of what GitHub shows. Anyone cloning from GitHub would not get the current app behavior, new features, or docs without your local changes.

---

## 3. Documentation and repo consistency

- **README clone URL:** Still says `git clone https://github.com/yourusername/restaurant-startup-app.git`. Should be `https://github.com/chefmatt2024/restaurant-startup-app.git`.
- **README “Live Demo”:** Says “Coming Soon!” but the app is live at https://restaurant-startup-app.web.app.
- **README anonymous access:** Lists “anonymous access” under User Management; your docs (e.g. AUTHENTICATION_REQUIRED.md) indicate auth is required—worth aligning README with current behavior.

---

## 4. CI/CD and deployment

### GitHub Actions

- **`.github/workflows/deploy.yml`**  
  - Triggers: push and pull_request on `main`.  
  - Runs: checkout → Node 18 → `npm ci` → `CI=false npm run build`.  
  - Uses repo secrets for Firebase env and AI keys.  
  - Uploads `build/` as an artifact (no deploy step in this workflow).

- **`.github/workflows/firebase-deploy.yml`**  
  - Trigger: `workflow_dispatch` only (manual).  
  - Builds then deploys to Firebase Hosting via `FirebaseExtended/action-hosting-deploy@v0`.  
  - Uses `FIREBASE_SERVICE_ACCOUNT` and `GITHUB_TOKEN`; `projectId: restaurant-startup-app`.

### firebase.json and CI

- **Hosting targets:**
  1. **`app`** – `public: "build"` (this repo’s build). Fine for CI.
  2. **`landing`** – `public: "C:/Iterum Innovation/landing-pages/main-landing"` (absolute Windows path).

- **Issue:** On GitHub Actions (Linux), the path `C:/Iterum Innovation/landing-pages/main-landing` does not exist. Any workflow that runs `firebase deploy` without `--only hosting:app` could fail or behave inconsistently. Your `deploy.yml` only builds and does not deploy; `firebase-deploy.yml` would need to use `--only hosting:app` (or a similar restriction) unless the landing content is in the repo or on the runner.

### Env and secrets

- **env.example** documents: Firebase, optional Analytics, AI (OpenAI/Anthropic), Stripe.  
- **Deploy workflow** expects: `REACT_APP_FIREBASE_*`, `REACT_APP_OPENAI_API_KEY`, `REACT_APP_ANTHROPIC_API_KEY`, `REACT_APP_AI_PROVIDER`, and optionally `REACT_APP_FIREBASE_MEASUREMENT_ID`.  
- **Stripe:** App uses Stripe; `env.example` has `REACT_APP_STRIPE_PUBLISHABLE_KEY`. If build or runtime needs it, add to `env.example` and to workflow env if you build with Stripe in CI.

---

## 5. Summary table

| Area | Status | Notes |
|------|--------|--------|
| **App vs README** | ⚠️ Out of sync | Clone URL, live demo text, auth description |
| **Local vs GitHub** | ⚠️ Large drift | 44 modified, 70+ untracked; GitHub does not reflect current app |
| **Branch sync** | ✅ In sync | main = origin/main at c4875fa |
| **CI build** | ✅ Configured | deploy.yml builds on push/PR to main |
| **Firebase deploy** | ⚠️ Config risk | firebase.json landing path is Windows-only; use `--only hosting:app` in CI or fix path |
| **Secrets** | ✅ Documented in workflow | Firebase + AI keys; ensure Stripe in env if needed for build |

---

## 6. Recommended actions

1. **Commit and push your work**
   - Commit the 44 modified files (and any intentional untracked code) so GitHub reflects the app you run and deploy.
   - Add and commit `functions/` if those Cloud Functions are part of the product.
   - Consider adding a `.gitignore` for local-only or sensitive files (e.g. some PDFs/images) and committing the rest of the new assets and docs you want in the repo.

2. **Update README**
   - Set clone URL to `https://github.com/chefmatt2024/restaurant-startup-app.git`.
   - Update “Live Demo” to https://restaurant-startup-app.web.app (and remove “Coming Soon!” if appropriate).
   - Align “User Management” with current auth (e.g. remove “anonymous access” if no longer supported).

3. **Keep CI safe**
   - In `firebase-deploy.yml`, deploy only the app host for this repo, e.g.  
     `firebase deploy --only hosting:app`  
     (or equivalent in the action config) so the Windows `landing` path is never used in CI.
   - Or move landing content into the repo and use a relative path so both app and landing deploy from GitHub.

4. **Optional**
   - Add a short “Deployment” or “Scripts” section in README pointing to `npm run deploy:firebase` and that Firebase deploy is manual via the `firebase-deploy.yml` workflow.
   - If you use Stripe in the build (e.g. for env-driven config), add `REACT_APP_STRIPE_PUBLISHABLE_KEY` to the deploy workflow secrets and document in env.example.

---

**Bottom line:** The app is feature-rich and aligned with Firebase/Stripe and your docs. The main gap is that **GitHub does not yet contain your current code and assets**. Bringing the repo up to date with commits and small README/CI tweaks will make the app and GitHub match and keep deployments and collaboration consistent.
