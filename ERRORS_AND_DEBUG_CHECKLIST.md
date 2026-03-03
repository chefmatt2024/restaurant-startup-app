# Errors to Fix & Things to Debug

A running checklist for build, deploy, and runtime issues.

---

## 🔴 Blocking (must fix to deploy)

### 1. Cloud Build still failing

**Symptom:** `Build failed: Build error details not available` for all 5 functions.

**Done:**
- [x] Storage Object Viewer → `712703384904-compute@developer.gserviceaccount.com`
- [x] Artifact Registry Writer → `712703384904@cloudbuild.gserviceaccount.com`

**To debug:**
1. Open [Cloud Build builds](https://console.cloud.google.com/cloud-build/builds?project=712703384904)
2. Click a failed build → view full logs
3. Note the **exact error** (permission denied, npm install failure, OOM, etc.)

**Possible fixes (depending on logs):**
- [ ] Add **Storage Object Viewer** to `712703384904@cloudbuild.gserviceaccount.com` (if it pulls from storage)
- [ ] Add **Logs Writer** to Cloud Build service account (for logging)
- [ ] Enable **Cloud Build API** for the project
- [ ] Wait 5–10 min for IAM propagation, then retry deploy

---

## 🟠 Deploy warnings (non-blocking but should address)

### 2. ESLint console statements

**Location:** `functions/index.js` — 18 `no-console` warnings

Replace `console.log` / `console.error` with Firebase `logger` or remove debug logs. Does not block deploy.

### 3. Node.js 20 deprecation

**Timeline:** Deprecated 2026-04-30, decommissioned 2026-10-30

**Fix:** Upgrade to Node 22 in `functions/package.json` → `"engines": { "node": "22" }` and update `firebase.json` if needed.

### 4. firebase-functions outdated

**Current:** 4.9.0  
**Required for extensions:** ≥ 5.1.0

```bash
cd functions
npm install --save firebase-functions@latest
```

**Note:** May introduce breaking changes; test locally after upgrade.

### 5. functions.config() deprecated

**Deadline:** March 2026 — Cloud Runtime Config shutdown.

**Action:** Migrate to `params` package before then:
- [Stripe config migration](https://firebase.google.com/docs/functions/config-env#migrate-config)
- Try: `firebase functions:config:export` for interactive migration

---

## 🟡 Stripe setup (after deploy works)

### 6. Stripe secret key

```bash
firebase functions:config:set stripe.secret_key="sk_test_YOUR_KEY"
```

### 7. Stripe webhook

- Create endpoint: `https://us-central1-restaurant-startup-app.cloudfunctions.net/stripeWebhook`
- Add events: checkout.session.completed, customer.subscription.*, invoice.*
- Copy signing secret (`whsec_...`)

### 8. Stripe webhook secret

```bash
firebase functions:config:set stripe.webhook_secret="whsec_..."
firebase deploy --only functions
```

### 9. Price IDs

Verify `src/services/stripe.js` Price IDs match your Stripe Dashboard products.

---

## 📋 Quick commands

```powershell
# Deploy functions
firebase deploy --only functions

# Check Firebase config
firebase functions:config:get

# Export config (for migration)
firebase functions:config:export
```

---

## References

| Doc | Purpose |
|-----|---------|
| [FIREBASE_DEPLOY_FIX.md](FIREBASE_DEPLOY_FIX.md) | Storage + Artifact Registry permissions |
| [STRIPE_SETUP.md](STRIPE_SETUP.md) | Full Stripe configuration guide |
