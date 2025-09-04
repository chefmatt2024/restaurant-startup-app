# 🌐 Deployment Guide for iterumfoods.xyz

## 🚀 How Your Site Will Be Deployed

Your Boston Restaurant Business Planner will be deployed to **iterumfoods.xyz** with the following structure:

### 📍 **Site Structure**
- **Homepage:** `https://iterumfoods.xyz` → Landing page (marketing site)
- **App:** `https://iterumfoods.xyz/app` → Full restaurant planning application
- **Direct App:** `https://iterumfoods.xyz/app/` → React app with all features

### 🔗 **URL Mapping**
```
iterumfoods.xyz/              → Landing page (landing-page.html)
iterumfoods.xyz/app           → App redirect page (app.html) 
iterumfoods.xyz/app/          → Full React application
```

## ⚙️ **GitHub Setup Required**

### 1. **Push Code to GitHub**
```bash
git add .
git commit -m "Add landing page and deployment configuration"
git push origin main
```

### 2. **Configure GitHub Pages**
1. Go to your GitHub repository settings
2. Navigate to **Pages** section
3. Set source to **GitHub Actions**
4. The workflow will automatically deploy

### 3. **Domain Configuration**
1. In your domain registrar (where you bought iterumfoods.xyz):
   - Create a **CNAME record**: `www.iterumfoods.xyz` → `[your-github-username].github.io`
   - Create an **A record**: `iterumfoods.xyz` → GitHub Pages IPs:
     ```
     185.199.108.153
     185.199.109.153
     185.199.110.153
     185.199.111.153
     ```

### 4. **Verify Deployment**
- The GitHub Action will automatically deploy when you push to `main`
- Check the **Actions** tab in GitHub to monitor deployment
- Your site will be live at `https://iterumfoods.xyz` within 5-10 minutes

## 🎯 **What Happens During Deployment**

1. **Build React App** → Creates optimized production build
2. **Copy Landing Page** → Sets landing page as homepage
3. **Setup App Routing** → Configures `/app` path for the React application
4. **Custom Domain** → Configures CNAME for iterumfoods.xyz
5. **Deploy** → Publishes everything to GitHub Pages

## 🔍 **Testing Your Deployment**

After deployment, test these URLs:
- ✅ `https://iterumfoods.xyz` → Should show landing page
- ✅ `https://iterumfoods.xyz/app` → Should redirect to React app
- ✅ `https://iterumfoods.xyz/app/` → Should show full restaurant planner

## 🛠️ **Troubleshooting**

### **If the domain doesn't work:**
1. Wait 24-48 hours for DNS propagation
2. Check domain registrar settings
3. Verify CNAME file contains `iterumfoods.xyz`

### **If the app doesn't load:**
1. Check GitHub Actions for build errors
2. Verify all files are committed and pushed
3. Check browser console for JavaScript errors

### **If landing page doesn't show:**
1. Verify `landing-page.html` exists in repository
2. Check GitHub Actions deployment log
3. Clear browser cache and retry

## 🎉 **You're All Set!**

Once deployed, you'll have:
- ✅ **Professional landing page** driving interest
- ✅ **Full restaurant planning app** for users
- ✅ **Custom domain** with SSL certificate
- ✅ **Automatic updates** when you push code changes

Your Boston Restaurant Business Planner will be live and ready to help entrepreneurs! 🚀