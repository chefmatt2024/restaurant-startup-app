# 🚀 Deployment Checklist - Next 3 Tasks

## Task 1: Deploy Recent Changes ✅ (Ready, needs Firebase auth)

### What's Ready:
- ✅ Vendor management fixes (edit/delete functionality)
- ✅ Landing page conversion tracking (UTM parameters)
- ✅ All changes built successfully

### Action Required:
1. Re-authenticate with Firebase:
   ```bash
   firebase login --reauth
   ```

2. Deploy:
   ```bash
   firebase deploy --only hosting:app
   ```

### Status: ⚠️ Waiting for Firebase authentication

---

## Task 2: Landing Page Links ✅ (Already Implemented)

### Current Status:
✅ **React Landing Pages** (`/landing` route):
- Already have "Start Free Trial" buttons
- Already track conversion events (gtag)
- Already link to signup flow via `actions.setActiveTab('trial-signup')`
- Conversion tracking implemented with UTM parameters

### What's Working:
- Landing page at `/landing` has working "Start Free Trial" buttons
- Conversion tracking is already implemented
- Buttons properly redirect to signup flow

### Optional: External Landing Page
If you have a separate HTML landing page at `iterumfoods.xyz/restauranteur-app`:
- You would need to edit that HTML file separately (not in this codebase)
- Add link: `<a href="https://restaurant-startup-app.web.app/?utm_source=landing&utm_medium=website&utm_campaign=trial_signup">Start Free Trial</a>`

### Status: ✅ Already Complete (for React app landing pages)

---

## Task 3: Verify Stripe Functions ⚠️ (Needs Firebase auth)

### Functions Code Status:
✅ Functions exist in `functions/index.js`:
- `createCheckoutSession` - Creates Stripe checkout
- `createCustomerPortalSession` - Manages subscriptions
- `stripeWebhook` - Handles Stripe events

### Action Required:
1. Re-authenticate with Firebase:
   ```bash
   firebase login --reauth
   ```

2. Check if functions are deployed:
   ```bash
   firebase functions:list
   ```

3. If not deployed, deploy them (requires Blaze plan):
   ```bash
   firebase deploy --only functions
   ```

### Important Notes:
- ⚠️ Firebase Functions require **Blaze (pay-as-you-go) plan**
- ⚠️ Free Spark plan doesn't support Cloud Functions
- If functions aren't deployed, users can't upgrade to paid plans

### Status: ⚠️ Waiting for Firebase authentication to verify

---

## 📋 Next Steps Summary

### Immediate Actions:
1. **Run Firebase re-authentication:**
   ```bash
   firebase login --reauth
   ```

2. **After authentication, deploy:**
   ```bash
   # Deploy app changes
   firebase deploy --only hosting:app
   
   # Check functions status
   firebase functions:list
   
   # If needed, deploy functions (requires Blaze plan)
   firebase deploy --only functions
   ```

3. **Verify deployment:**
   - Visit: https://restaurant-startup-app.web.app
   - Test vendor edit/delete functionality
   - Check conversion tracking in GA4 Real-Time
   - Test payment flow (if functions are deployed)

---

## ✅ What's Already Done

1. ✅ Vendor management fixes implemented
2. ✅ Conversion tracking implemented
3. ✅ Landing page buttons working (React app)
4. ✅ Stripe functions code ready
5. ✅ Build successful

## ⚠️ What Needs Your Action

1. ⚠️ Firebase authentication (run `firebase login --reauth`)
2. ⚠️ Deploy changes (after authentication)
3. ⚠️ Verify Stripe Functions deployment (check if Blaze plan is active)

---

**Ready to proceed? Run `firebase login --reauth` first!** 🚀

