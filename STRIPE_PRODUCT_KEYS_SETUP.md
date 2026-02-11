# 🔑 How to Add Stripe Product Price IDs

This guide shows you exactly how to get your Stripe Price IDs and add them to your code.

---

## Step 1: Create Products in Stripe Dashboard

1. **Go to Stripe Dashboard**: https://dashboard.stripe.com
2. **Navigate to Products**: Click **Products** in the left sidebar
3. **Create 3 Products** (one for each subscription tier):

### Product 1: Professional Plan

1. Click **"+ Add product"** button
2. Fill in the details:
   - **Name**: `Professional Plan`
   - **Description**: `Full restaurant planning features`
   - **Pricing model**: Select **"Standard pricing"**
   - **Price**: `$29.00`
   - **Billing period**: Select **"Monthly"**
   - **Currency**: `USD`
3. Click **"Save product"**
4. **IMPORTANT**: After saving, you'll see the product page. Look for the **Price ID** (starts with `price_...`)
   - It will look like: `price_1ABC123def456ghi789jkl012mno345pqr`
   - **Copy this Price ID** - you'll need it!

### Product 2: Business Plan

1. Click **"+ Add product"** again
2. Fill in:
   - **Name**: `Business Plan`
   - **Description**: `Team collaboration features`
   - **Price**: `$99.00`
   - **Billing period**: `Monthly`
   - **Currency**: `USD`
3. Click **"Save product"**
4. **Copy the Price ID** (starts with `price_...`)

### Product 3: Enterprise Plan

1. Click **"+ Add product"** again
2. Fill in:
   - **Name**: `Enterprise Plan`
   - **Description**: `Advanced features with API access`
   - **Price**: `$299.00`
   - **Billing period**: `Monthly`
   - **Currency**: `USD`
3. Click **"Save product"**
4. **Copy the Price ID** (starts with `price_...`)

---

## Step 2: Find Your Price IDs

If you already created the products, here's how to find the Price IDs:

1. Go to **Products** in Stripe Dashboard
2. Click on a product (e.g., "Professional Plan")
3. You'll see a section called **"Pricing"**
4. Under the price, you'll see the **Price ID** (starts with `price_...`)
5. Click the **copy icon** next to the Price ID to copy it

**Example Price IDs look like:**
- `price_1ABC123def456ghi789jkl012mno345pqr`
- `price_1DEF456abc789xyz123ghi456jkl789mno`
- `price_1GHI789def012abc345xyz678jkl901mno`

---

## Step 3: Update Your Code

Now update the Price IDs in your code:

1. **Open** `src/services/stripe.js`
2. **Find** the `SUBSCRIPTION_PLANS` object (around line 10)
3. **Replace** the placeholder IDs with your actual Stripe Price IDs:

### For Professional Plan:

**Find this:**
```javascript
professional: {
  id: 'price_professional', // TODO: Replace with actual Stripe Price ID
  ...
}
```

**Replace with:**
```javascript
professional: {
  id: 'price_1ABC123def456ghi789jkl012mno345pqr', // Your actual Price ID
  ...
}
```

### For Business Plan:

**Find this:**
```javascript
business: {
  id: 'price_business', // TODO: Replace with actual Stripe Price ID
  ...
}
```

**Replace with:**
```javascript
business: {
  id: 'price_1DEF456abc789xyz123ghi456jkl789mno', // Your actual Price ID
  ...
}
```

### For Enterprise Plan:

**Find this:**
```javascript
enterprise: {
  id: 'price_enterprise', // TODO: Replace with actual Stripe Price ID
  ...
}
```

**Replace with:**
```javascript
enterprise: {
  id: 'price_1GHI789def012abc345xyz678jkl901mno', // Your actual Price ID
  ...
}
```

---

## Step 4: Verify Your Changes

After updating the Price IDs:

1. **Save** the file (`src/services/stripe.js`)
2. **Restart** your development server:
   ```bash
   # Stop the server (Ctrl+C) then:
   npm start
   ```
3. **Test** the checkout:
   - Go to your app's pricing page
   - Click "Subscribe" on any plan
   - You should be redirected to Stripe Checkout
   - Use test card: `4242 4242 4242 4242`

---

## ⚠️ Important Notes

### Test Mode vs Live Mode

- **Test Mode**: Use test Price IDs (created in Test Mode)
  - Price IDs from test mode work with `pk_test_...` keys
  - Use test cards like `4242 4242 4242 4242`
  
- **Live Mode**: Use live Price IDs (created in Live Mode)
  - Price IDs from live mode work with `pk_live_...` keys
  - These process real payments!

### Price ID vs Product ID

- ✅ **Use Price ID** (starts with `price_...`) - This is what you need!
- ❌ **Don't use Product ID** (starts with `prod_...`) - This won't work!

### Multiple Prices Per Product

If you create multiple prices for the same product (e.g., monthly and yearly), make sure you:
- Use the **Monthly** price ID for monthly subscriptions
- Each price has its own unique Price ID

---

## 🚨 Troubleshooting

### "Price ID not found" Error

- **Check**: Make sure you copied the **Price ID** (starts with `price_...`), not the Product ID
- **Check**: Verify the Price ID exists in your Stripe Dashboard
- **Check**: Make sure you're using test Price IDs with test keys (or live with live keys)

### Checkout Not Working

- **Check**: Make sure you updated all 3 Price IDs (Professional, Business, Enterprise)
- **Check**: Restart your development server after making changes
- **Check**: Verify your Stripe publishable key is set in `.env.local`

### Wrong Price Showing

- **Check**: Make sure the Price ID matches the correct product
- **Check**: Verify the price amount in Stripe Dashboard matches your code

---

## 📋 Quick Checklist

- [ ] Created 3 products in Stripe Dashboard (Professional, Business, Enterprise)
- [ ] Copied all 3 Price IDs from Stripe Dashboard
- [ ] Updated `id` field in `professional` plan in `src/services/stripe.js`
- [ ] Updated `id` field in `business` plan in `src/services/stripe.js`
- [ ] Updated `id` field in `enterprise` plan in `src/services/stripe.js`
- [ ] Saved the file
- [ ] Restarted development server
- [ ] Tested checkout with test card

---

## 🎯 Example: Complete Update

Here's what your updated code should look like:

```javascript
export const SUBSCRIPTION_PLANS = {
  free: {
    id: 'free',
    // ... free plan config
  },
  professional: {
    id: 'price_1ABC123def456ghi789jkl012mno345pqr', // ✅ Your actual Price ID
    name: 'Professional',
    price: 2900,
    // ... rest of config
  },
  business: {
    id: 'price_1DEF456abc789xyz123ghi456jkl789mno', // ✅ Your actual Price ID
    name: 'Business',
    price: 9900,
    // ... rest of config
  },
  enterprise: {
    id: 'price_1GHI789def012abc345xyz678jkl901mno', // ✅ Your actual Price ID
    name: 'Enterprise',
    price: 29900,
    // ... rest of config
  }
};
```

---

**That's it!** Once you've updated all three Price IDs, your Stripe integration will be fully configured. 🎉


