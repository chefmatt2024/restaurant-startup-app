# 🔍 How to Find Your Stripe Price IDs

## ⚠️ Important: Product ID vs Price ID

- ❌ **Product ID** starts with `prod_...` - This is what you currently have
- ✅ **Price ID** starts with `price_...` - This is what you need!

## Step-by-Step: Finding Price IDs

### 1. Go to Stripe Dashboard
- Visit: https://dashboard.stripe.com
- Make sure you're in **Test Mode** (toggle in top right)

### 2. Navigate to Products
- Click **"Products"** in the left sidebar

### 3. Open Each Product
Click on each product one by one:

#### For Professional Plan:
1. Click on **"Professional Plan"** product
2. On the product page, scroll down to the **"Pricing"** section
3. You'll see a price listed (e.g., "$29.00 / month")
4. Next to the price, there's a **Price ID** that starts with `price_...`
5. Click the **copy icon** 📋 next to the Price ID
6. **Example**: `price_1ABC123def456ghi789...`

#### For Business Plan:
1. Click on **"Business Plan"** product
2. Find the **"Pricing"** section
3. Copy the **Price ID** (starts with `price_...`)

#### For Enterprise Plan:
1. Click on **"Enterprise Plan"** product
2. Find the **"Pricing"** section
3. Copy the **Price ID** (starts with `price_...`)

## What It Looks Like

In Stripe Dashboard, you'll see something like:

```
Product: Professional Plan
├── Product ID: prod_Tiqq2wvMC285X7  ← ❌ Don't use this
└── Pricing:
    └── $29.00 / month
        └── Price ID: price_1ABC123xyz...  ← ✅ Use this!
```

## Update Your Code

Once you have the 3 Price IDs, update `src/services/stripe.js`:

```javascript
professional: {
  id: 'price_1ABC123xyz...', // ✅ Your Price ID here
  ...
},
business: {
  id: 'price_1DEF456abc...', // ✅ Your Price ID here
  ...
},
enterprise: {
  id: 'price_1GHI789def...', // ✅ Your Price ID here
  ...
}
```

## Quick Check

✅ Price ID starts with `price_`  
❌ Product ID starts with `prod_` (wrong!)


