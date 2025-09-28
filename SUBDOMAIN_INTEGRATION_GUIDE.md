# Subdomain Integration Guide - app.iterumfoods.xyz

## 🌐 **Connecting Your Existing Landing Page to the Restaurant Planning App**

This guide will help you connect your existing `iterumfoods.xyz` landing page with your new subscription-based restaurant planning app on `app.iterumfoods.xyz`.

---

## 🎯 **Integration Strategy**

### **Domain Structure:**
- **Main Site**: `iterumfoods.xyz` (your existing landing page - unchanged)
- **App**: `app.iterumfoods.xyz` (new restaurant planning application)
- **User Flow**: Landing page → "Get Started" → App subdomain

---

## 📋 **Step-by-Step Implementation**

### **Step 1: Set Up Subdomain**

#### **A. DNS Configuration**
Add a CNAME record in your domain DNS settings:
```
Type: CNAME
Name: app
Value: restaurant-startup-app.web.app
```

#### **B. Firebase Hosting Setup**
```bash
# Create hosting site for subdomain
firebase hosting:sites:create app-iterumfoods

# Deploy to subdomain
firebase deploy --only hosting --project app-iterumfoods
```

### **Step 2: Update Firebase Configuration**

#### **A. Update .firebaserc:**
```json
{
  "projects": {
    "default": "restaurant-startup-app",
    "app-iterumfoods": "restaurant-startup-app"
  },
  "targets": {
    "restaurant-startup-app": {
      "hosting": {
        "app-iterumfoods": ["app.iterumfoods.xyz"]
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
      "target": "app-iterumfoods",
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
      ]
    }
  ],
  "firestore": {
    "rules": "firestore.rules",
    "indexes": "firestore.indexes.json"
  }
}
```

### **Step 3: Update App Configuration**

#### **A. Update package.json homepage:**
```json
{
  "homepage": "https://app.iterumfoods.xyz"
}
```

#### **B. Update environment variables:**
```bash
# .env file
REACT_APP_APP_NAME="Iterum Foods Restaurant Planner"
REACT_APP_DOMAIN="app.iterumfoods.xyz"
REACT_APP_MAIN_SITE="https://iterumfoods.xyz"
```

### **Step 4: Add Landing Page Integration**

#### **A. Create a simple landing page component:**
```javascript
// src/components/landing/AppLanding.js
import React from 'react';
import { ArrowRight, ExternalLink } from 'lucide-react';

const AppLanding = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Simple landing page that redirects to main site or app */}
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">
          Restaurant Planning App
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Plan your restaurant business with our comprehensive planning platform.
        </p>
        <div className="space-y-4">
          <a
            href="https://iterumfoods.xyz"
            className="inline-flex items-center bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200"
          >
            Visit Main Site
            <ExternalLink className="w-5 h-5 ml-2" />
          </a>
          <button
            onClick={() => window.location.href = '/dashboard'}
            className="inline-flex items-center border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors duration-200 ml-4"
          >
            Access App
            <ArrowRight className="w-5 h-5 ml-2" />
          </button>
        </div>
      </div>
    </div>
  );
};
```

---

## 🔄 **User Flow Integration**

### **From Your Existing Landing Page:**

#### **Option A: Direct Link**
Add a button/link on your existing `iterumfoods.xyz`:
```html
<a href="https://app.iterumfoods.xyz" class="cta-button">
  Start Planning Your Restaurant
</a>
```

#### **Option B: Modal/Overlay**
Embed a sign-up form that redirects to the app:
```html
<button onclick="window.open('https://app.iterumfoods.xyz', '_blank')">
  Launch Restaurant Planner
</button>
```

#### **Option C: Seamless Integration**
Create a bridge page that handles the transition:
```html
<!-- On your main site -->
<a href="https://app.iterumfoods.xyz/launch" class="app-launch-btn">
  Get Started with Restaurant Planning
</a>
```

---

## 🎨 **Branding Integration**

### **Update App Branding to Match Your Site:**

#### **A. Colors and Fonts:**
```css
/* Match your existing site's design system */
:root {
  --primary-color: #your-brand-color;
  --secondary-color: #your-secondary-color;
  --font-family: 'Your-Font-Family', sans-serif;
}
```

#### **B. Logo Integration:**
```javascript
// Use your existing logo in the app
<img src="https://iterumfoods.xyz/logo.png" alt="Iterum Foods" />
```

#### **C. Consistent Messaging:**
- Use the same taglines and value propositions
- Maintain consistent tone and voice
- Reference your main site where appropriate

---

## 📊 **Analytics & Tracking**

### **Cross-Domain Tracking:**
```javascript
// Track users from main site to app
gtag('event', 'app_launch', {
  'source': 'main_site',
  'destination': 'app.iterumfoods.xyz'
});
```

### **Conversion Funnel:**
1. **Main site visit** → Track on `iterumfoods.xyz`
2. **App launch** → Track on `app.iterumfoods.xyz`
3. **Sign-up** → Track in app analytics
4. **Subscription** → Track in Stripe/Firebase

---

## 🔧 **Technical Implementation**

### **A. Update App.js for Subdomain:**
```javascript
// Show simple landing page for app.iterumfoods.xyz root
if (window.location.pathname === '/' && !state.isAuthenticated) {
  return <AppLanding />;
}

// Show sign-in modal for authenticated users
if (!state.isAuthenticated || !state.userId) {
  return <SignInModal />;
}
```

### **B. Add Cross-Domain Navigation:**
```javascript
// Navigation component
const Navigation = () => (
  <nav>
    <a href="https://iterumfoods.xyz" target="_blank">
      Back to Main Site
    </a>
    {/* App navigation */}
  </nav>
);
```

---

## 🚀 **Deployment Steps**

### **1. Build and Deploy:**
```bash
# Build the app
npm run build

# Deploy to subdomain
firebase deploy --only hosting --project app-iterumfoods
```

### **2. Configure DNS:**
- Add CNAME record for `app.iterumfoods.xyz`
- Point to Firebase hosting

### **3. Update Main Site:**
- Add "Launch App" button/link
- Update navigation if needed
- Test the integration

---

## ✅ **Benefits of This Approach**

### **Advantages:**
✅ **No disruption** to your existing site  
✅ **Clean separation** of concerns  
✅ **Easy to manage** and update  
✅ **SEO benefits** for both domains  
✅ **Professional appearance**  
✅ **Scalable architecture**  

### **User Experience:**
1. **Visit iterumfoods.xyz** → See your existing landing page
2. **Click "Launch App"** → Redirected to app.iterumfoods.xyz
3. **Sign up/Login** → Access restaurant planning tools
4. **Use app** → Full subscription-based features

---

## 🎯 **Next Steps**

1. **Choose your preferred integration method** (direct link, modal, bridge page)
2. **Set up the subdomain** (DNS + Firebase hosting)
3. **Deploy the app** to app.iterumfoods.xyz
4. **Add integration** to your existing landing page
5. **Test the complete flow** from main site to app

---

## 🆘 **Need Help?**

I can help you implement any of these integration methods. The subdomain approach is the cleanest and most professional solution that won't disrupt your existing site while providing a seamless user experience.

**Would you like me to:**
1. **Set up the subdomain configuration** for you?
2. **Create the integration code** for your existing landing page?
3. **Deploy the app** to the subdomain?
4. **Help with DNS setup** instructions?
