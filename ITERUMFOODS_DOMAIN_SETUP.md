# 🌐 Connecting Investor Page to iterumfoods.com/restaurant-startup-app

## ✅ What's Already Done

The investor landing page is now accessible at:
- `/restaurant-startup-app` (on your Firebase app)
- `/investors` (alternative route)

## 🎯 Setup Options for iterumfoods.com

### Option 1: Firebase Custom Domain (Recommended)
Host the entire app on `iterumfoods.com` with the investor page at `/restaurant-startup-app`

**Steps:**
1. **Add Custom Domain in Firebase Console:**
   - Go to [Firebase Console](https://console.firebase.google.com/project/restaurant-startup-app/hosting)
   - Click "Add custom domain"
   - Enter `iterumfoods.com`
   - Follow DNS setup instructions

2. **Update DNS Records:**
   ```
   Type: A
   Name: @
   Value: [Firebase will provide IP addresses]
   
   Type: CNAME
   Name: www
   Value: [Firebase will provide CNAME]
   ```

3. **Deploy:**
   ```bash
   firebase deploy
   ```

4. **Result:**
   - `iterumfoods.com` → Main app (Dashboard)
   - `iterumfoods.com/restaurant-startup-app` → Investor landing page
   - `iterumfoods.com/investors` → Investor landing page (alternative)
   - `iterumfoods.com/landing` → Customer landing page

### Option 2: Subdomain Approach
Keep main site on `iterumfoods.com`, host app on subdomain

**Steps:**
1. **Set up subdomain:**
   - Create subdomain: `app.iterumfoods.com` or `planner.iterumfoods.com`
   - Point to Firebase hosting

2. **DNS Configuration:**
   ```
   Type: CNAME
   Name: app (or planner)
   Value: restaurant-startup-app.web.app
   ```

3. **Result:**
   - `iterumfoods.com` → Your existing site
   - `app.iterumfoods.com/restaurant-startup-app` → Investor page
   - `app.iterumfoods.com` → Main app

### Option 3: Path-Based on Existing Site
If you have control over `iterumfoods.com`:

**If using a CMS/WordPress:**
1. Create a redirect/iframe page at `/restaurant-startup-app`
2. Redirect to: `https://restaurant-startup-app.web.app/restaurant-startup-app`

**If using static hosting:**
1. Create an `index.html` at `/restaurant-startup-app/` folder
2. Add redirect:
   ```html
   <!DOCTYPE html>
   <html>
   <head>
     <meta http-equiv="refresh" content="0; url=https://restaurant-startup-app.web.app/restaurant-startup-app">
   </head>
   <body>
     <p>Redirecting to investor page...</p>
   </body>
   </html>
   ```

## 🔗 Current URLs

**On Firebase (restaurant-startup-app.web.app):**
- ✅ `https://restaurant-startup-app.web.app/restaurant-startup-app` → Investor page
- ✅ `https://restaurant-startup-app.web.app/investors` → Investor page
- ✅ `https://restaurant-startup-app.web.app/landing` → Customer landing page
- ✅ `https://restaurant-startup-app.web.app/` → Main app

**After connecting to iterumfoods.com:**
- `https://iterumfoods.com/restaurant-startup-app` → Investor page
- `https://iterumfoods.com/investors` → Investor page
- `https://iterumfoods.com/landing` → Customer landing page
- `https://iterumfoods.com/` → Main app

## 📋 Quick Setup Checklist

- [ ] Decide on setup option (Option 1 recommended)
- [ ] Add `iterumfoods.com` as custom domain in Firebase Console
- [ ] Update DNS records as instructed by Firebase
- [ ] Wait for DNS propagation (24-48 hours)
- [ ] Deploy app: `firebase deploy`
- [ ] Test: Visit `iterumfoods.com/restaurant-startup-app`
- [ ] Update any external links to use new URL

## 🎯 Recommended: Option 1 (Full Firebase Hosting)

This gives you:
- ✅ Full control over all routes
- ✅ Single deployment process
- ✅ Better SEO (all content on one domain)
- ✅ SSL certificate included
- ✅ Fast CDN delivery

**Next Steps:**
1. Go to Firebase Console → Hosting
2. Click "Add custom domain"
3. Enter `iterumfoods.com`
4. Follow the DNS setup instructions
5. Deploy: `firebase deploy`

Once DNS propagates, `iterumfoods.com/restaurant-startup-app` will show the investor landing page!


