# 🚀 Landing Page Deployment Guide

## Current Setup

- **Landing Page Site**: `iterumfoods-landing.web.app`
- **Main App Site**: `restaurant-startup-app.web.app`
- **Landing Page Location**: `C:\Iterum Innovation\landing-pages\main-landing\business-planner.html`

## ✅ Configuration Status

### Firebase Configuration

The `.firebaserc` file is already configured with:
```json
{
  "targets": {
    "restaurant-startup-app": {
      "hosting": {
        "app": ["restaurant-startup-app"],
        "landing": ["iterumfoods-landing"]
      }
    }
  }
}
```

### Firebase Hosting Config

The `firebase.json` has been updated to include both sites:
- **App site**: Deploys from `build/` directory (React app)
- **Landing site**: Deploys from `C:\Iterum Innovation\landing-pages\main-landing\`

## 🔗 Connecting Landing Page to App

The landing page needs to link to the main app. Update the HTML file to include:

### Option 1: Add "Launch App" Button (Recommended)

Add this button next to "Get Early Access":

```html
<a href="https://restaurant-startup-app.web.app" class="btn btn-primary" target="_self">
    <i class="fas fa-rocket"></i> Launch App
</a>
```

### Option 2: Update Existing Buttons

Change the "Get Early Access" button to redirect to the app:

```html
<a href="https://restaurant-startup-app.web.app" class="btn btn-primary">
    <i class="fas fa-rocket"></i> Start Planning Now
</a>
```

## 📋 Deployment Steps

### 1. Update Landing Page HTML

Edit `C:\Iterum Innovation\landing-pages\main-landing\business-planner.html`:

1. Find the "Get Early Access" button
2. Add a "Launch App" button that links to `https://restaurant-startup-app.web.app`
3. Or replace the waitlist modal with direct app link

### 2. Deploy Both Sites

```bash
# Deploy app site
firebase deploy --only hosting:app

# Deploy landing page site
firebase deploy --only hosting:landing

# Or deploy both at once
firebase deploy --only hosting
```

### 3. Verify Deployment

- ✅ Landing page: https://iterumfoods-landing.web.app
- ✅ Main app: https://restaurant-startup-app.web.app
- ✅ Landing page links to main app correctly

## 🎯 User Flow

1. **User visits**: `iterumfoods-landing.web.app`
2. **Clicks**: "Launch App" or "Start Planning Now"
3. **Redirects to**: `restaurant-startup-app.web.app`
4. **User signs up/logs in** and starts planning

## 🔧 Troubleshooting

### Issue: Landing page not deploying

**Solution**: Check the path in `firebase.json`. The relative path `../Iterum Innovation/landing-pages/main-landing` might not work. Consider:

1. **Copy files to project directory**:
   ```bash
   mkdir public-landing
   xcopy "C:\Iterum Innovation\landing-pages\main-landing\*" public-landing\ /E /I
   ```

2. **Update firebase.json**:
   ```json
   {
     "target": "landing",
     "public": "public-landing"
   }
   ```

### Issue: Links not working

**Solution**: Ensure absolute URLs are used:
- ✅ `https://restaurant-startup-app.web.app`
- ❌ `/dashboard` (relative paths won't work across sites)

## 📝 Next Steps

1. [ ] Update HTML file with app link
2. [ ] Test landing page locally
3. [ ] Deploy landing page: `firebase deploy --only hosting:landing`
4. [ ] Verify link works: Click "Launch App" → Should go to main app
5. [ ] Test user flow end-to-end

## 🌐 Custom Domain Setup (Future)

Once ready, you can add custom domains:

1. **Landing page**: `landing.iterumfoods.com` → `iterumfoods-landing.web.app`
2. **Main app**: `app.iterumfoods.com` → `restaurant-startup-app.web.app`

Update the HTML links accordingly when custom domains are configured.


