# 🚀 Deployment Steps

## Step 1: Login to Firebase

Run this command in your terminal:
```bash
firebase login --reauth
```

This will open a browser window for you to authenticate.

---

## Step 2: Set Stripe Secret Key (If Not Already Set)

You need your Stripe **Secret Key** (starts with `sk_live_...` or `sk_test_...`)

Get it from: https://dashboard.stripe.com/apikeys

Then run:
```bash
firebase functions:config:set stripe.secret_key="sk_live_your_secret_key_here"
```

**Note:** Replace `sk_live_your_secret_key_here` with your actual secret key.

---

## Step 3: Deploy Everything

### Option A: Deploy All at Once
```bash
firebase deploy
```

### Option B: Deploy Separately

**Deploy Hosting (React App):**
```bash
firebase deploy --only hosting:app
```

**Deploy Functions:**
```bash
firebase deploy --only functions
```

**Deploy Both:**
```bash
firebase deploy --only hosting:app,functions
```

---

## Step 4: Verify Deployment

After deployment, check:
1. **Hosting**: Visit `https://restaurant-startup-app.web.app`
2. **Functions**: Check Firebase Console → Functions

---

## Troubleshooting

### "Authentication Error"
- Run: `firebase login --reauth`

### "Functions deploy failed"
- Make sure Stripe secret key is set: `firebase functions:config:get`
- Check functions code: `cd functions && npm install`

### "Hosting deploy failed"
- Make sure build folder exists: `npm run build`
- Check firebase.json configuration

---

## Current Status

✅ **Build Complete** - React app built successfully  
⏳ **Waiting for** - Firebase login and Stripe secret key setup  
⏳ **Ready to Deploy** - Hosting and Functions


