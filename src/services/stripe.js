import { loadStripe } from '@stripe/stripe-js';

// Initialize Stripe with your publishable key
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

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
      hasApiAccess: false
    }
  },
  professional: {
    id: 'price_professional',
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
      hasApiAccess: false
    }
  },
  business: {
    id: 'price_business',
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
      hasApiAccess: false
    }
  },
  enterprise: {
    id: 'price_enterprise',
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
      hasApiAccess: true
    }
  }
};

// Helper functions
export const getStripe = () => stripePromise;

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

// Stripe checkout functions
export const createCheckoutSession = async (priceId, userId, userEmail) => {
  try {
    const response = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        priceId,
        userId,
        userEmail,
        successUrl: `${window.location.origin}/dashboard?subscription=success`,
        cancelUrl: `${window.location.origin}/pricing?subscription=cancelled`
      })
    });

    const { sessionId } = await response.json();
    return sessionId;
  } catch (error) {
    console.error('Error creating checkout session:', error);
    throw error;
  }
};

export const createCustomerPortalSession = async (userId) => {
  try {
    const response = await fetch('/api/create-customer-portal-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        returnUrl: `${window.location.origin}/dashboard`
      })
    });

    const { url } = await response.json();
    return url;
  } catch (error) {
    console.error('Error creating customer portal session:', error);
    throw error;
  }
};

export default stripePromise;
