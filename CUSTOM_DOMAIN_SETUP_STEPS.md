# 🌐 Add Custom Domain to Firebase Hosting

## Step-by-Step Guide to Connect iterumfoods.xyz

### Step 1: Access Firebase Console
1. Go to: https://console.firebase.google.com/project/restaurant-startup-app/hosting
2. Sign in with your Google account (matt@iterumfoods.com)

### Step 2: Select Your Landing Site
1. You should see two sites:
   - `restaurant-startup-app` (your main app)
   - `iterumfoods-landing` (your landing page) ← **Click on this one**

### Step 3: Add Custom Domain
1. Click **"Add custom domain"** button
2. Enter: `iterumfoods.xyz`
3. Click **"Continue"**

### Step 4: Verify Domain Ownership
Firebase will give you two options:

#### Option A: HTML File Upload (Easiest)
1. Download the verification file
2. Upload it to your domain's root directory
3. Click **"Verify"**

#### Option B: DNS TXT Record (Alternative)
1. Copy the TXT record provided
2. Add it to your domain's DNS settings
3. Click **"Verify"**

### Step 5: Configure DNS Records
After verification, Firebase will provide DNS records to add:

#### A Records (Add these to your DNS):
```
Type: A
Name: @
Value: 151.101.1.195
TTL: 3600

Type: A  
Name: @
Value: 151.101.65.195
TTL: 3600
```

#### CNAME Record (Add this):
```
Type: CNAME
Name: www
Value: iterumfoods.xyz
TTL: 3600
```

### Step 6: DNS Provider Instructions

#### If using GoDaddy:
1. Go to DNS Management
2. Delete existing A records for @
3. Add the two new A records above
4. Add the CNAME record for www

#### If using Namecheap:
1. Go to Advanced DNS
2. Delete existing A records
3. Add the new records above

#### If using Cloudflare:
1. Go to DNS tab
2. Add the A records (proxy status: Proxied)
3. Add the CNAME record

### Step 7: Wait for Propagation
- DNS changes can take 5-60 minutes
- Firebase will automatically detect when ready
- You'll see a green checkmark when complete

### Step 8: Automatic HTTPS Setup
- Firebase automatically provisions SSL certificate
- Takes 5-10 minutes after DNS is ready
- You'll get a green lock icon when ready

## ✅ What You'll Have After Setup:

### Your URLs:
- **https://iterumfoods.xyz** → Landing page
- **https://www.iterumfoods.xyz** → Redirects to main domain
- **https://restaurant-startup-app.web.app** → Your app

### Security Features:
- ✅ Automatic HTTPS with SSL certificate
- ✅ HTTP to HTTPS redirects
- ✅ Global CDN performance
- ✅ DDoS protection

## 🔧 Troubleshooting:

### If domain doesn't work:
1. Check DNS propagation: https://dnschecker.org/
2. Wait up to 24 hours for full propagation
3. Clear browser cache and try again

### If verification fails:
1. Make sure you have access to your domain
2. Try the alternative verification method
3. Contact your domain provider for help

### If HTTPS doesn't work:
1. Wait 10-15 minutes after DNS is ready
2. Check Firebase Console for certificate status
3. Try accessing the site in incognito mode

## 📞 Need Help?

### Your Current Status:
- ✅ Landing page deployed: https://iterumfoods-landing.web.app
- ✅ App deployed: https://restaurant-startup-app.web.app
- ⏳ Custom domain setup: Follow steps above

### After Setup Complete:
- Your domain will automatically redirect HTTP to HTTPS
- All traffic will be encrypted and secure
- Global CDN will make your site fast worldwide

---

**Ready to proceed? Follow the steps above to connect iterumfoods.xyz to your Firebase hosting!** 🚀
