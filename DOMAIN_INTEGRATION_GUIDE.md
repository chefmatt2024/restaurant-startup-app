# Domain Integration Guide - iterumfoods.xyz

## 🌐 **Connecting Your Domain to the Restaurant Planning App**

This guide will help you connect your existing `iterumfoods.xyz` domain with your new subscription-based restaurant planning application.

---

## 🎯 **Integration Options**

### **Option 1: Replace Current Site (Recommended)**
Replace your current landing page with the new integrated app that includes both landing page and application functionality.

### **Option 2: Subdomain Approach**
Keep your current site on `iterumfoods.xyz` and host the app on `app.iterumfoods.xyz`.

### **Option 3: Path-based Integration**
Host the app at `iterumfoods.xyz/app` while keeping your current site on the root domain.

---

## 🚀 **Recommended Solution: Option 1 - Complete Integration**

### **What This Provides:**
✅ **Unified Experience** - Landing page and app in one seamless flow  
✅ **Better SEO** - All content on one domain  
✅ **Simpler Management** - One hosting setup  
✅ **Professional Look** - Integrated branding and design  
✅ **Subscription Flow** - Direct path from landing page to app  

---

## 📋 **Step-by-Step Implementation**

### **Step 1: Prepare Your Domain**

#### **A. Update DNS Settings**
1. **Go to your domain registrar** (GoDaddy, Namecheap, etc.)
2. **Update DNS records:**
   ```
   Type: CNAME
   Name: www
   Value: iterumfoods.xyz.web.app
   
   Type: A
   Name: @
   Value: [Firebase IP - will be provided after deployment]
   ```

#### **B. Verify Domain Ownership**
1. **Add domain to Firebase Hosting:**
   ```bash
   firebase hosting:sites:create iterumfoods-xyz
   ```

2. **Update firebase.json:**
   ```json
   {
     "hosting": {
       "target": "iterumfoods-xyz",
       "public": "build",
       "rewrites": [
         {
           "source": "**",
           "destination": "/index.html"
         }
       ]
     }
   }
   ```

### **Step 2: Deploy the Integrated App**

#### **A. Build and Deploy**
```bash
# Build the app
npm run build

# Deploy to Firebase
firebase deploy --only hosting
```

#### **B. Configure Custom Domain**
```bash
# Add custom domain
firebase hosting:sites:create iterumfoods-xyz

# Deploy to custom domain
firebase deploy --only hosting --project iterumfoods-xyz
```

### **Step 3: Update Environment Variables**

#### **A. Create .env file:**
```bash
# Firebase Configuration
REACT_APP_FIREBASE_API_KEY=your_api_key_here
REACT_APP_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id

# Stripe Configuration
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here

# App Configuration
REACT_APP_APP_NAME="Iterum Foods - Restaurant Planning"
REACT_APP_VERSION="1.0.0"
REACT_APP_DOMAIN="iterumfoods.xyz"
```

### **Step 4: Configure Firebase Hosting**

#### **A. Update .firebaserc:**
```json
{
  "projects": {
    "default": "iterumfoods-xyz",
    "iterumfoods-xyz": "iterumfoods-xyz"
  },
  "targets": {
    "iterumfoods-xyz": {
      "hosting": {
        "iterumfoods-xyz": ["iterumfoods.xyz", "www.iterumfoods.xyz"]
      }
    }
  }
}
```

#### **B. Update firebase.json:**
```json
{
  "hosting": [
    {
      "target": "iterumfoods-xyz",
      "public": "build",
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
      ],
      "headers": [
        {
          "source": "**",
          "headers": [
            {
              "key": "Cache-Control",
              "value": "public, max-age=3600"
            }
          ]
        }
      ]
    }
  ],
  "firestore": {
    "rules": "firestore.rules",
    "indexes": "firestore.indexes.json"
  }
}
```

---

## 🔄 **Migration Strategy**

### **Phase 1: Preparation (1-2 days)**
1. ✅ **Backup current site** - Download all files and content
2. ✅ **Set up development environment** - Test locally
3. ✅ **Configure Firebase project** - Set up hosting and domain

### **Phase 2: Deployment (1 day)**
1. ✅ **Deploy to staging** - Test on Firebase subdomain first
2. ✅ **Configure custom domain** - Point iterumfoods.xyz to Firebase
3. ✅ **Test all functionality** - Landing page, sign-up, app features

### **Phase 3: Launch (1 day)**
1. ✅ **Go live** - Switch DNS to point to Firebase
2. ✅ **Monitor performance** - Check analytics and user flow
3. ✅ **Handle redirects** - Set up any necessary URL redirects

---

## 🎨 **Landing Page Features**

### **What's Included:**
- **Hero Section** - Compelling headline and CTA
- **Features Overview** - Key app capabilities
- **Pricing Plans** - Integrated with subscription system
- **Testimonials** - Social proof and credibility
- **Navigation** - Seamless transition to app
- **Mobile Responsive** - Works on all devices

### **User Flow:**
1. **Land on iterumfoods.xyz** → See landing page
2. **Click "Get Started"** → Sign up modal appears
3. **Complete sign-up** → Redirected to app dashboard
4. **Choose subscription** → Access full features

---

## 🔧 **Technical Implementation**

### **Landing Page Integration:**
```javascript
// App.js - Main routing logic
if (!state.isAuthenticated || !state.userId) {
  return (
    <div className="App min-h-screen bg-white">
      <LandingPage />
      {/* Show sign-in modal when needed */}
      {state.activeTab === 'sign-in' && (
        <SignInModal 
          isOpen={true}
          onClose={() => actions.setActiveTab('idea-formation')}
          allowClose={true}
        />
      )}
    </div>
  );
}
```

### **Seamless Transitions:**
- **Landing → Sign-up** - Modal overlay
- **Sign-up → Dashboard** - Automatic redirect
- **Pricing → Checkout** - Stripe integration
- **App → Landing** - Sign-out flow

---

## 📊 **Analytics & Tracking**

### **Google Analytics Setup:**
```javascript
// Add to landing page
gtag('config', 'GA_MEASUREMENT_ID', {
  page_title: 'Iterum Foods - Restaurant Planning',
  page_location: 'https://iterumfoods.xyz'
});
```

### **Conversion Tracking:**
- **Landing page visits**
- **Sign-up conversions**
- **Subscription purchases**
- **Feature usage**

---

## 🚨 **Important Considerations**

### **SEO & Performance:**
- ✅ **Meta tags** - Optimized for search engines
- ✅ **Page speed** - Optimized loading times
- ✅ **Mobile-first** - Responsive design
- ✅ **SSL certificate** - Secure HTTPS

### **Backup & Rollback:**
- ✅ **Current site backup** - Keep original files
- ✅ **DNS rollback plan** - Quick revert if needed
- ✅ **Staging environment** - Test before going live

---

## 🎯 **Success Metrics**

### **Key Performance Indicators:**
- **Landing page conversion rate** - Visitors to sign-ups
- **Subscription conversion rate** - Free to paid users
- **User engagement** - Time spent in app
- **Customer satisfaction** - Feedback and reviews

---

## 🆘 **Troubleshooting**

### **Common Issues:**
1. **DNS propagation** - Can take 24-48 hours
2. **SSL certificate** - May take time to generate
3. **Firebase limits** - Check hosting quotas
4. **Domain verification** - Ensure proper DNS setup

### **Support Resources:**
- [Firebase Hosting Docs](https://firebase.google.com/docs/hosting)
- [Custom Domain Setup](https://firebase.google.com/docs/hosting/custom-domain)
- [DNS Configuration](https://support.google.com/domains/answer/3290350)

---

## ✅ **Next Steps**

1. **Review this guide** - Understand the integration process
2. **Backup current site** - Save existing content
3. **Set up Firebase project** - Configure hosting
4. **Deploy integrated app** - Test functionality
5. **Configure custom domain** - Point iterumfoods.xyz to Firebase
6. **Go live** - Launch the integrated experience

Your restaurant planning app will be seamlessly integrated with your domain, providing a professional, unified experience for your users!

---

## 📞 **Need Help?**

If you need assistance with any of these steps, I'm here to help guide you through the process. The integration will create a professional, seamless experience that converts visitors into subscribers.
