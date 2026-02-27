const functions = require('firebase-functions');
const admin = require('firebase-admin');
const stripe = require('stripe')(functions.config()?.stripe?.secret_key || process.env.STRIPE_SECRET_KEY);

admin.initializeApp();

// AI Service Configuration
// Supports both legacy config and environment variables
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || functions.config()?.openai?.api_key;
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY || functions.config()?.anthropic?.api_key;
const AI_PROVIDER = process.env.AI_PROVIDER || functions.config()?.ai?.provider || 'openai'; // 'openai' or 'anthropic'

/**
 * Capture waitlist leads from public landing pages.
 * Stores leads in Firestore so they are not lost like localStorage-only capture.
 */
exports.captureWaitlistLead = functions.https.onRequest(async (req, res) => {
  // Basic CORS support for public landing pages.
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Headers', 'Content-Type');
  res.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
  if (req.method === 'OPTIONS') {
    return res.status(204).send('');
  }
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const payload = req.body || {};
    const name = (payload.name || '').trim();
    const email = (payload.email || '').trim().toLowerCase();
    const phone = (payload.phone || '').trim();
    const company = (payload.company || '').trim();
    const role = (payload.role || '').trim();
    const interest = (payload.interest || '').trim();
    const platform = (payload.platform || 'unknown').trim();
    const sourcePath = (payload.sourcePath || '').trim();
    const source = (payload.source || 'website').trim();

    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required' });
    }
    const emailLooksValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!emailLooksValid) {
      return res.status(400).json({ error: 'Invalid email address' });
    }

    const leadData = {
      name,
      email,
      phone,
      company,
      role,
      interest,
      platform,
      source,
      sourcePath,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      userAgent: req.get('user-agent') || null,
      ip: req.ip || null,
      status: 'new',
    };

    const appId = process.env.REACT_APP_ID || 'restaurant-planner';
    await admin.firestore()
      .collection('artifacts')
      .doc(appId)
      .collection('waitlist_leads')
      .add(leadData);

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error capturing waitlist lead:', error);
    return res.status(500).json({ error: 'Failed to capture lead' });
  }
});

/**
 * Create a Stripe Checkout Session
 * Called from the client to initiate a subscription checkout
 */
exports.createCheckoutSession = functions.https.onCall(async (data, context) => {
  // Verify user is authenticated
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  try {
    const { priceId, userId, userEmail, successUrl, cancelUrl } = data;

    if (!priceId || !userId || !userEmail) {
      throw new functions.https.HttpsError('invalid-argument', 'Missing required parameters');
    }

    // Create Stripe Checkout Session
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
      success_url: successUrl || `${process.env.APP_URL || 'https://restaurant-startup-app.web.app'}/dashboard?subscription=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl || `${process.env.APP_URL || 'https://restaurant-startup-app.web.app'}/pricing?subscription=cancelled`,
      metadata: {
        userId: userId,
        userEmail: userEmail,
      },
      subscription_data: {
        metadata: {
          userId: userId,
        },
      },
    });

    return { sessionId: session.id, url: session.url };
  } catch (error) {
    console.error('Error creating checkout session:', error);
    throw new functions.https.HttpsError('internal', error.message || 'Failed to create checkout session');
  }
});

/**
 * Create a Customer Portal Session
 * Allows users to manage their subscription (cancel, update payment method, etc.)
 */
exports.createCustomerPortalSession = functions.https.onCall(async (data, context) => {
  // Verify user is authenticated
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  try {
    const { userId, returnUrl } = data;

    if (!userId) {
      throw new functions.https.HttpsError('invalid-argument', 'Missing userId');
    }

    // Get user document from Firestore
    const userDoc = await admin.firestore()
      .collection('artifacts')
      .doc('restaurant-planner')
      .collection('users')
      .doc(userId)
      .get();

    if (!userDoc.exists) {
      throw new functions.https.HttpsError('not-found', 'User not found');
    }

    const userData = userDoc.data();
    
    if (!userData.stripeCustomerId) {
      throw new functions.https.HttpsError('not-found', 'No Stripe customer found for this user');
    }

    // Create Customer Portal Session
    const session = await stripe.billingPortal.sessions.create({
      customer: userData.stripeCustomerId,
      return_url: returnUrl || `${process.env.APP_URL || 'https://restaurant-startup-app.web.app'}/dashboard`,
    });

    return { url: session.url };
  } catch (error) {
    console.error('Error creating customer portal session:', error);
    throw new functions.https.HttpsError('internal', error.message || 'Failed to create customer portal session');
  }
});

/**
 * Stripe Webhook Handler
 * Handles subscription events from Stripe
 */
exports.stripeWebhook = functions.https.onRequest(async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const webhookSecret = functions.config().stripe?.webhook_secret || process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.error('Webhook secret not configured');
    return res.status(400).send('Webhook secret not configured');
  }

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(event.data.object);
        break;
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
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Error handling webhook:', error);
    res.status(500).json({ error: 'Webhook handler failed' });
  }
});

/**
 * Handle checkout session completion
 */
async function handleCheckoutSessionCompleted(session) {
  const userId = session.metadata?.userId;
  const customerId = session.customer;

  if (!userId || !customerId) {
    console.error('Missing userId or customerId in checkout session');
    return;
  }

  // Update user document with Stripe customer ID
  await admin.firestore()
    .collection('artifacts')
    .doc('restaurant-planner')
    .collection('users')
    .doc(userId)
    .update({
      stripeCustomerId: customerId,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

  console.log(`Checkout completed for user ${userId}`);
}

/**
 * Handle subscription updates (created/updated)
 */
async function handleSubscriptionUpdate(subscription) {
  const userId = subscription.metadata?.userId;
  
  if (!userId) {
    console.error('Missing userId in subscription metadata');
    return;
  }

  const priceId = subscription.items.data[0]?.price?.id;
  const status = subscription.status;
  const currentPeriodEnd = new Date(subscription.current_period_end * 1000);
  const cancelAtPeriodEnd = subscription.cancel_at_period_end;

  // Update user subscription in Firestore
  await admin.firestore()
    .collection('artifacts')
    .doc('restaurant-planner')
    .collection('users')
    .doc(userId)
    .update({
      subscription: {
        status: status,
        plan: priceId,
        currentPeriodEnd: admin.firestore.Timestamp.fromDate(currentPeriodEnd),
        cancelAtPeriodEnd: cancelAtPeriodEnd,
        stripeCustomerId: subscription.customer,
        stripeSubscriptionId: subscription.id,
      },
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

  console.log(`Subscription ${status} for user ${userId}`);
}

/**
 * Handle subscription cancellation
 */
async function handleSubscriptionCancellation(subscription) {
  const userId = subscription.metadata?.userId;
  
  if (!userId) {
    console.error('Missing userId in subscription metadata');
    return;
  }

  // Update user subscription status
  await admin.firestore()
    .collection('artifacts')
    .doc('restaurant-planner')
    .collection('users')
    .doc(userId)
    .update({
      'subscription.status': 'canceled',
      'subscription.cancelAtPeriodEnd': false,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

  console.log(`Subscription canceled for user ${userId}`);
}

/**
 * Handle successful payment
 */
async function handlePaymentSuccess(invoice) {
  const customerId = invoice.customer;
  const subscriptionId = invoice.subscription;

  if (!customerId || !subscriptionId) {
    return;
  }

  // Find user by Stripe customer ID
  const usersSnapshot = await admin.firestore()
    .collection('artifacts')
    .doc('restaurant-planner')
    .collection('users')
    .where('stripeCustomerId', '==', customerId)
    .limit(1)
    .get();

  if (usersSnapshot.empty) {
    console.error(`No user found for customer ${customerId}`);
    return;
  }

  const userId = usersSnapshot.docs[0].id;

  // Update last payment date
  await admin.firestore()
    .collection('artifacts')
    .doc('restaurant-planner')
    .collection('users')
    .doc(userId)
    .update({
      'subscription.lastPaymentDate': admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

  console.log(`Payment succeeded for user ${userId}`);
}

/**
 * Handle failed payment
 */
async function handlePaymentFailure(invoice) {
  const customerId = invoice.customer;

  if (!customerId) {
    return;
  }

  // Find user by Stripe customer ID
  const usersSnapshot = await admin.firestore()
    .collection('artifacts')
    .doc('restaurant-planner')
    .collection('users')
    .where('stripeCustomerId', '==', customerId)
    .limit(1)
    .get();

  if (usersSnapshot.empty) {
    console.error(`No user found for customer ${customerId}`);
    return;
  }

  const userId = usersSnapshot.docs[0].id;

  // Update subscription status
  await admin.firestore()
    .collection('artifacts')
    .doc('restaurant-planner')
    .collection('users')
    .doc(userId)
    .update({
      'subscription.status': 'past_due',
      'subscription.lastPaymentFailure': admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

  console.log(`Payment failed for user ${userId}`);
}

/**
 * AI Completion Proxy Function
 * Securely proxies AI API calls to avoid CORS and protect API keys
 */
exports.generateAICompletion = functions.https.onCall(async (data, context) => {
  // Verify user is authenticated
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  try {
    const { prompt, options = {} } = data;
    const {
      maxTokens = 2000,
      temperature = 0.7,
      systemPrompt = null,
      provider = AI_PROVIDER
    } = options;

    if (!prompt) {
      throw new functions.https.HttpsError('invalid-argument', 'Prompt is required');
    }

    const apiKey = provider === 'openai' ? OPENAI_API_KEY : ANTHROPIC_API_KEY;
    
    if (!apiKey) {
      throw new functions.https.HttpsError('failed-precondition', 
        `AI API key not configured. Please configure ${provider.toUpperCase()}_API_KEY in Firebase Functions config.`);
    }

    if (provider === 'openai') {
      const messages = [];
      if (systemPrompt) {
        messages.push({ role: 'system', content: systemPrompt });
      }
      messages.push({ role: 'user', content: prompt });

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4o',
          messages,
          max_tokens: maxTokens,
          temperature
        })
      });

      if (!response.ok) {
        const error = await response.json();
        const errorMessage = error.error?.message || `API request failed: ${response.statusText}`;
        
        // Check for quota/billing errors
        if (errorMessage.toLowerCase().includes('quota') || 
            errorMessage.toLowerCase().includes('billing') ||
            errorMessage.toLowerCase().includes('exceeded') ||
            error.code === 'insufficient_quota') {
          throw new functions.https.HttpsError('resource-exhausted', 
            `API Quota Exceeded: ${errorMessage}. Please check your OpenAI account billing.`);
        }
        
        // Check for rate limit errors
        if (errorMessage.toLowerCase().includes('rate limit') || error.code === 'rate_limit_exceeded') {
          throw new functions.https.HttpsError('resource-exhausted', 
            `Rate Limit Exceeded: ${errorMessage}. Please wait a moment and try again.`);
        }
        
        throw new functions.https.HttpsError('internal', errorMessage);
      }

      const result = await response.json();
      return { content: result.choices[0].message.content };
    } else {
      // Anthropic Claude
      const messages = [{ role: 'user', content: prompt }];
      
      const requestBody = {
        model: 'claude-3-opus-20240229',
        max_tokens: maxTokens,
        temperature,
        messages
      };

      if (systemPrompt) {
        requestBody.system = systemPrompt;
      }

      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const error = await response.json();
        const errorMessage = error.error?.message || `API request failed: ${response.statusText}`;
        throw new functions.https.HttpsError('internal', errorMessage);
      }

      const result = await response.json();
      return { content: result.content[0].text };
    }
  } catch (error) {
    console.error('AI Service Error:', error);
    
    if (error instanceof functions.https.HttpsError) {
      throw error;
    }
    
    throw new functions.https.HttpsError('internal', 
      error.message || 'Failed to generate AI completion');
  }
});

