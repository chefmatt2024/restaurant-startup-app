import { loadStripe } from '@stripe/stripe-js';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { getApp } from 'firebase/app';

// Initialize Stripe with your publishable key (only if key exists)
const stripePublishableKey = process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY;
const stripePromise = stripePublishableKey ? loadStripe(stripePublishableKey) : null;

// Subscription plans configuration
export const SUBSCRIPTION_PLANS = {
  free: {
    id: 'free',
    name: 'Free',
    price: 0,
    interval: 'month',
    features: [
      '1 restaurant plan',
      'Basic financial projections',
      'Limited equipment planning',
      'Watermarked exports',
      'Community support'
    ],
    limits: {
      maxPlans: 1,
      maxExports: 3,
      hasAdvancedAnalytics: false,
      hasCollaboration: false,
      hasApiAccess: false,
      financial_projections: true // Available to all users
    }
  },
  professional: {
    // ✅ Price ID configured - Stripe Price ID for Professional Plan ($29/month)
    id: 'price_1SlP8QAIIysA2GUVhIo473BKw', // Stripe Price ID
    name: 'Professional',
    price: 2900, // $29.00 in cents
    interval: 'month',
    features: [
      'Unlimited restaurant plans',
      'Full financial analysis',
      'Complete equipment planning',
      'PDF/Excel exports',
      'Priority support',
      'Advanced analytics',
      'Custom templates'
    ],
    limits: {
      maxPlans: -1, // unlimited
      maxExports: -1, // unlimited
      hasAdvancedAnalytics: true,
      hasCollaboration: false,
      hasApiAccess: false,
      financial_projections: true
    }
  },
  business: {
    // ✅ Price ID configured - Stripe Price ID for Business Plan ($99/month)
    id: 'price_1SlP8tAIIysA2GUVcLTteVlF', // Stripe Price ID
    name: 'Business',
    price: 9900, // $99.00 in cents
    interval: 'month',
    features: [
      'Everything in Professional',
      'Multi-user collaboration',
      'Team management',
      'Advanced reporting',
      'White-label options',
      'Priority phone support',
      'Custom integrations'
    ],
    limits: {
      maxPlans: -1,
      maxExports: -1,
      hasAdvancedAnalytics: true,
      hasCollaboration: true,
      hasApiAccess: false,
      financial_projections: true
    }
  },
  enterprise: {
    // ✅ Price ID configured - Stripe Price ID for Enterprise Plan ($299/month)
    id: 'price_1SlP9SAIIysA2GUVDoMrA8cC', // Stripe Price ID
    name: 'Enterprise',
    price: 29900, // $299.00 in cents
    interval: 'month',
    features: [
      'Everything in Business',
      'API access',
      'Custom integrations',
      'Dedicated support',
      'On-premise deployment',
      'SLA guarantee',
      'Custom training'
    ],
    limits: {
      maxPlans: -1,
      maxExports: -1,
      hasAdvancedAnalytics: true,
      hasCollaboration: true,
      hasApiAccess: true,
      financial_projections: true
    }
  }
};

// Helper functions
export const getStripe = () => {
  if (!stripePublishableKey) {
    console.warn('Stripe publishable key not configured. Payment features will be disabled.');
    return null;
  }
  return stripePromise;
};

export const formatPrice = (priceInCents) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(priceInCents / 100);
};

export const getPlanById = (planId) => {
  return Object.values(SUBSCRIPTION_PLANS).find(plan => plan.id === planId) || SUBSCRIPTION_PLANS.free;
};

export const getPlanLimits = (planId) => {
  const plan = getPlanById(planId);
  return plan.limits;
};

export const hasFeature = (userPlan, feature) => {
  const limits = getPlanLimits(userPlan);
  return limits[feature] === true || limits[feature] === -1;
};

export const canAccessFeature = (userPlan, feature, currentUsage = 0) => {
  const limits = getPlanLimits(userPlan);
  
  if (limits[feature] === true || limits[feature] === -1) {
    return true;
  }
  
  if (typeof limits[feature] === 'number') {
    return currentUsage < limits[feature];
  }
  
  return false;
};

// Stripe checkout functions using Firebase Functions
export const createCheckoutSession = async (priceId, userId, userEmail) => {
  try {
    const app = getApp();
    const functions = getFunctions(app);
    const createCheckoutSessionFn = httpsCallable(functions, 'createCheckoutSession');

    const result = await createCheckoutSessionFn({
      priceId,
      userId,
      userEmail,
      successUrl: `${window.location.origin}/dashboard?subscription=success`,
      cancelUrl: `${window.location.origin}/pricing?subscription=cancelled`
    });

    return result.data.sessionId;
  } catch (error) {
    console.error('Error creating checkout session:', error);
    
    // Handle case when functions aren't deployed
    if (error.code === 'functions/unavailable' || error.code === 'unavailable' || error.message?.includes('CORS') || error.message?.includes('ERR_FAILED')) {
      const friendlyError = new Error('Payment processing is currently unavailable. Please upgrade to a paid plan later, or contact support if you need immediate access.');
      friendlyError.code = 'FUNCTIONS_NOT_DEPLOYED';
      throw friendlyError;
    }
    
    throw error;
  }
};

export const createCustomerPortalSession = async (userId) => {
  try {
    const app = getApp();
    const functions = getFunctions(app);
    const createCustomerPortalSessionFn = httpsCallable(functions, 'createCustomerPortalSession');

    const result = await createCustomerPortalSessionFn({
      userId,
      returnUrl: `${window.location.origin}/dashboard`
    });

    return result.data.url;
  } catch (error) {
    console.error('Error creating customer portal session:', error);
    
    // Handle case when functions aren't deployed
    if (error.code === 'functions/unavailable' || error.code === 'unavailable' || error.message?.includes('CORS') || error.message?.includes('ERR_FAILED')) {
      const friendlyError = new Error('Billing portal is currently unavailable. Please contact support for subscription management.');
      friendlyError.code = 'FUNCTIONS_NOT_DEPLOYED';
      throw friendlyError;
    }
    
    throw error;
  }
};

export default stripePromise;
