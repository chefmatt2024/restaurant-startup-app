# 🤖 AI Service - Firebase Functions Setup Guide

**Problem Fixed:** CORS errors when calling OpenAI API directly from browser  
**Solution:** Route AI calls through Firebase Cloud Functions

---

## ✅ **What Was Changed**

1. **Created Firebase Function** (`functions/index.js`)
   - New function: `generateAICompletion`
   - Securely proxies AI API calls
   - Protects API keys (never exposed to client)

2. **Updated AI Service** (`src/services/aiService.js`)
   - Now calls Firebase Functions instead of OpenAI directly
   - No more CORS errors
   - Better error handling

---

## 🔧 **Setup Instructions**

### **Step 1: Add OpenAI API Key to Firebase Functions**

You need to configure your OpenAI API key in Firebase Functions (NOT in client code).

**Option A: Using New Params API (Recommended - Future-proof)**

```bash
# Set OpenAI API key using new params API
firebase functions:secrets:set OPENAI_API_KEY

# When prompted, paste your API key: sk-proj-YOUR_API_KEY_HERE
```

**Option B: Using Legacy Config (Works but deprecated)**

```bash
# Set OpenAI API key (legacy method - will be deprecated in 2026)
firebase functions:config:set openai.api_key="sk-proj-YOUR_API_KEY_HERE"

# Or set Anthropic key if using Claude
firebase functions:config:set anthropic.api_key="YOUR_ANTHROPIC_KEY_HERE"

# Set provider (optional, defaults to 'openai')
firebase functions:config:set ai.provider="openai"
```

**Option C: Environment Variables (For Local Development)**

Create `.env` file in `functions/` directory:
```
OPENAI_API_KEY=sk-proj-YOUR_API_KEY_HERE
AI_PROVIDER=openai
```

**Note:** The function supports both new params API and legacy config for compatibility.

---

### **Step 2: Deploy Firebase Functions**

**Important:** You need to be on the **Blaze (pay-as-you-go) plan** to deploy functions.

```bash
# Deploy the new AI function
firebase deploy --only functions:generateAICompletion
```

**Or deploy all functions:**
```bash
firebase deploy --only functions
```

---

### **Step 3: Verify It Works**

1. Open your app
2. Try using an AI feature (e.g., Market Analysis AI research)
3. Check browser console - should see no CORS errors
4. AI should work properly

---

## 🔐 **Security Benefits**

✅ **API Key Protection:**
- API keys stored securely in Firebase Functions config
- Never exposed to client-side code
- Can't be viewed in browser DevTools

✅ **CORS Fixed:**
- No more CORS errors
- Functions can call external APIs
- Proper error handling

✅ **Authentication:**
- Only authenticated users can use AI features
- Rate limiting possible at function level

---

## 📋 **Current Configuration**

**Function Name:** `generateAICompletion`  
**Type:** Callable Function (Firebase Functions v2)  
**Authentication:** Required  
**Provider:** OpenAI (configurable)

---

## 🚨 **If You Get Errors**

### **Error: "AI API key not configured"**
→ Add API key to Firebase Functions config (see Step 1)

### **Error: "Functions not deployed"**
→ Deploy functions (see Step 2)

### **Error: "Blaze plan required"**
→ Upgrade Firebase project to Blaze plan:
   - Go to: https://console.firebase.google.com/project/restaurant-startup-app/usage/details
   - Click "Upgrade" to Blaze plan

### **Error: "User must be authenticated"**
→ User needs to be signed in to use AI features

---

## 💡 **Testing Locally (Optional)**

If you want to test functions locally before deploying:

```bash
# Install Firebase CLI tools
npm install -g firebase-tools

# Start emulator
firebase emulators:start --only functions

# In another terminal, set local config
firebase functions:config:get > .runtimeconfig.json
# Edit .runtimeconfig.json to add your API key
```

---

## 📝 **Next Steps**

1. ✅ Add OpenAI API key to Firebase Functions config
2. ✅ Deploy Firebase Functions
3. ✅ Test AI features in the app
4. ✅ Verify no CORS errors in browser console

---

**Once configured, all AI features will work without CORS errors!** 🎉

