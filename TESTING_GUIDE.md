# 🧪 Complete Testing Guide - Step by Step

**Follow these steps in order to test everything before launch.**

---

## ✅ **TEST 1: Landing Page → Signup Flow** (3 minutes)

### Step 1.1: Visit Landing Page
1. Open your browser (use incognito/private mode for clean test)
2. Go to: `iterumfoods.xyz/restauranteur-app`
3. ✅ **Check:** Landing page loads correctly
4. ✅ **Check:** "Start Free Trial" button is visible

### Step 1.2: Click CTA Button
1. Click the "Start Free Trial" button
2. ✅ **Check:** Page redirects to `https://restaurant-startup-app.web.app`
3. ✅ **Check:** Auth flow appears automatically (signup form)

### Step 1.3: Sign Up
1. Use a test email (e.g., `test+1@example.com`)
2. Enter password (at least 6 characters)
3. Accept Terms & Privacy
4. Click "Sign Up"
5. ✅ **Check:** Account created successfully
6. ✅ **Check:** Dashboard loads

### Step 1.4: Verify Welcome Tour
1. ✅ **Check:** Welcome Tour appears (only ONE screen)
2. ✅ **Check:** Tour has multiple steps
3. Click through or skip the tour
4. ✅ **Check:** Dashboard is accessible after tour

**Expected Result:** ✅ Smooth flow from landing → signup → dashboard

---

## ✅ **TEST 2: Conversion Tracking** (2 minutes)

### Step 2.1: Open Google Analytics
1. Go to: https://analytics.google.com
2. Select your property (G-YEMZ8XZT7S)
3. Navigate to: **Reports** → **Real-Time** → **Events**

### Step 2.2: Test Event Tracking
1. In a new tab, visit: `iterumfoods.xyz/restauranteur-app`
2. Click "Start Free Trial" button
3. Go back to Google Analytics Real-Time
4. ✅ **Check:** Event appears within 30 seconds:
   - Event name: `click`
   - Event category: `CTA`
   - Event label: `Start Free Trial`

**Expected Result:** ✅ Event tracked in GA4 Real-Time

---

## ✅ **TEST 3: Core Features** (5 minutes)

### Step 3.1: Create Draft
1. In dashboard, click "Create New Draft" (if available)
2. Or navigate to "Idea Formation" tab
3. Enter restaurant concept name
4. ✅ **Check:** Data saves automatically

### Step 3.2: Test Financial Projections
1. Navigate to "Financials" tab
2. Enter restaurant operations:
   - Number of seats: `60`
   - Average check (dinner): `45`
   - Hours of operation
3. ✅ **Check:** Calculations appear
4. ✅ **Check:** Daily sales projections populate

### Step 3.3: Test Data Persistence
1. Refresh the page (F5)
2. ✅ **Check:** Data is still there
3. ✅ **Check:** No errors in console

**Expected Result:** ✅ All features work, data persists

---

## ✅ **TEST 4: Mobile Testing** (5 minutes)

### Step 4.1: Test on Mobile Device
1. Open landing page on your phone
2. ✅ **Check:** Page loads correctly
3. ✅ **Check:** "Start Free Trial" button is visible and clickable
4. Click the button
5. ✅ **Check:** Redirects to app
6. ✅ **Check:** Signup form is usable on mobile

### Step 4.2: Test App on Mobile
1. Sign up on mobile (or use existing account)
2. ✅ **Check:** Dashboard loads
3. ✅ **Check:** Navigation works
4. ✅ **Check:** Forms are usable
5. ✅ **Check:** No horizontal scrolling

**Expected Result:** ✅ Mobile experience is smooth

---

## ✅ **TEST 5: Trial System** (3 minutes)

### Step 5.1: Verify Trial Started
1. Sign up as new user
2. ✅ **Check:** 5-day trial starts automatically
3. ✅ **Check:** Trial banner appears (if applicable)
4. ✅ **Check:** Full access to all features

### Step 5.2: Test Trial Reminders
1. ✅ **Check:** Trial expiration banner appears (if trial is active)
2. ✅ **Check:** "Upgrade Now" button works
3. ✅ **Check:** Links to pricing page

**Expected Result:** ✅ Trial system works correctly

---

## ✅ **TEST 6: Error Handling** (2 minutes)

### Step 6.1: Test Invalid Signup
1. Try to sign up with invalid email
2. ✅ **Check:** Error message appears
3. Try to sign up with weak password
4. ✅ **Check:** Error message appears

### Step 6.2: Test Network Error
1. Disconnect internet
2. Try to save data
3. ✅ **Check:** Error message appears (user-friendly)
4. Reconnect internet
5. ✅ **Check:** Data saves when reconnected

**Expected Result:** ✅ Error messages are user-friendly

---

## 📋 **TEST RESULTS CHECKLIST**

After completing all tests, mark what passed:

- [ ] **Test 1:** Landing Page → Signup Flow
- [ ] **Test 2:** Conversion Tracking
- [ ] **Test 3:** Core Features
- [ ] **Test 4:** Mobile Testing
- [ ] **Test 5:** Trial System
- [ ] **Test 6:** Error Handling

---

## 🐛 **IF TESTS FAIL**

### Landing Page Issues
- Check browser console for errors
- Verify landing page URL is correct
- Check if buttons are visible

### Signup Issues
- Check Firebase console for errors
- Verify authentication is enabled
- Check network connection

### Tracking Issues
- Verify GA4 measurement ID is correct
- Check if gtag is loaded (inspect page source)
- Wait 30-60 seconds for events to appear

### Feature Issues
- Check browser console for errors
- Verify Firebase Firestore is enabled
- Check if data is saving in Firebase console

---

## ✅ **READY TO LAUNCH IF:**

- ✅ All 6 tests pass
- ✅ No critical errors
- ✅ Mobile experience acceptable
- ✅ Data saves correctly

---

**Start with Test 1 and work through each one!** 🚀


