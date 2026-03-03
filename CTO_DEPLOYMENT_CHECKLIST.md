# CTO Deployment Checklist — Get Restauranteur Fully Operational

Reference for ensuring the app, Stripe, Firebase Functions, and integrations are correctly configured.

---

## 1. Environment variables

### Client (`.env.local`)

| Variable | Required | Notes |
|----------|----------|-------|
| `REACT_APP_FIREBASE_API_KEY` | Yes | From Firebase Console → Project Settings |
| `REACT_APP_FIREBASE_AUTH_DOMAIN` | Yes | `*.firebaseapp.com` |
| `REACT_APP_FIREBASE_PROJECT_ID` | Yes | e.g. `restaurant-startup-app` |
| `REACT_APP_FIREBASE_STORAGE_BUCKET` | Yes | e.g. `*.appspot.com` |
| `REACT_APP_FIREBASE_MESSAGING_SENDER_ID` | Yes | Firebase config |
| `REACT_APP_FIREBASE_APP_ID` | Yes | Firebase config |
| `REACT_APP_STRIPE_PUBLISHABLE_KEY` | Yes for payments | `pk_test_...` or `pk_live_...` |
| `REACT_APP_OPENAI_API_KEY` or `REACT_APP_ANTHROPIC_API_KEY` | Optional | For AI features |
| `REACT_APP_ID` | Optional | Defaults to `restaurant-planner` (must match functions) |

### Firebase Functions (Firebase config)

```bash
firebase functions:config:set stripe.secret_key="sk_test_xxx"
firebase functions:config:set stripe.webhook_secret="whsec_xxx"
firebase functions:config:set openai.api_key="sk-xxx"   # Optional for AI
```

Or use Cloud Secret Manager / `.env` in production.

---

## 2. App ID consistency

All services must use the same app ID: **`restaurant-planner`**.

- **firebase.js:** `getAppId()` → `restaurant-planner` (or `REACT_APP_ID`)
- **sharingService.js:** imports `getAppId` from firebase
- **functions:** hardcoded `restaurant-planner` in Stripe handlers and `captureWaitlistLead`

If you change it, update all three.

---

## 3. Stripe setup

1. **Create products and prices** in Stripe Dashboard (Professional $29, Business $99, Enterprise $299).
2. **Update price IDs** in `src/services/stripe.js` if your Stripe Price IDs differ.
3. **Webhook endpoint:** Add `https://us-central1-restaurant-startup-app.cloudfunctions.net/stripeWebhook` (or your region) in Stripe → Developers → Webhooks.
4. **Webhook events:** `checkout.session.completed`, `customer.subscription.created`, `customer.subscription.updated`, `customer.subscription.deleted`, `invoice.payment_succeeded`, `invoice.payment_failed`.
5. **Deploy functions:** `cd functions && npm run deploy` (or `firebase deploy --only functions`).

---

## 4. Firebase setup

1. **Authentication:** Enable Email/Password and Google; add `localhost` and your domains to authorized domains.
2. **Firestore:** Database created; deploy rules: `firebase deploy --only firestore:rules`.
3. **Functions:** Deploy with Stripe config: `firebase deploy --only functions`.
4. **Hosting:** `npm run build && firebase deploy --only hosting:app`.

---

## 5. Data flow (subscription)

1. User signs in → `ensureUserProfile` creates/ensures Firestore doc at `artifacts/restaurant-planner/users/{userId}`.
2. User clicks "Subscribe" → `createCheckoutSession` (Cloud Function) creates Stripe Checkout.
3. User completes Stripe checkout → webhook `checkout.session.completed` writes `stripeCustomerId` to user doc.
4. Webhook `customer.subscription.updated` writes `subscription` (plan, status, currentPeriodEnd) to user doc.
5. Client subscribes to user profile via `subscribeToUserProfile` → UI updates in real time.

---

## 6. Quick verification

- [ ] `npm run build` succeeds
- [ ] `npm start` runs locally; sign up / sign in works
- [ ] Assessment → signup → project setup → dashboard flow works
- [ ] Pricing page loads; "Start trial" / Subscribe opens Stripe (or shows friendly error if functions not deployed)
- [ ] Consulting CTAs link to Calendly: `https://calendly.com/matt-iterumfoods?utm_source=...`

---

## 7. Known issues / fixes applied (this session)

- **appId mismatch:** Unified to `restaurant-planner` across firebase.js, sharingService, and functions.
- **Subscription not loading:** Added `ensureUserProfile`, `getUserProfile`, `subscribeToUserProfile`; AppContext loads and listens to user profile on auth.
- **Stripe webhook on missing user doc:** Changed to `setDoc(..., { merge: true })` in `handleCheckoutSessionCompleted`.
- **Firestore rules:** Added read rule for `artifacts/{appId}/waitlist_leads` (admin only).
