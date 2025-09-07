# 🚀 Quick Fix: Enable Firebase Authentication

## The Problem
You're getting this error: `auth/operation-not-allowed`

This means **Email/Password authentication is not enabled** in your Firebase Console.

## ⚡ Quick Solution (2 minutes)

### Step 1: Open Firebase Console
1. Go to: https://console.firebase.google.com/
2. Click on your project: **restaurant-startup-app**

### Step 2: Enable Authentication
1. In the left sidebar, click **"Authentication"**
2. Click the **"Sign-in method"** tab
3. Find **"Email/Password"** and click on it
4. Toggle **"Enable"** to **ON**
5. Click **"Save"**

### Step 3: Enable Google (Optional)
1. In the same **"Sign-in method"** tab
2. Find **"Google"** and click on it
3. Toggle **"Enable"** to **ON**
4. Set **"Project support email"** (use your email)
5. Click **"Save"**

### Step 4: Add Localhost Domain
1. In Authentication > **"Settings"** tab
2. Scroll down to **"Authorized domains"**
3. Add: `localhost`
4. Click **"Add domain"**

## ✅ Test It
1. Refresh your app
2. Try creating a new user with email/password
3. Should work now!

## 🔧 If Still Not Working

### Check Your Firebase Config
Make sure this matches in your Firebase Console:
- **Project ID**: `restaurant-startup-app`
- **API Key**: `AIzaSyDfEzba9busszEbikxRTqWvRTvNRTYe58k`

### Alternative: Use Google Sign-In
If email/password still doesn't work, try the **"Sign in with Google"** button - it should work once Google is enabled.

### Alternative: Use Anonymous Mode
Click **"Try Anonymously"** to explore the app without creating an account.

---

**That's it! The main issue is just enabling the authentication methods in Firebase Console.**


