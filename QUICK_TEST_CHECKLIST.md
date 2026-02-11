# ✅ Quick Test Checklist - Run These Now!

**Time:** ~15 minutes total

---

## 🎯 **TEST 1: Landing Page → Signup** (3 min)

### What to Do:
1. **Open browser in incognito/private mode** (for clean test)
2. **Visit:** `iterumfoods.xyz/restauranteur-app` (your external landing page)
   - OR test the React landing page: `https://restaurant-startup-app.web.app/landing`
3. **Click:** "Start Free Trial" button
4. **Check:** Should redirect to `https://restaurant-startup-app.web.app`
5. **Check:** Signup form appears automatically

### Sign Up:
1. **Email:** Use `test+[yourname]@example.com` (e.g., `test+john@example.com`)
2. **Password:** At least 6 characters
3. **Accept:** Terms & Privacy
4. **Click:** "Sign Up"

### What Should Happen:
- ✅ Account created
- ✅ Dashboard loads
- ✅ **ONLY ONE welcome screen appears** (the interactive tour)
- ✅ Tour has multiple steps

**✅ PASS / ❌ FAIL:** _______________

---

## 📊 **TEST 2: Conversion Tracking** (2 min)

### What to Do:
1. **Open:** https://analytics.google.com
2. **Navigate to:** Reports → Real-Time → Events
3. **In new tab:** Visit `iterumfoods.xyz/restauranteur-app`
4. **Click:** "Start Free Trial" button
5. **Go back to GA4:** Wait 30 seconds

### What to Check:
- ✅ Event appears in Real-Time:
  - Event: `click`
  - Category: `CTA`
  - Label: `Start Free Trial`

**✅ PASS / ❌ FAIL:** _______________

---

## ⚙️ **TEST 3: Core Features** (5 min)

### What to Do:
1. **In dashboard:** Navigate to "Idea Formation" tab
2. **Enter:** Restaurant concept name (e.g., "Test Restaurant")
3. **Navigate to:** "Financials" tab
4. **Enter:**
   - Seats: `60`
   - Average check (dinner): `45`
   - Hours of operation: `5 PM - 10 PM`
5. **Check:** Calculations appear
6. **Check:** Daily sales projections show numbers (not zero)
7. **Refresh page** (F5)
8. **Check:** Data is still there

**✅ PASS / ❌ FAIL:** _______________

---

## 📱 **TEST 4: Mobile** (5 min)

### What to Do:
1. **Open on phone:** `iterumfoods.xyz/restauranteur-app`
2. **Check:** Page loads correctly
3. **Click:** "Start Free Trial" button
4. **Check:** Redirects to app
5. **Check:** Signup form is usable
6. **Sign up** (or sign in if already have account)
7. **Check:** Dashboard loads
8. **Check:** Navigation works
9. **Check:** No horizontal scrolling

**✅ PASS / ❌ FAIL:** _______________

---

## ⏰ **TEST 5: Trial System** (2 min)

### What to Do:
1. **Sign up as new user** (if not already)
2. **Check:** 5-day trial started automatically
3. **Check:** Trial banner appears at top (if trial is active)
4. **Click:** "Upgrade Now" button (if visible)
5. **Check:** Links to pricing page

**✅ PASS / ❌ FAIL:** _______________

---

## ⚠️ **TEST 6: Error Handling** (2 min)

### What to Do:
1. **Try invalid signup:**
   - Email: `invalid-email`
   - **Check:** Error message appears
2. **Try weak password:**
   - Password: `123`
   - **Check:** Error message appears
3. **Try correct signup:**
   - Valid email and password
   - **Check:** Works correctly

**✅ PASS / ❌ FAIL:** _______________

---

## 📋 **FINAL RESULTS**

Mark each test:
- [ ] Test 1: Landing Page → Signup
- [ ] Test 2: Conversion Tracking
- [ ] Test 3: Core Features
- [ ] Test 4: Mobile
- [ ] Test 5: Trial System
- [ ] Test 6: Error Handling

---

## 🚀 **READY TO LAUNCH IF:**

✅ All 6 tests pass  
✅ No critical errors  
✅ Mobile works  
✅ Data saves  

---

## 🐛 **IF SOMETHING FAILS:**

### Landing Page Not Working?
- Check: Is `iterumfoods.xyz/restauranteur-app` the correct URL?
- Try: `https://restaurant-startup-app.web.app/landing` instead

### Signup Not Working?
- Check: Browser console for errors (F12)
- Check: Firebase console for errors
- Try: Different email address

### Tracking Not Working?
- Wait: 30-60 seconds for events to appear
- Check: GA4 measurement ID is `G-YEMZ8XZT7S`
- Check: gtag is loaded (view page source, search for "gtag")

### Features Not Working?
- Check: Browser console for errors (F12)
- Check: Network tab for failed requests
- Try: Refresh page

---

**Start with Test 1 and work through each one!** ✅


