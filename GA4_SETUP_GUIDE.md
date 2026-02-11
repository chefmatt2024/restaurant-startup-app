# 📊 Google Analytics 4 Setup Guide

## Quick Setup Steps

### Step 1: Create Google Analytics Account

1. Go to [Google Analytics](https://analytics.google.com/)
2. Sign in with your Google account (matt@iterumfoods.com or your preferred account)
3. Click **"Start measuring"**
4. **Account name**: "Iterum Foods"
5. **Property name**: "Restaurant Business Planner"
6. **Reporting time zone**: "America/New_York"
7. **Currency**: "USD"

### Step 2: Set Up Data Stream

1. Choose platform: **"Web"**
2. **Website URL**: `https://restaurant-startup-app.web.app`
3. **Stream name**: "Restaurant Business Planner App"
4. Click **"Create stream"**

### Step 3: Get Your Measurement ID

1. Copy the **Measurement ID** (looks like: `G-XXXXXXXXXX`)
2. You'll use this in the next step

### Step 4: Add to Your App

1. Open `public/index.html`
2. Find the commented Google Analytics section (around line 35)
3. Replace `GA_MEASUREMENT_ID` with your actual measurement ID
4. Uncomment the script blocks

**Example:**
```html
<!-- Google Analytics 4 -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX', {
    page_path: window.location.pathname,
  });
</script>
```

### Step 5: Set Up Conversion Events

1. Go to GA4 → **Admin** → **Events**
2. Click **"Create event"**
3. Set up these conversion events:

#### Trial Signup
- **Event name**: `trial_signup_completed`
- **Description**: User completed trial signup
- **Mark as conversion**: ✅ Yes

#### App Launch
- **Event name**: `app_launched`
- **Description**: User launched the app
- **Mark as conversion**: ✅ Yes

#### Document Export
- **Event name**: `document_exported`
- **Description**: User exported a document
- **Mark as conversion**: ✅ Yes

#### Subscription Purchase
- **Event name**: `subscription_purchased`
- **Description**: User purchased a subscription
- **Mark as conversion**: ✅ Yes

### Step 6: Deploy

1. Run `npm run build`
2. Deploy to Firebase: `firebase deploy --only hosting:app`

---

## Additional Setup for Landing Page

If you want to track the landing page separately:

1. Create a second data stream for `https://iterumfoods-landing.web.app`
2. Add the GA4 script to the landing page HTML files
3. Use a different measurement ID or the same one (your choice)

---

## What We're Tracking

### Page Views
- All page views are automatically tracked
- Route changes are tracked via React Router

### User Actions
- Signups (`user_signup`)
- Logins (`user_login`)
- Feature usage (`feature_access`)
- Document exports (`business_plan_export`)

### Conversions
- Trial signups
- Subscription purchases
- Document exports
- Feature completions

---

## Testing

After setup, test that events are firing:

1. Open your app in a browser
2. Open browser DevTools → Network tab
3. Filter by "collect" or "gtag"
4. Perform actions (signup, export, etc.)
5. Verify events are being sent to Google Analytics

---

## Resources

- [GA4 Documentation](https://developers.google.com/analytics/devguides/collection/ga4)
- [GA4 Events Reference](https://developers.google.com/analytics/devguides/collection/ga4/events)
- [GA4 Setup Assistant](https://support.google.com/analytics/answer/9304153)


