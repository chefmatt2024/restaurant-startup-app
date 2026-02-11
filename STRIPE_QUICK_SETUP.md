# 🚀 Stripe Payment Setup - Quick Start Guide

## Overview
This guide will help you set up Stripe payments for your Restaurant Business Planner app in about 30 minutes.

---

## Step 1: Create Stripe Account (5 minutes)

1. Go to [https://stripe.com](https://stripe.com)
2. Click "Sign up" and create a free account
3. Complete business verification (can use test mode for now)
4. You'll start in **Test Mode** (safe for testing)

---

## Step 2: Get Your Stripe API Keys (2 minutes)

1. In Stripe Dashboard, go to **Developers → API Keys**
2. Copy your **Publishable key** (starts with `pk_test_...`)
3. Copy your **Secret key** (starts with `sk_test_...`) - Keep this secret!

**⚠️ Important:** 
- Use `pk_test_...` and `sk_test_...` for testing
- Use `pk_live_...` and `sk_live_...` for production (after testing)

---

## Step 3: Create Products in Stripe Dashboard (5 minutes)

### Create 3 Products:

1. **Professional Plan - $29/month**
   - Go to **Products → Add Product**
   - Name: `Professional Plan`
   - Description: `Full restaurant planning features`
   - Pricing: `$29.00 USD` / `Monthly`
   - Click **Save**
   - **Copy the Price ID** (starts with `price_...`) - You'll need this!

2. **Business Plan - $99/month**
   - Name: `Business Plan`
   - Description: `Team collaboration features`
   - Pricing: `$99.00 USD` / `Monthly`
   - **Copy the Price ID**

3. **Enterprise Plan - $299/month**
   - Name: `Enterprise Plan`
   - Description: `Advanced features with API access`
   - Pricing: `$299.00 USD` / `Monthly`
   - **Copy the Price ID**

**Note:** The Price IDs will look like: `price_1ABC123xyz...`

---

## Step 4: Set Up Environment Variables (3 minutes)

1. Create a file named `.env.local` in your project root (if it doesn't exist)
2. Add your Stripe Publishable Key:

```bash
# Stripe Configuration
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here
```

**Example:**
```bash
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_51ABC123xyz...
```

3. Save the file

---

## Step 5: Initialize Firebase Functions (5 minutes)

Open your terminal in the project root and run:

```bash
# Install Firebase CLI globally (if not already installed)
npm install -g firebase-tools

# Login to Firebase (if not already logged in)
firebase login

# Initialize Functions
firebase init functions
```

**When prompted:**
- Select **JavaScript** (not TypeScript)
- Say **Yes** to ESLint
- Say **Yes** to install dependencies
- Don't overwrite existing files

---

## Step 6: Install Stripe in Functions (1 minute)

```bash
cd functions
npm install stripe
cd ..
```

---

## Step 7: Set Stripe Secret Key in Firebase (2 minutes)

```bash
# Set your Stripe secret key (use the sk_test_... key from Step 2)
firebase functions:config:set stripe.secret_key="sk_test_your_secret_key_here"
```

**Example:**
```bash
firebase functions:config:set stripe.secret_key="sk_test_51ABC123xyz..."
```

---

## Step 8: Deploy Functions (3 minutes)

The functions code has been created in `functions/index.js`. Now deploy:

```bash
firebase deploy --only functions
```

This will take a few minutes. Wait for it to complete.

---

## Step 9: Update Price IDs in Code (2 minutes)

1. Open `src/services/stripe.js`
2. Find the `SUBSCRIPTION_PLANS` object
3. Replace the `id` values with your actual Stripe Price IDs:

```javascript
professional: {
  id: 'price_1ABC123xyz...', // Replace with your Professional Plan Price ID
  // ...
},
business: {
  id: 'price_1DEF456abc...', // Replace with your Business Plan Price ID
  // ...
},
enterprise: {
  id: 'price_1GHI789def...', // Replace with your Enterprise Plan Price ID
  // ...
}
```

---

## Step 10: Test the Integration (5 minutes)

1. **Start your app:**
   ```bash
   npm start
   ```

2. **Test checkout:**
   - Sign in to your app
   - Go to Profile → Pricing
   - Click "Subscribe" on any plan
   - Use Stripe test card: `4242 4242 4242 4242`
   - Use any future expiry date (e.g., `12/25`)
   - Use any 3-digit CVC (e.g., `123`)
   - Use any ZIP code (e.g., `12345`)

3. **Verify:**
   - Checkout should redirect to Stripe
   - After payment, you should be redirected back
   - Check Stripe Dashboard → Payments to see the test payment

---

## Step 11: Set Up Webhooks (Optional - for production)

Webhooks handle subscription updates automatically. Set this up after testing:

1. In Stripe Dashboard → **Developers → Webhooks**
2. Click **Add endpoint**
3. Endpoint URL: `https://YOUR-PROJECT-ID.cloudfunctions.net/stripeWebhook`
   - Replace `YOUR-PROJECT-ID` with your Firebase project ID
4. Select events to listen to:
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
5. Click **Add endpoint**
6. Copy the **Signing secret** (starts with `whsec_...`)
7. Set it in Firebase:
   ```bash
   firebase functions:config:set stripe.webhook_secret="whsec_your_secret_here"
   ```
8. Redeploy functions:
   ```bash
   firebase deploy --only functions
   ```

---

## ✅ Verification Checklist

- [ ] Stripe account created
- [ ] API keys obtained (Publishable and Secret)
- [ ] 3 products created in Stripe Dashboard
- [ ] Price IDs copied
- [ ] `.env.local` created with `REACT_APP_STRIPE_PUBLISHABLE_KEY`
- [ ] Firebase Functions initialized
- [ ] Stripe installed in functions
- [ ] Stripe secret key set in Firebase config
- [ ] Functions deployed
- [ ] Price IDs updated in `stripe.js`
- [ ] Test checkout successful
- [ ] Webhooks configured (optional)

---

## 🚨 Troubleshooting

### "Stripe publishable key not configured"
- Make sure `.env.local` exists in project root
- Make sure the key starts with `pk_test_...` or `pk_live_...`
- Restart your dev server after adding the key

### "Failed to create checkout session"
- Check Firebase Functions logs: `firebase functions:log`
- Verify Stripe secret key is set: `firebase functions:config:get`
- Make sure functions are deployed: `firebase deploy --only functions`

### "Price ID not found"
- Verify Price IDs in Stripe Dashboard → Products
- Make sure you're using the correct Price ID (not Product ID)
- Check that Price IDs in `stripe.js` match Stripe Dashboard

### Functions won't deploy
- Make sure you're logged in: `firebase login`
- Check you have the right project: `firebase projects:list`
- Verify functions directory exists and has `index.js`

---

## 📚 Next Steps

1. **Test thoroughly** with Stripe test cards
2. **Set up webhooks** for automatic subscription management
3. **Switch to live keys** when ready for production:
   - Get live keys from Stripe Dashboard
   - Update `.env.local` with `pk_live_...`
   - Update Firebase config with `sk_live_...`
   - Redeploy functions
4. **Monitor** in Stripe Dashboard → Payments

---

## 🆘 Need Help?

- [Stripe Documentation](https://stripe.com/docs)
- [Firebase Functions Docs](https://firebase.google.com/docs/functions)
- Check `STRIPE_SETUP_GUIDE.md` for detailed technical info

---

**You're all set! 🎉** Your payment system is now ready for testing.


