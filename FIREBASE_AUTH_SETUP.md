# Firebase Authentication Setup Guide

## 🚨 Current Error: `auth/operation-not-allowed`

This error occurs because **Email/Password authentication is not enabled** in your Firebase Console.

## 🔧 Quick Fix: Enable Authentication Methods

### Step 1: Access Firebase Console
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `restaurant-startup-app`

### Step 2: Enable Email/Password Authentication
1. In the left sidebar, click **Authentication**
2. Click **Sign-in method** tab
3. Find **Email/Password** in the list and click on it
4. Toggle **Enable** to ON
5. Optionally enable **Email link (passwordless sign-in)**
6. Click **Save**

### Step 3: Enable Google Authentication (Optional)
1. In the same **Sign-in method** tab
2. Find **Google** in the list and click on it
3. Toggle **Enable** to ON
4. Set **Project support email** (required)
5. Click **Save**

### Step 4: Add Authorized Domains
1. In Firebase Console > Authentication > Settings
2. Add your domains to **Authorized domains**:
   - `localhost` (for development)
   - Your production domain (when deployed)

## 🧪 Test Authentication

After enabling the authentication methods:

1. **Email/Password Registration**:
   - Click "Sign Up with Email" in the app
   - Enter email and password
   - Should create account successfully

2. **Google Sign-In**:
   - Click "Sign in with Google"
   - Google popup should appear
   - Sign in with Google account

3. **Anonymous Sign-In**:
   - Click "Try Anonymously"
   - Should work immediately

## 🔍 Common Authentication Errors

### `auth/operation-not-allowed`
- **Cause**: Authentication method not enabled in Firebase Console
- **Fix**: Enable the specific authentication method in Firebase Console

### `auth/email-already-in-use`
- **Cause**: Email already registered
- **Fix**: Use "Sign In" instead of "Register" or reset password

### `auth/weak-password`
- **Cause**: Password too weak
- **Fix**: Use a stronger password (6+ characters)

### `auth/invalid-email`
- **Cause**: Invalid email format
- **Fix**: Enter a valid email address

### `auth/user-not-found`
- **Cause**: User doesn't exist
- **Fix**: Register first or check email spelling

### `auth/wrong-password`
- **Cause**: Incorrect password
- **Fix**: Check password or use "Forgot Password"

## 🛠️ Firebase Console Checklist

Make sure these are enabled in Firebase Console > Authentication > Sign-in method:

- ✅ **Email/Password** - For email registration/login
- ✅ **Google** - For Google sign-in
- ✅ **Anonymous** - For anonymous users (usually enabled by default)

## 📱 Development vs Production

### Development (localhost:3000)
- Add `localhost` to authorized domains
- Use development Firebase config

### Production
- Add your production domain to authorized domains
- Use production Firebase config
- Configure OAuth consent screen for Google

## 🔧 Troubleshooting

### If authentication still doesn't work:

1. **Check Firebase Project ID**:
   ```javascript
   // In src/services/firebase.js
   projectId: "restaurant-startup-app"
   ```

2. **Verify API Key**:
   ```javascript
   // Make sure API key is correct
   apiKey: "AIzaSyDfEzba9busszEbikxRTqWvRTvNRTYe58k"
   ```

3. **Check Console Logs**:
   - Look for Firebase initialization messages
   - Check for authentication errors

4. **Test in Incognito Mode**:
   - Sometimes browser cache causes issues

## 🚀 Next Steps

After enabling authentication:

1. Test all authentication methods
2. Create a test user account
3. Verify data is saved under the user
4. Test sign out and sign back in

---

**The main issue is that Email/Password authentication needs to be enabled in the Firebase Console. Once enabled, the error should be resolved.**
