# Stripe Setup Guide

## 🔧 **Environment Variables Setup**

Create a `.env` file in your project root with the following variables:

```bash
# Firebase Configuration (already configured)
REACT_APP_FIREBASE_API_KEY=your_api_key_here
REACT_APP_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id

# Stripe Configuration (NEW)
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here

# App Configuration
REACT_APP_APP_NAME="Restaurant Startup Planner"
REACT_APP_VERSION="1.0.0"
```

## 🏗️ **Stripe Account Setup**

### 1. Create Stripe Account
- Go to [stripe.com](https://stripe.com)
- Sign up for a free account
- Complete business verification

### 2. Get API Keys
- Go to Developers → API Keys
- Copy your **Publishable key** (starts with `pk_test_`)
- Copy your **Secret key** (starts with `sk_test_`) - Keep this secure!

### 3. Create Products in Stripe Dashboard

#### Professional Plan ($29/month)
```
Product Name: Professional Plan
Description: Full restaurant planning features
Price: $29.00 USD
Billing: Monthly
Price ID: price_professional (note this ID)
```

#### Business Plan ($99/month)
```
Product Name: Business Plan  
Description: Team collaboration features
Price: $99.00 USD
Billing: Monthly
Price ID: price_business (note this ID)
```

#### Enterprise Plan ($299/month)
```
Product Name: Enterprise Plan
Description: Advanced features with API access
Price: $299.00 USD
Billing: Monthly
Price ID: price_enterprise (note this ID)
```

## 🔄 **Firebase Cloud Functions Setup**

Create these functions in Firebase to handle Stripe operations:

### 1. Install Firebase Functions
```bash
npm install -g firebase-tools
firebase init functions
cd functions
npm install stripe
```

### 2. Create Stripe Functions

#### `functions/index.js`
```javascript
const functions = require('firebase-functions');
const stripe = require('stripe')(functions.config().stripe.secret_key);
const admin = require('firebase-admin');

admin.initializeApp();

exports.createCheckoutSession = functions.https.onCall(async (data, context) => {
  try {
    const { priceId, userId, userEmail, successUrl, cancelUrl } = data;

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      customer_email: userEmail,
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        userId: userId,
      },
    });

    return { sessionId: session.id };
  } catch (error) {
    console.error('Error creating checkout session:', error);
    throw new functions.https.HttpsError('internal', 'Failed to create checkout session');
  }
});

exports.createCustomerPortalSession = functions.https.onCall(async (data, context) => {
  try {
    const { userId, returnUrl } = data;

    // Get customer ID from Firestore
    const userDoc = await admin.firestore().collection('artifacts').doc('restaurant-planner').collection('users').doc(userId).get();
    const userData = userDoc.data();
    
    if (!userData.stripeCustomerId) {
      throw new functions.https.HttpsError('not-found', 'No Stripe customer found');
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: userData.stripeCustomerId,
      return_url: returnUrl,
    });

    return { url: session.url };
  } catch (error) {
    console.error('Error creating customer portal session:', error);
    throw new functions.https.HttpsError('internal', 'Failed to create customer portal session');
  }
});
```

### 3. Deploy Functions
```bash
firebase deploy --only functions
```

## 🔗 **Webhook Setup**

### 1. Create Webhook Endpoint
In Stripe Dashboard → Webhooks → Add endpoint:
```
URL: https://your-project-id.web.app/api/stripe-webhook
Events to send:
- customer.subscription.created
- customer.subscription.updated  
- customer.subscription.deleted
- invoice.payment_succeeded
- invoice.payment_failed
```

### 2. Webhook Handler Function
```javascript
exports.stripeWebhook = functions.https.onRequest(async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = functions.config().stripe.webhook_secret;

  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        await handleSubscriptionUpdate(event.data.object);
        break;
      case 'customer.subscription.deleted':
        await handleSubscriptionCancellation(event.data.object);
        break;
      case 'invoice.payment_succeeded':
        await handlePaymentSuccess(event.data.object);
        break;
      case 'invoice.payment_failed':
        await handlePaymentFailure(event.data.object);
        break;
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Error handling webhook:', error);
    res.status(500).json({ error: 'Webhook handler failed' });
  }
});

async function handleSubscriptionUpdate(subscription) {
  const userId = subscription.metadata.userId;
  
  await admin.firestore()
    .collection('artifacts').doc('restaurant-planner')
    .collection('users').doc(userId)
    .update({
      subscription: {
        status: subscription.status,
        plan: subscription.items.data[0].price.id,
        currentPeriodEnd: new Date(subscription.current_period_end * 1000),
        cancelAtPeriodEnd: subscription.cancel_at_period_end,
        stripeCustomerId: subscription.customer,
        stripeSubscriptionId: subscription.id
      }
    });
}
```

## 🚀 **Testing**

### 1. Test Mode
- Use Stripe test keys (starts with `pk_test_` and `sk_test_`)
- Test with card number: `4242 4242 4242 4242`
- Use any future expiry date and any 3-digit CVC

### 2. Test Scenarios
- ✅ Successful subscription creation
- ✅ Subscription cancellation
- ✅ Payment failure handling
- ✅ Webhook processing
- ✅ Customer portal access

## 🔒 **Production Deployment**

### 1. Switch to Live Keys
- Replace test keys with live keys
- Update webhook endpoint to production URL
- Test with real payment methods

### 2. Security Checklist
- ✅ Environment variables secured
- ✅ Webhook signatures verified
- ✅ User data properly isolated
- ✅ Error handling implemented
- ✅ Logging configured

## 📊 **Monitoring**

### Stripe Dashboard
- Monitor payments and subscriptions
- Track failed payments and churn
- Review customer portal usage

### Firebase Console
- Monitor function executions
- Check error logs
- Review Firestore usage

## 🆘 **Troubleshooting**

### Common Issues
1. **Webhook not firing**: Check endpoint URL and events
2. **Payment failures**: Verify card details and limits
3. **Function errors**: Check Firebase function logs
4. **Customer portal issues**: Verify customer ID in Firestore

### Support Resources
- [Stripe Documentation](https://stripe.com/docs)
- [Firebase Functions Docs](https://firebase.google.com/docs/functions)
- [React Stripe.js](https://stripe.com/docs/stripe-js/react)

---

## ✅ **Next Steps**

1. Set up Stripe account and get API keys
2. Create products in Stripe Dashboard
3. Configure environment variables
4. Deploy Firebase functions
5. Set up webhooks
6. Test the integration
7. Deploy to production

Your subscription system will be fully functional once these steps are completed!
