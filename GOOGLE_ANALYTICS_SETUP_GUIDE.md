# 📊 Google Analytics Setup Guide for Restaurant Business Planner

## Overview
This guide will help you set up Google Analytics 4 (GA4) to track your landing page performance and conversions.

---

## 🚀 **Quick Setup Steps**

### **Step 1: Create Google Analytics Account**

1. **Go to Google Analytics**: https://analytics.google.com/
2. **Sign in** with your Google account (matt@iterumfoods.com)
3. **Click "Start measuring"**
4. **Account name**: "Iterum Foods"
5. **Property name**: "Restaurant Business Planner"
6. **Reporting time zone**: "America/New_York"
7. **Currency**: "USD"

### **Step 2: Set Up Data Stream**

1. **Choose platform**: "Web"
2. **Website URL**: `https://iterumfoods-landing.web.app`
3. **Stream name**: "Landing Page"
4. **Click "Create stream"**

### **Step 3: Get Your Measurement ID**

1. **Copy the Measurement ID** (looks like: `G-XXXXXXXXXX`)
2. **Replace `GA_MEASUREMENT_ID`** in your HTML files with this ID

---

## 🔧 **Implementation**

### **Replace Placeholder ID**

In both files (`iterumfoods-landing.html` and `public/index.html`):

**Find this line:**
```html
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
```

**Replace with your actual ID:**
```html
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
```

**Also replace in the config:**
```javascript
gtag('config', 'G-XXXXXXXXXX', {
    // ... rest of config
});
```

---

## 📈 **What We're Tracking**

### **Page Views**
- **Landing page visits**
- **Time on page**
- **Bounce rate**
- **Traffic sources**

### **User Interactions**
- **CTA button clicks** (Start Free Trial)
- **Demo video interest** (Watch Demo)
- **Pricing plan views** (Free Trial, Professional, Enterprise)
- **Email signups** (if you add forms)

### **Conversions**
- **Trial signup attempts**
- **App redirects**
- **Engagement events**

---

## 🎯 **Key Metrics to Monitor**

### **Traffic Metrics**
- **Sessions**: Total visits to your landing page
- **Users**: Unique visitors
- **Page views**: Total page loads
- **Bounce rate**: % who leave without interaction
- **Session duration**: Average time on page

### **Conversion Metrics**
- **CTA clicks**: "Start Free Trial" button clicks
- **Trial signups**: Actual conversions to app
- **Engagement rate**: % who interact with content
- **Conversion rate**: CTA clicks / total visitors

### **Traffic Sources**
- **Organic search**: Google, Bing, etc.
- **Direct**: Typed URL or bookmarks
- **Social**: Facebook, LinkedIn, etc.
- **Referral**: Other websites linking to you
- **Paid search**: Google Ads, etc.

---

## 📊 **Setting Up Goals & Conversions**

### **Step 1: Create Conversion Events**

1. **Go to GA4** → **Admin** → **Events**
2. **Click "Create event"**
3. **Set up these events:**

#### **Trial Signup Goal**
- **Event name**: `trial_signup_attempt`
- **Description**: User clicked "Start Free Trial"
- **Mark as conversion**: ✅ Yes

#### **Demo Interest Goal**
- **Event name**: `demo_video_click`
- **Description**: User clicked "Watch Demo"
- **Mark as conversion**: ✅ Yes

#### **Pricing View Goal**
- **Event name**: `pricing_plan_view`
- **Description**: User viewed pricing section
- **Mark as conversion**: ✅ Yes

### **Step 2: Set Up Audiences**

1. **Go to GA4** → **Admin** → **Audiences**
2. **Click "New audience"**
3. **Create these audiences:**

#### **High-Intent Visitors**
- **Users who clicked "Start Free Trial"**
- **Users who viewed pricing plans**
- **Users who spent 2+ minutes on page**

#### **Demo Interested Users**
- **Users who clicked "Watch Demo"**
- **Users who scrolled to demo section**

---

## 📱 **Mobile & Device Tracking**

### **What We Track**
- **Device type**: Desktop, mobile, tablet
- **Operating system**: Windows, Mac, iOS, Android
- **Browser**: Chrome, Safari, Firefox, etc.
- **Screen resolution**: For responsive design insights

### **Mobile Optimization Insights**
- **Mobile bounce rate** vs desktop
- **Mobile conversion rate** vs desktop
- **Mobile page load speed**
- **Mobile user behavior patterns**

---

## 🔍 **Advanced Tracking Features**

### **Enhanced Ecommerce (Future)**
When you add paid plans:
- **Purchase tracking**
- **Revenue attribution**
- **Customer lifetime value**
- **Subscription metrics**

### **Custom Dimensions**
- **User type**: New vs returning
- **Traffic source**: Organic, paid, social
- **Content engagement**: High, medium, low
- **Geographic location**: City, state, country

---

## 📈 **Reporting & Analysis**

### **Real-Time Reports**
- **Live visitor count**
- **Current page views**
- **Active users by location**
- **Real-time events**

### **Standard Reports**
- **Audience**: Demographics, interests, behavior
- **Acquisition**: Traffic sources, campaigns
- **Engagement**: Page views, events, conversions
- **Monetization**: Revenue, purchases (when applicable)

### **Custom Reports**
- **Landing page performance**
- **CTA conversion funnel**
- **Traffic source analysis**
- **Mobile vs desktop comparison**

---

## 🚨 **Privacy & Compliance**

### **GDPR Compliance**
- **Cookie consent**: Add cookie banner if needed
- **Data retention**: Set appropriate periods
- **User rights**: Data deletion, portability
- **Privacy policy**: Update with analytics info

### **CCPA Compliance**
- **California residents**: Right to opt-out
- **Data disclosure**: What data you collect
- **Third-party sharing**: Google Analytics data

---

## 🛠️ **Troubleshooting**

### **Common Issues**

#### **Analytics Not Tracking**
- **Check Measurement ID**: Ensure it's correct
- **Verify code placement**: Should be in `<head>`
- **Test in incognito mode**: Avoid cached data
- **Check browser console**: Look for errors

#### **Events Not Firing**
- **Verify JavaScript**: Check for syntax errors
- **Test event triggers**: Click buttons manually
- **Check GA4 Real-time**: See if events appear
- **Wait 24-48 hours**: Some data takes time

#### **Low Data Quality**
- **Filter out bot traffic**: Use GA4 filters
- **Exclude internal traffic**: Your own visits
- **Set up goals properly**: Clear conversion paths
- **Regular data audits**: Check for anomalies

---

## 📊 **Expected Results After Setup**

### **Week 1-2: Baseline Data**
- **Traffic patterns**: Peak hours, days
- **User behavior**: How they navigate
- **Conversion rates**: Current performance
- **Traffic sources**: Where visitors come from

### **Month 1: Optimization Insights**
- **High-performing content**: What works
- **Conversion bottlenecks**: Where users drop off
- **Mobile optimization**: Mobile-specific issues
- **Traffic opportunities**: Untapped sources

### **Month 2-3: Performance Improvements**
- **Conversion rate**: 3-5% → 7-12%
- **Time on page**: +40-60%
- **Bounce rate**: -25-40%
- **Traffic quality**: Better qualified visitors

---

## 🎯 **Next Steps After Setup**

### **Immediate Actions**
1. **Replace placeholder ID** with your real Measurement ID
2. **Deploy updated files** to your website
3. **Test tracking** by visiting your site
4. **Verify events** in GA4 Real-time reports

### **Week 1: Monitoring**
1. **Check daily reports** for data quality
2. **Monitor conversion events** are firing
3. **Review traffic sources** and patterns
4. **Set up custom alerts** for important metrics

### **Month 1: Optimization**
1. **Analyze user behavior** patterns
2. **Identify conversion bottlenecks**
3. **A/B test different CTAs** and content
4. **Optimize for mobile** based on data

---

## 📞 **Need Help?**

### **Google Analytics Resources**
- **GA4 Help Center**: https://support.google.com/analytics
- **GA4 Academy**: https://analytics.google.com/analytics/academy/
- **Community Forum**: https://support.google.com/analytics/community

### **Common Questions**
- **"Why isn't my data showing?"** → Check Measurement ID and code placement
- **"How do I set up goals?"** → Use the Events section in GA4
- **"What's a good conversion rate?"** → 2-5% is average, 7%+ is excellent
- **"How often should I check reports?"** → Daily for first month, then weekly

---

**Ready to set up Google Analytics? Follow the steps above and you'll have comprehensive tracking for your Restaurant Business Planner landing page!** 📊

**Need help with any specific step?** Let me know and I can provide more detailed guidance!
