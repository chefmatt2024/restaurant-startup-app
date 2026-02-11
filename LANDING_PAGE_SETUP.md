# 🎯 Landing Page Setup Summary

## Current Status

✅ **Firebase Configuration**: Updated `firebase.json` to support both sites:
- **App Site** (`restaurant-startup-app.web.app`): Deploys React app from `build/`
- **Landing Site** (`iterumfoods-landing.web.app`): Deploys HTML from `C:\Iterum Innovation\landing-pages\main-landing\`

## ✅ What's Configured

1. **`.firebaserc`**: Already has both targets configured
   - `app` → `restaurant-startup-app`
   - `landing` → `iterumfoods-landing`

2. **`firebase.json`**: Updated with two hosting configurations
   - App site: `build/` directory
   - Landing site: `C:/Iterum Innovation/landing-pages/main-landing/`

## 🔗 Next Steps: Connect Landing to App

The landing page HTML needs to link to the main app. Update `business-planner.html`:

### Add "Launch App" Button

Find the hero section with "Get Early Access" and add:

```html
<a href="https://restaurant-startup-app.web.app" class="btn btn-primary">
    <i class="fas fa-rocket"></i> Launch App
</a>
```

Or update the existing button:

```html
<!-- Change this -->
<a href="#" class="btn btn-primary" onclick="openWaitlistModal(); return false;">
    <i class="fas fa-rocket"></i> Get Early Access
</a>

<!-- To this -->
<a href="https://restaurant-startup-app.web.app" class="btn btn-primary">
    <i class="fas fa-rocket"></i> Start Planning Now
</a>
```

## 🚀 Deployment Commands

```bash
# Deploy landing page only
firebase deploy --only hosting:landing

# Deploy app only
firebase deploy --only hosting:app

# Deploy both
firebase deploy --only hosting
```

## ✅ Verification Checklist

- [ ] Landing page HTML has link to `https://restaurant-startup-app.web.app`
- [ ] Deploy landing page: `firebase deploy --only hosting:landing`
- [ ] Visit `https://iterumfoods-landing.web.app` and verify it loads
- [ ] Click "Launch App" button and verify it goes to main app
- [ ] Test user flow: Landing → App → Sign up → Dashboard

## 📍 Current URLs

- **Landing Page**: `https://iterumfoods-landing.web.app`
- **Main App**: `https://restaurant-startup-app.web.app`
- **Investor Page**: `https://restaurant-startup-app.web.app/restaurant-startup-app`

## 🔧 Alternative: Copy Files to Project

If the absolute path doesn't work, copy files to project:

```bash
# Create directory in project
mkdir public-landing

# Copy landing page files
xcopy "C:\Iterum Innovation\landing-pages\main-landing\*" public-landing\ /E /I

# Update firebase.json to use "public-landing" instead
```

Then update `firebase.json`:
```json
{
  "target": "landing",
  "public": "public-landing"
}
```


