# Stripe Setup Guide — Restauranteur App

Step-by-step instructions to get Stripe subscriptions working in your app.

---

## Prerequisites

- Stripe account ([dashboard.stripe.com](https://dashboard.stripe.com))
- Firebase project with Blaze plan (required for Cloud Functions)
- Project deployed or running locally

---

## Step 1: Get your Stripe API keys

1. Go to [Stripe Dashboard → Developers → API keys](https://dashboard.stripe.com/apikeys)
2. Toggle **Test mode** (top right) for development
3. Copy:
   - **Publishable key** — starts with `pk_test_`
   - **Secret key** — starts with `sk_test_` (click Reveal to see it)

---

## Step 2: Create subscription products in Stripe

1. Go to [Stripe Dashboard → Products](https://dashboard.stripe.com/products)
2. Create three products with recurring prices:

| Product       | Price  | Billing        | Price ID (copy after creation) |
|---------------|--------|----------------|--------------------------------|
| Professional  | $29/mo | Recurring      | `price_xxx`                    |
| Business      | $99/mo | Recurring      | `price_xxx`                    |
| Enterprise    | $299/mo| Recurring      | `price_xxx`                    |

3. For each product: **Add price** → **Recurring** → **Monthly** → Save
4. Copy each Price ID (e.g. `price_1ABC...`)

### Update Price IDs in the app

If your Price IDs differ from the ones in the code, edit `src/services/stripe.js`:

```javascript
professional: {
  id: 'price_1SlP8QAIIysA2GUVhIo473BK',  // ← Replace
  ...
},
business: {
  id: 'price_1SlP8tAIIysA2GUVcLTteVlF',      // ← Replace
  ...
},
enterprise: {
  id: 'price_1SlP9SAIIysA2GUVDoMrA8cC',   // ← Replace
  ...
}
```

---

## Step 3: Configure the client (`.env.local`)

1. Create or edit `.env.local` in the project root
2. Add:

```bash
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_PUBLISHABLE_KEY_HERE
```

3. Restart the dev server: `npm start`

---

## Step 4: Configure Firebase Functions

From the project root, run:

```bash
# Set Stripe secret key (use your sk_test_... key)
firebase functions:config:set stripe.secret_key="sk_test_YOUR_SECRET_KEY_HERE"

# Verify it was set
firebase functions:config:get
```

**Important:** Do not commit the secret key to git. It lives in Firebase config only.

---

## Step 5: Deploy Firebase Functions (first deploy)

Deploy functions **before** creating the webhook so you have a URL:

```bash
cd "c:\Iterum Innovation\App-starting a business"
firebase deploy --only functions
```

After deploy, note the function URL, e.g.:
```
https://us-central1-restaurant-startup-app.cloudfunctions.net/createCheckoutSession
https://us-central1-restaurant-startup-app.cloudfunctions.net/stripeWebhook
```

Use your project ID and region from the output. The webhook URL will be:
```
https://<region>-<project-id>.cloudfunctions.net/stripeWebhook
```

---

## Step 6: Create Stripe webhook

1. Go to [Stripe Dashboard → Developers → Webhooks](https://dashboard.stripe.com/webhooks)
2. Click **Add endpoint**
3. **Endpoint URL:** `https://us-central1-restaurant-startup-app.cloudfunctions.net/stripeWebhook`
   - Replace `restaurant-startup-app` with your Firebase project ID if different
   - Replace `us-central1` with your region if you deployed elsewhere
4. Click **Select events** and add:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
5. Click **Add endpoint**
6. Click **Reveal** under Signing secret and copy it (starts with `whsec_`)

---

## Step 7: Set webhook secret in Firebase

```bash
firebase functions:config:set stripe.webhook_secret=whsec_rCyWj5NTIj6SLQb3mvSHUrY4VXxkqiaY
```

---

## Step 8: Redeploy functions

Config changes require a redeploy:

```bash
firebase deploy --only functions
```

---

## Step 9: Test the flow

1. **Start the app:** `npm start`
2. **Sign in** with a test account
3. Go to **Pricing** (from header or dashboard)
4. Click **Subscribe** on any plan
5. You should be redirected to Stripe Checkout
6. Use test card: `4242 4242 4242 4242`
   - Expiry: any future date
   - CVC: any 3 digits
   - ZIP: any 5 digits
7. Complete checkout → you should return to the dashboard
8. Your subscription should appear (may take a few seconds via webhook)

---

## Step 5b: If deploy fails with "Access to bucket denied"

See **[FIREBASE_DEPLOY_FIX.md](FIREBASE_DEPLOY_FIX.md)** — add Storage Object Viewer for the Cloud Functions service account, then retry the deploy.

---

## Troubleshooting

| Problem | Solution |
|--------|----------|
| "Payment processing is currently unavailable" | Functions not deployed or Stripe secret key not set |
| Checkout opens but webhook fails | Webhook secret not set, or wrong webhook URL |
| "No Signatures Found Matching" | Webhook needs raw body — ensure you're on the latest `functions/index.js` |
| Subscription doesn't show after checkout | Check webhook in Stripe Dashboard → Webhooks → [your endpoint] → Latest deliveries |
| Price ID invalid | Ensure Price IDs in `stripe.js` match your Stripe products exactly |

---

## Production checklist

When going live:

1. Switch Stripe to **Live mode**
2. Create live products/prices in Stripe
3. Update `REACT_APP_STRIPE_PUBLISHABLE_KEY` to `pk_live_...`
4. Set `stripe.secret_key` to `sk_live_...`
5. Create a new webhook endpoint for production URL
6. Set `stripe.webhook_secret` to the live webhook signing secret
7. Redeploy functions

---

## Quick reference

| Item | Location |
|------|----------|
| Publishable key | `.env.local` → `REACT_APP_STRIPE_PUBLISHABLE_KEY` |
| Secret key | Firebase config → `stripe.secret_key` |
| Webhook secret | Firebase config → `stripe.webhook_secret` |
| Price IDs | `src/services/stripe.js` |
| Checkout function | `functions/index.js` → `createCheckoutSession` |
| Webhook handler | `functions/index.js` → `stripeWebhook` |
