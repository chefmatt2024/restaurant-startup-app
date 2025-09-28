import React, { useState } from 'react';
import { Check, X, Star, Zap } from 'lucide-react';
import { SUBSCRIPTION_PLANS, formatPrice, createCheckoutSession } from '../../services/stripe';
import { useApp } from '../../contexts/AppContext';
import useSubscription from '../../hooks/useSubscription';

const PricingPage = () => {
  const { state, actions } = useApp();
  const { subscription, getCurrentPlan, hasPlanFeature } = useSubscription();
  const [loading, setLoading] = useState(null);

  const handleSubscribe = async (planId) => {
    if (planId === 'free') return;

    setLoading(planId);
    try {
      const sessionId = await createCheckoutSession(
        planId,
        state.userId,
        state.user?.email
      );

      // Redirect to Stripe Checkout
      const stripe = (await import('@stripe/stripe-js')).loadStripe(
        process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY
      );
      const { error } = await stripe.redirectToCheckout({ sessionId });

      if (error) {
        actions.showMessage('Error', 'Failed to start checkout process', 'error');
      }
    } catch (error) {
      console.error('Subscription error:', error);
      actions.showMessage('Error', 'Failed to process subscription', 'error');
    } finally {
      setLoading(null);
    }
  };

  const currentPlan = getCurrentPlan();
  const isCurrentPlan = (planId) => subscription?.plan === planId;

  const plans = Object.values(SUBSCRIPTION_PLANS).filter(plan => plan.id !== 'free');

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Choose Your Plan
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Unlock the full potential of your restaurant business planning with our comprehensive tools and features.
          </p>
        </div>

        {/* Current Plan Status */}
        {currentPlan && (
          <div className="mb-12">
            <div className="bg-white rounded-lg shadow-lg p-6 max-w-md mx-auto">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Current Plan: {currentPlan.name}
                </h3>
                <p className="text-2xl font-bold text-blue-600 mb-2">
                  {formatPrice(currentPlan.price)}
                  {currentPlan.price > 0 && <span className="text-sm text-gray-500">/month</span>}
                </p>
                {subscription?.status === 'trialing' && (
                  <p className="text-sm text-amber-600">
                    Trial ends in {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative bg-white rounded-2xl shadow-lg overflow-hidden ${
                plan.id === 'price_professional' ? 'ring-2 ring-blue-500 scale-105' : ''
              }`}
            >
              {plan.id === 'price_professional' && (
                <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-center py-2 text-sm font-semibold">
                  <Star className="w-4 h-4 inline mr-1" />
                  Most Popular
                </div>
              )}

              <div className="p-8">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {plan.name}
                  </h3>
                  <div className="mb-4">
                    <span className="text-5xl font-bold text-gray-900">
                      {formatPrice(plan.price)}
                    </span>
                    <span className="text-gray-500 ml-2">/month</span>
                  </div>
                  <p className="text-gray-600">
                    Billed monthly, cancel anytime
                  </p>
                </div>

                <div className="space-y-4 mb-8">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-start">
                      <Check className="w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => handleSubscribe(plan.id)}
                  disabled={isCurrentPlan(plan.id) || loading === plan.id}
                  className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-200 ${
                    isCurrentPlan(plan.id)
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : plan.id === 'price_professional'
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 transform hover:scale-105'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {loading === plan.id ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Processing...
                    </div>
                  ) : isCurrentPlan(plan.id) ? (
                    'Current Plan'
                  ) : (
                    `Upgrade to ${plan.name}`
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Free Plan Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md mx-auto mb-16">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Free Plan
            </h3>
            <div className="mb-4">
              <span className="text-5xl font-bold text-gray-900">$0</span>
              <span className="text-gray-500 ml-2">/month</span>
            </div>
            <p className="text-gray-600 mb-6">
              Perfect for getting started
            </p>

            <div className="space-y-3 mb-8 text-left">
              {SUBSCRIPTION_PLANS.free.features.map((feature, index) => (
                <div key={index} className="flex items-start">
                  <Check className="w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                  <span className="text-gray-700">{feature}</span>
                </div>
              ))}
            </div>

            <button
              onClick={() => handleSubscribe('free')}
              disabled={isCurrentPlan('free')}
              className={`w-full py-3 px-6 rounded-lg font-semibold border-2 transition-all duration-200 ${
                isCurrentPlan('free')
                  ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                  : 'border-gray-300 text-gray-700 hover:border-gray-400 hover:bg-gray-50'
              }`}
            >
              {isCurrentPlan('free') ? 'Current Plan' : 'Stay on Free Plan'}
            </button>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Frequently Asked Questions
          </h2>
          
          <div className="space-y-8">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Can I change my plan anytime?
              </h3>
              <p className="text-gray-600">
                Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately, and we'll prorate any billing differences.
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                What payment methods do you accept?
              </h3>
              <p className="text-gray-600">
                We accept all major credit cards (Visa, MasterCard, American Express, Discover) and ACH bank transfers.
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Is there a free trial?
              </h3>
              <p className="text-gray-600">
                Yes! All paid plans come with a 14-day free trial. You can cancel anytime during the trial without being charged.
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Can I cancel anytime?
              </h3>
              <p className="text-gray-600">
                Absolutely. You can cancel your subscription at any time. You'll continue to have access to paid features until the end of your current billing period.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Build Your Restaurant Empire?
            </h2>
            <p className="text-xl mb-6 opacity-90">
              Join thousands of successful restaurateurs who use our platform to plan, launch, and grow their businesses.
            </p>
            <button
              onClick={() => handleSubscribe('price_professional')}
              disabled={loading === 'price_professional'}
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors duration-200"
            >
              Start Your Free Trial
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;
