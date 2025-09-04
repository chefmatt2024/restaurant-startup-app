# Google Authentication Setup Guide

## ✅ Google Authentication is Already Configured in Code

The Google authentication is already properly implemented in the codebase:

### 1. **Firebase Configuration**
- ✅ Google Auth Provider imported
- ✅ Sign-in with popup implemented
- ✅ Proper scopes (email, profile) configured
- ✅ Error handling added

### 2. **UI Components**
- ✅ Google sign-in button in UserLoginScreen
- ✅ Error handling and user feedback
- ✅ Proper async/await implementation

## 🔧 Firebase Console Setup Required

To enable Google authentication, you need to configure it in the Firebase Console:

### Step 1: Access Firebase Console
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `restaurant-startup-app`

### Step 2: Enable Google Authentication
1. In the left sidebar, click **Authentication**
2. Click **Sign-in method** tab
3. Find **Google** in the list and click on it
4. Toggle **Enable** to ON
5. Set **Project support email** (required)
6. Click **Save**

### Step 3: Configure OAuth Consent Screen (if needed)
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project: `restaurant-startup-app`
3. Go to **APIs & Services** > **OAuth consent screen**
4. Configure the consent screen with:
   - App name: "Restaurant Business Planning App"
   - User support email: Your email
   - Developer contact: Your email
5. Add your domain to authorized domains if needed

### Step 4: Add Authorized Domains
1. In Firebase Console > Authentication > Settings
2. Add your domains to **Authorized domains**:
   - `localhost` (for development)
   - Your production domain (when deployed)

## 🧪 Testing Google Authentication

### Development Testing
1. Start the app: `npm start`
2. Click "Sign in with Google" button
3. Google popup should appear
4. Sign in with your Google account
5. User should be authenticated and redirected to dashboard

### Common Issues & Solutions

#### Issue: "This app is not verified"
- **Solution**: This is normal for development. Click "Advanced" > "Go to [app name] (unsafe)"

#### Issue: "Error 400: redirect_uri_mismatch"
- **Solution**: Add `http://localhost:3000` to authorized domains in Firebase Console

#### Issue: "Access blocked: This app's request is invalid"
- **Solution**: Check OAuth consent screen configuration in Google Cloud Console

#### Issue: "Firebase not enabled"
- **Solution**: Check Firebase configuration and ensure the project is properly set up

## 🔍 Debugging

### Check Console Logs
The app now includes detailed logging:
- `"Attempting Google sign-in with Firebase..."` - Firebase is enabled
- `"Firebase not enabled, using offline mode"` - Using offline mode
- `"Google sign-in successful: [email]"` - Success
- `"Google sign-in error: [error]"` - Error details

### Verify Firebase Configuration
Check that your Firebase config includes:
```javascript
{
  apiKey: "AIzaSyDfEzba9busszEbikxRTqWvRTvNRTYe58k",
  authDomain: "restaurant-startup-app.firebaseapp.com",
  projectId: "restaurant-startup-app",
  // ... other config
}
```

## 🚀 Production Deployment

When deploying to production:
1. Add your production domain to Firebase authorized domains
2. Update OAuth consent screen with production domain
3. Test Google authentication on production URL

## 📱 Mobile Considerations

For mobile apps, you may need to:
1. Configure iOS/Android OAuth clients
2. Add bundle IDs to Firebase project
3. Download configuration files

---

**Note**: The code is ready for Google authentication. The main requirement is enabling it in the Firebase Console as described above.
