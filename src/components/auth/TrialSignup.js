import React, { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import { CheckCircle, Star, Clock, Zap, ArrowRight, X } from 'lucide-react';

const TrialSignup = ({ isOpen, onClose, onSuccess }) => {
  const { actions } = useApp();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    restaurantName: '',
    restaurantType: '',
    location: '',
    experience: '',
    goals: []
  });
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const totalSteps = 4;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleGoalToggle = (goal) => {
    setFormData(prev => ({
      ...prev,
      goals: prev.goals.includes(goal)
        ? prev.goals.filter(g => g !== goal)
        : [...prev.goals, goal]
    }));
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      // Simulate trial signup process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Track trial signup in analytics
      if (window.gtag) {
        window.gtag('event', 'trial_signup_completed', {
          event_category: 'Conversion',
          event_label: 'Free Trial Signup',
          value: 1
        });
      }

      // Store trial data
      const trialData = {
        ...formData,
        trialStartDate: new Date().toISOString(),
        trialEndDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
        trialStatus: 'active',
        planType: 'free_trial'
      };

      localStorage.setItem('trialData', JSON.stringify(trialData));
      
      // Set user as authenticated with trial
      const generatedUid = 'trial_' + Date.now();
      actions.setUser({
        uid: generatedUid,
        email: formData.email,
        displayName: `${formData.firstName} ${formData.lastName}`,
        trialData: trialData
      });
      
      actions.setAuthenticated(true);
      actions.setUserId(generatedUid);
      
      onSuccess && onSuccess();
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Start Your Free Trial</h2>
              <p className="text-gray-600">Get 5 days of full access to plan your restaurant</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  First Name *
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name *
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Tell Us About Your Restaurant</h2>
              <p className="text-gray-600">Help us customize your experience</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Restaurant Name *
              </label>
              <input
                type="text"
                name="restaurantName"
                value={formData.restaurantName}
                onChange={handleInputChange}
                required
                placeholder="e.g., Bella Vista Italian"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Restaurant Type *
              </label>
              <select
                name="restaurantType"
                value={formData.restaurantType}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="">Select restaurant type</option>
                <option value="fine-dining">Fine Dining</option>
                <option value="casual-dining">Casual Dining</option>
                <option value="fast-casual">Fast Casual</option>
                <option value="cafe">Cafe</option>
                <option value="bar-grill">Bar & Grill</option>
                <option value="pizza">Pizza</option>
                <option value="ethnic">Ethnic Cuisine</option>
                <option value="food-truck">Food Truck</option>
                <option value="other">Other</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location (City, State) *
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                required
                placeholder="e.g., Boston, MA (or your city)"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Restaurant Experience *
              </label>
              <select
                name="experience"
                value={formData.experience}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="">Select your experience level</option>
                <option value="first-time">First-time restaurateur</option>
                <option value="experienced">Experienced in food service</option>
                <option value="current-owner">Current restaurant owner</option>
                <option value="investor">Investor/Developer</option>
              </select>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">What Are Your Goals?</h2>
              <p className="text-gray-600">Select all that apply to help us personalize your experience</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                'Secure funding/investment',
                'Create detailed business plan',
                'Market research & analysis',
                'Financial projections',
                'Find the perfect location',
                'Equipment planning',
                'Staff planning & training',
                'Compliance & permits',
                'Menu development',
                'Branding & marketing',
                'Operations planning',
                'Exit strategy planning'
              ].map((goal, index) => (
                <label key={index} className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.goals.includes(goal)}
                    onChange={() => handleGoalToggle(goal)}
                    className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                  />
                  <span className="ml-3 text-sm text-gray-700">{goal}</span>
                </label>
              ))}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">You're All Set!</h2>
              <p className="text-gray-600">Review your information and start your free trial</p>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-600">Name:</span>
                  <p className="text-gray-900">{formData.firstName} {formData.lastName}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Email:</span>
                  <p className="text-gray-900">{formData.email}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Restaurant:</span>
                  <p className="text-gray-900">{formData.restaurantName}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Type:</span>
                  <p className="text-gray-900">{formData.restaurantType}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Location:</span>
                  <p className="text-gray-900">{formData.location}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Experience:</span>
                  <p className="text-gray-900">{formData.experience}</p>
                </div>
              </div>
              
              {formData.goals.length > 0 && (
                <div>
                  <span className="font-medium text-gray-600">Goals:</span>
                  <ul className="mt-1 text-sm text-gray-900">
                    {formData.goals.map((goal, index) => (
                      <li key={index} className="flex items-center">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        {goal}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center">
                <Star className="w-5 h-5 text-green-600 mr-2" />
                <div>
                  <h3 className="font-semibold text-green-900">5-Day Free Trial</h3>
                  <p className="text-sm text-green-700">
                    Full access to all features • No credit card required • Cancel anytime
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">🌿 Iterum Foods</h1>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">
                Step {currentStep} of {totalSteps}
              </span>
              <span className="text-sm text-gray-500">
                {Math.round((currentStep / totalSteps) * 100)}% Complete
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / totalSteps) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            {renderStep()}

            {error && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
              <button
                type="button"
                onClick={handleBack}
                disabled={currentStep === 1}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Back
              </button>

              {currentStep < totalSteps ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center"
                >
                  Next
                  <ArrowRight className="w-4 h-4 ml-2" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Starting Trial...
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4 mr-2" />
                      Start Free Trial
                    </>
                  )}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TrialSignup;
