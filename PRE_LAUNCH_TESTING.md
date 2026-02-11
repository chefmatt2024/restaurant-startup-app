# 🧪 Pre-Launch Testing Checklist

**Date:** Today  
**Status:** Ready to Test

---

## ✅ **TESTING CHECKLIST**

### 1. **Landing Page → App Flow** 🔗
**Test:** Complete user journey from landing page to dashboard

**Steps:**
- [ ] Visit `iterumfoods.xyz/restauranteur-app` (or your landing page URL)
- [ ] Click "Start Free Trial" button
- [ ] Verify redirects to `https://restaurant-startup-app.web.app`
- [ ] Verify auth flow appears automatically
- [ ] Sign up with test email (e.g., `test@example.com`)
- [ ] Accept Terms & Privacy
- [ ] Verify 5-day trial starts
- [ ] Verify Welcome Tour appears
- [ ] Verify Dashboard loads successfully

**Expected Result:** Smooth flow from landing page → signup → dashboard

---

### 2. **Conversion Tracking** 📊
**Test:** Verify Google Analytics is tracking conversions

**Steps:**
- [ ] Open Google Analytics Real-Time view
  - Go to: https://analytics.google.com
  - Navigate to: Reports → Real-Time → Events
- [ ] Visit landing page
- [ ] Click "Start Free Trial" button
- [ ] Check GA4 Real-Time for event:
  - Event name: `click`
  - Event category: `CTA`
  - Event label: `Start Free Trial`

**Expected Result:** Event appears in Real-Time within 30 seconds

---

### 3. **Authentication Flow** 🔐
**Test:** Verify signup and login work correctly

**New User Signup:**
- [ ] Visit app directly: `https://restaurant-startup-app.web.app`
- [ ] Verify auth flow appears
- [ ] Sign up with new email
- [ ] Verify Terms & Privacy acceptance required
- [ ] Verify 5-day trial starts automatically
- [ ] Verify Welcome Tour appears
- [ ] Verify Getting Started Checklist appears

**Returning User Login:**
- [ ] Sign out
- [ ] Visit app again
- [ ] Verify login form appears
- [ ] Sign in with existing account
- [ ] Verify dashboard loads
- [ ] Verify data persists

---

### 4. **Core Features** ⚙️
**Test:** Verify all core features work

**Business Plan:**
- [ ] Create new draft
- [ ] Fill in restaurant concept
- [ ] Save data
- [ ] Verify auto-save works
- [ ] Refresh page
- [ ] Verify data persists

**Financial Projections:**
- [ ] Navigate to Financials tab
- [ ] Enter restaurant operations data
- [ ] Verify calculations work
- [ ] Test scenario manager
- [ ] Test monthly statement

**Other Features:**
- [ ] Test menu builder
- [ ] Test equipment planning
- [ ] Test vendor management
- [ ] Test export functionality

---

### 5. **Trial Expiration Banner** ⏰
**Test:** Verify trial reminders work

**Steps:**
- [ ] Sign up as new user
- [ ] Verify trial banner appears (if applicable)
- [ ] Check days remaining display
- [ ] Click "Upgrade Now" button
- [ ] Verify redirects to pricing page

**Note:** Banner only shows for trial users. May need to manually set trial end date for testing.

---

### 6. **Mobile Testing** 📱
**Test:** Verify mobile experience

**Steps:**
- [ ] Open landing page on mobile device
- [ ] Verify responsive design
- [ ] Click "Start Free Trial" button
- [ ] Verify signup flow works on mobile
- [ ] Test core features on mobile
- [ ] Verify touch interactions work

---

### 7. **Error Handling** ⚠️
**Test:** Verify error messages are user-friendly

**Steps:**
- [ ] Try to sign in with wrong password
- [ ] Verify error message appears
- [ ] Try to access protected route without auth
- [ ] Verify redirects to signup
- [ ] Test network error handling (disconnect internet)
- [ ] Verify graceful error messages

---

## 🐛 **KNOWN ISSUES TO CHECK**

### Stripe Functions (If Testing Payments)
- [ ] If testing payments, verify Firebase Functions are deployed
- [ ] If not deployed, verify user-friendly error messages appear
- [ ] Test upgrade flow (should show helpful message if functions not deployed)

**Current Status:** Functions not deployed (requires Blaze plan)
**Expected Behavior:** User-friendly message: "Payment processing is currently unavailable. Please upgrade to a paid plan later, or contact support if you need immediate access."

---

## ✅ **PASS/FAIL CRITERIA**

### **READY TO LAUNCH IF:**
- ✅ Landing page → app flow works
- ✅ Signup works correctly
- ✅ 5-day trial starts automatically
- ✅ Core features functional
- ✅ Data saves correctly
- ✅ Mobile experience acceptable
- ✅ Error messages user-friendly

### **NOT READY IF:**
- ❌ Signup broken
- ❌ Trial not starting
- ❌ Data not saving
- ❌ Critical features broken
- ❌ Mobile experience broken

---

## 📝 **TEST RESULTS**

**Date Tested:** _______________

**Tester:** _______________

**Results:**
- Landing Page Flow: [ ] Pass [ ] Fail
- Conversion Tracking: [ ] Pass [ ] Fail
- Authentication: [ ] Pass [ ] Fail
- Core Features: [ ] Pass [ ] Fail
- Mobile: [ ] Pass [ ] Fail
- Error Handling: [ ] Pass [ ] Fail

**Notes:**
_________________________________
_________________________________
_________________________________

---

## 🚀 **NEXT STEPS AFTER TESTING**

1. **If All Tests Pass:**
   - ✅ You're ready to launch!
   - Share landing page URL
   - Start accepting users

2. **If Tests Fail:**
   - Document issues
   - Fix critical bugs
   - Re-test
   - Then launch

3. **Post-Launch:**
   - Monitor Google Analytics
   - Watch for user feedback
   - Fix any issues quickly
   - Add payments next week

---

## 🎯 **QUICK TEST COMMANDS**

**Test Landing Page Locally:**
```bash
npm start
# Visit: http://localhost:3000/landing
```

**Test App Locally:**
```bash
npm start
# Visit: http://localhost:3000
```

**Check Google Analytics:**
- URL: https://analytics.google.com
- Navigate to: Reports → Real-Time → Events

---

**Ready to test?** Follow the checklist above and mark off each item as you complete it!


