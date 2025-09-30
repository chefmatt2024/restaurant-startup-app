# 🌐 Domain Setup Guide for iterumfoods.xyz

## Overview
This guide will help you set up your main domain `iterumfoods.xyz` to host the sales landing page, which then links to your Firebase app for the actual functionality.

## 🎯 Strategy
- **Main Domain**: `iterumfoods.xyz` → Sales landing page
- **App Domain**: `restaurant-startup-app.web.app` → Full application
- **Flow**: Landing page → "Start Free Trial" → Firebase app

---

## 📋 Setup Options

### Option 1: Simple Hosting (Recommended)
Upload the `iterumfoods-landing.html` file to your current hosting provider.

### Option 2: Firebase Hosting (Advanced)
Set up Firebase hosting for your custom domain.

---

## 🚀 Option 1: Simple Hosting Setup

### Step 1: Upload Landing Page
1. **Access your hosting control panel** (cPanel, Plesk, etc.)
2. **Navigate to File Manager** or use FTP
3. **Upload `iterumfoods-landing.html`** to your public_html folder
4. **Rename it to `index.html`** (this makes it your homepage)

### Step 2: Test Your Domain
1. Visit `https://iterumfoods.xyz`
2. Verify the landing page loads correctly
3. Test the "Start Free Trial" button links to the app

### Step 3: Update DNS (if needed)
If your domain isn't pointing to your hosting:
1. **Access your domain registrar** (GoDaddy, Namecheap, etc.)
2. **Update DNS settings**:
   - A Record: `@` → Your hosting IP
   - CNAME: `www` → `iterumfoods.xyz`

---

## 🔧 Option 2: Firebase Hosting Setup

### Step 1: Add Custom Domain to Firebase
```bash
# Add your domain to Firebase Hosting
firebase hosting:channel:deploy live --expires 1d
```

1. **Go to Firebase Console** → Hosting
2. **Click "Add custom domain"**
3. **Enter**: `iterumfoods.xyz`
4. **Follow verification steps**

### Step 2: Update DNS Records
Firebase will provide you with DNS records to add:

**A Records:**
```
@ 151.101.1.195
@ 151.101.65.195
```

**CNAME Record:**
```
www iterumfoods.xyz
```

### Step 3: Create Firebase Hosting Config
Create `firebase-main.json`:
```json
{
  "hosting": {
    "public": "public",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  }
}
```

### Step 4: Deploy Landing Page
```bash
# Create public directory
mkdir public

# Copy landing page
cp iterumfoods-landing.html public/index.html

# Deploy to custom domain
firebase deploy --only hosting --project your-main-project
```

---

## 📱 Testing Your Setup

### Test Checklist:
- [ ] `https://iterumfoods.xyz` loads the landing page
- [ ] `https://www.iterumfoods.xyz` redirects properly
- [ ] "Start Free Trial" button opens the app
- [ ] Mobile version works correctly
- [ ] All CTAs are functional
- [ ] Page loads quickly (< 3 seconds)

### Performance Testing:
- **Google PageSpeed Insights**: https://pagespeed.web.dev/
- **GTmetrix**: https://gtmetrix.com/
- **Mobile-Friendly Test**: https://search.google.com/test/mobile-friendly

---

## 🔗 Linking Strategy

### Landing Page CTAs
All "Start Free Trial" buttons link to:
```
https://restaurant-startup-app.web.app
```

### App Flow
1. User visits `iterumfoods.xyz`
2. Sees sales-focused landing page
3. Clicks "Start Free Trial"
4. Redirected to Firebase app
5. Can sign up and access full functionality

---

## 📊 Analytics Setup

### Google Analytics
Add to your landing page:
```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

### Conversion Tracking
Track these events:
- **Landing page visits**
- **CTA button clicks**
- **App redirects**
- **Trial signups**

---

## 🛠️ Maintenance

### Regular Updates:
- [ ] Update testimonials quarterly
- [ ] Refresh success stories
- [ ] Monitor conversion rates
- [ ] A/B test headlines and CTAs
- [ ] Update pricing if needed

### Monitoring:
- **Uptime monitoring**: UptimeRobot, Pingdom
- **Performance monitoring**: Google PageSpeed
- **Conversion tracking**: Google Analytics

---

## 🚨 Troubleshooting

### Common Issues:

**Domain not loading:**
- Check DNS propagation (24-48 hours)
- Verify hosting is active
- Check file permissions

**Landing page not found:**
- Ensure file is named `index.html`
- Check file is in correct directory
- Verify hosting is working

**App link not working:**
- Test Firebase app URL directly
- Check for typos in link
- Verify Firebase hosting is active

**Mobile issues:**
- Test responsive design
- Check viewport meta tag
- Verify touch-friendly buttons

---

## 📈 Expected Results

After setup:
- **Professional landing page** on your domain
- **Clear path to conversion** for visitors
- **Branded experience** that builds trust
- **Mobile-optimized** for all devices
- **Fast loading** for better SEO

---

## 🎉 Next Steps

1. **Upload the landing page** to your hosting
2. **Test all functionality** thoroughly
3. **Set up analytics** tracking
4. **Monitor performance** and conversions
5. **Optimize based on data**

**Your domain will now serve as a powerful sales funnel that converts visitors into Restaurant Business Planner customers!** 🚀

---

## 📞 Support

If you need help with setup:
1. Check your hosting provider's documentation
2. Contact your domain registrar support
3. Review Firebase hosting documentation
4. Test with browser developer tools

**Ready to launch your restaurant-focused sales funnel?** 🎯
