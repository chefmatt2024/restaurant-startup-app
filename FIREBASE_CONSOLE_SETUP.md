# 🚨 URGENT: Firebase Authentication Setup Required

## Current Issue
Both Google and Email/Password authentication are failing with `auth/operation-not-allowed` because **authentication methods are not enabled** in Firebase Console.

## ⚡ IMMEDIATE FIX (5 minutes)

### Step 1: Access Firebase Console
1. Go to: **https://console.firebase.google.com/**
2. Click on your project: **restaurant-startup-app**

### Step 2: Enable Email/Password Authentication
1. In left sidebar → **Authentication**
2. Click **Sign-in method** tab
3. Find **Email/Password** → Click it
4. Toggle **Enable** to **ON**
5. Click **Save**

### Step 3: Enable Google Authentication
1. In same **Sign-in method** tab
2. Find **Google** → Click it
3. Toggle **Enable** to **ON**
4. Set **Project support email** (your email)
5. Click **Save**

### Step 4: Add Authorized Domains
1. Go to **Authentication** → **Settings** tab
2. Scroll to **Authorized domains**
3. Add: `localhost`
4. Click **Add domain**

### Step 5: Verify Configuration
Your Firebase Console should show:
- ✅ **Email/Password**: Enabled
- ✅ **Google**: Enabled
- ✅ **Authorized domains**: localhost

## 🧪 Test After Setup
1. Refresh your app
2. Try **Google sign-in** - should work
3. Try **Email registration** - should work
4. Try **Anonymous** - should work

## 🔧 If Still Not Working

### Check Project ID Match
Verify in Firebase Console that:
- **Project ID**: `restaurant-startup-app`
- **API Key**: `AIzaSyDfEzba9busszEbikxRTqWvRTvNRTYe58k`

### Check OAuth Consent Screen (for Google)
1. Go to: **https://console.cloud.google.com/**
2. Select project: **restaurant-startup-app**
3. Go to **APIs & Services** → **OAuth consent screen**
4. Configure with your email
5. Add `localhost` to authorized domains

## 🚀 Alternative: Use Offline Mode
If you can't access Firebase Console right now, the app will fall back to offline mode where:
- Anonymous users work immediately
- Data is saved locally
- No authentication required

---

**The main issue is that authentication methods need to be enabled in Firebase Console. This is a one-time setup that takes 5 minutes.**
