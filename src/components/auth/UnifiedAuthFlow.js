import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../contexts/AppContext';
import { authService } from '../../services/firebase';
import TermsAndPrivacy from './TermsAndPrivacy';
import { 
  X, 
  Mail, 
  Lock, 
  User, 
  Eye, 
  EyeOff, 
  AlertCircle,
  CheckCircle,
  Loader2,
  Sparkles,
  Shield,
  Star,
  ArrowRight,
  Zap,
  Gift
} from 'lucide-react';

// Password strength checker
const getPasswordStrength = (password) => {
  if (!password) return { strength: 0, label: '', color: '' };
  
  let strength = 0;
  if (password.length >= 8) strength++;
  if (password.length >= 12) strength++;
  if (/[a-z]/.test(password)) strength++;
  if (/[A-Z]/.test(password)) strength++;
  if (/[0-9]/.test(password)) strength++;
  if (/[^A-Za-z0-9]/.test(password)) strength++;
  
  if (strength <= 2) return { strength, label: 'Weak', color: 'red' };
  if (strength <= 4) return { strength, label: 'Medium', color: 'yellow' };
  return { strength, label: 'Strong', color: 'green' };
};

const UnifiedAuthFlow = ({ isOpen, onClose, initialMode = 'signup' }) => {
  const { actions } = useApp();
  const [mode, setMode] = useState(initialMode); // 'signup', 'login', 'terms'
  const [showTerms, setShowTerms] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    displayName: '',
    acceptTerms: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [passwordStrength, setPasswordStrength] = useState({ strength: 0, label: '', color: '' });
  const emailInputRef = useRef(null);

  // Auto-focus email input when modal opens
  useEffect(() => {
    if (isOpen && emailInputRef.current && mode !== 'terms') {
      setTimeout(() => emailInputRef.current?.focus(), 100);
    }
  }, [isOpen, mode]);

  // Check password strength
  useEffect(() => {
    if (mode === 'signup' && formData.password) {
      setPasswordStrength(getPasswordStrength(formData.password));
    }
  }, [formData.password, mode]);

  // Show terms first if not accepted
  useEffect(() => {
    if (isOpen && mode === 'signup') {
      const termsAccepted = localStorage.getItem('termsAccepted');
      if (termsAccepted !== 'true') {
        setShowTerms(true);
      }
    }
  }, [isOpen, mode]);

  const resetForm = () => {
    setFormData({
      email: '',
      password: '',
      confirmPassword: '',
      displayName: '',
      acceptTerms: false
    });
    setError('');
    setSuccess('');
    setShowPassword(false);
    setShowConfirmPassword(false);
    setPasswordStrength({ strength: 0, label: '', color: '' });
    setShowTerms(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (error) setError('');
  };

  const validateForm = () => {
    if (!formData.email) {
      setError('Email is required');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }
    if (!formData.password) {
      setError('Password is required');
      return false;
    }
    if (mode === 'signup') {
      if (formData.password.length < 8) {
        setError('Password must be at least 8 characters');
        return false;
      }
      if (passwordStrength.strength <= 2) {
        setError('Please choose a stronger password');
        return false;
      }
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        return false;
      }
      if (!formData.displayName.trim()) {
        setError('Full name is required');
        return false;
      }
      if (!formData.acceptTerms) {
        setError('Please accept the Terms of Service and Privacy Policy');
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      if (mode === 'login') {
        await authService.signInWithEmailAndPassword(formData.email, formData.password);
        setSuccess('Successfully signed in!');
        setTimeout(() => handleClose(), 1000);
      } else if (mode === 'signup') {
        // Create account
        await authService.createUserWithEmailAndPassword(
          formData.email, 
          formData.password, 
          formData.displayName
        );
        
        // Store trial data
        const trialData = {
          trialStartDate: new Date().toISOString(),
          trialEndDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
          trialStatus: 'active',
          planType: 'free_trial'
        };
        
        localStorage.setItem('trialData', JSON.stringify(trialData));
        localStorage.setItem('termsAccepted', 'true');
        
        setSuccess('Account created! Starting your 5-day free trial...');
        setTimeout(() => {
          actions.showWelcomeMessage();
          handleClose();
        }, 1500);
      }
    } catch (error) {
      let errorMessage = 'An error occurred. Please try again.';
      
      if (error.code === 'auth/user-not-found') {
        errorMessage = 'No account found with this email address.';
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = 'Incorrect password. Please try again.';
      } else if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'An account with this email already exists. Try signing in instead.';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'Password is too weak. Please choose a stronger password.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Please enter a valid email address.';
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = 'Too many failed attempts. Please try again later.';
      } else if (error.code === 'auth/operation-not-allowed') {
        errorMessage = 'Email/Password authentication is not enabled. Please try Google sign-in.';
      } else if (error.code === 'auth/network-request-failed') {
        errorMessage = 'Network error. Please check your internet connection.';
      } else if (error.code === 'auth/invalid-credential') {
        errorMessage = 'Invalid credentials. Please check your email and password.';
      }
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError('');

    try {
      await authService.signInWithGoogle();
      
      // Store trial data for Google sign-in users too
      const trialData = {
        trialStartDate: new Date().toISOString(),
        trialEndDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
        trialStatus: 'active',
        planType: 'free_trial'
      };
      
      localStorage.setItem('trialData', JSON.stringify(trialData));
      localStorage.setItem('termsAccepted', 'true');
      
      setSuccess('Successfully signed in! Starting your 5-day free trial...');
      setTimeout(() => {
        actions.showWelcomeMessage();
        handleClose();
      }, 1000);
    } catch (error) {
      setError('Failed to sign in with Google. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTermsAccept = () => {
    localStorage.setItem('termsAccepted', 'true');
    setShowTerms(false);
    setFormData(prev => ({ ...prev, acceptTerms: true }));
  };

  const handleTermsDecline = () => {
    handleClose();
  };

  if (!isOpen) return null;

  // Show Terms modal if needed
  if (showTerms) {
    return (
      <TermsAndPrivacy 
        onAccept={handleTermsAccept}
        onDecline={handleTermsDecline}
      />
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md my-8">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 p-6 rounded-t-xl">
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-white hover:text-gray-200 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          <div className="text-center">
            <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-3">
              {mode === 'login' ? (
                <User className="w-8 h-8 text-white" />
              ) : (
                <Gift className="w-8 h-8 text-white" />
              )}
            </div>
            <h2 className="text-2xl font-bold text-white">
              {mode === 'login' ? 'Welcome Back!' : 'Start Your Free Trial'}
            </h2>
            <p className="text-blue-100 mt-2 text-sm">
              {mode === 'login' 
                ? 'Sign in to continue planning your restaurant'
                : '5 days free • No credit card required • Full access'}
            </p>
          </div>
        </div>

        {/* Free Trial Badge (Signup only) */}
        {mode === 'signup' && (
          <div className="px-6 pt-4 pb-2">
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-center justify-center space-x-2">
              <Star className="w-5 h-5 text-green-600 fill-current" />
              <span className="text-sm font-semibold text-green-800">
                Trusted by 500+ restaurant entrepreneurs
              </span>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Display Name (Signup only) */}
          {mode === 'signup' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  name="displayName"
                  value={formData.displayName}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Enter your full name"
                  disabled={isLoading}
                />
              </div>
            </div>
          )}

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                ref={emailInputRef}
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Enter your email"
                disabled={isLoading}
                autoComplete="email"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Enter your password"
                disabled={isLoading}
                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            
            {/* Password Strength Indicator (Signup only) */}
            {mode === 'signup' && formData.password && (
              <div className="mt-2">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-gray-600">Password strength:</span>
                  <span className={`text-xs font-medium ${
                    passwordStrength.color === 'red' ? 'text-red-600' :
                    passwordStrength.color === 'yellow' ? 'text-yellow-600' :
                    'text-green-600'
                  }`}>
                    {passwordStrength.label}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all ${
                      passwordStrength.color === 'red' ? 'bg-red-500' :
                      passwordStrength.color === 'yellow' ? 'bg-yellow-500' :
                      'bg-green-500'
                    }`}
                    style={{ width: `${(passwordStrength.strength / 6) * 100}%` }}
                  />
                </div>
                <ul className="text-xs text-gray-500 mt-2 space-y-1">
                  <li className={formData.password.length >= 8 ? 'text-green-600' : ''}>
                    {formData.password.length >= 8 ? '✓' : '○'} At least 8 characters
                  </li>
                  <li className={/[A-Z]/.test(formData.password) ? 'text-green-600' : ''}>
                    {/[A-Z]/.test(formData.password) ? '✓' : '○'} One uppercase letter
                  </li>
                  <li className={/[0-9]/.test(formData.password) ? 'text-green-600' : ''}>
                    {/[0-9]/.test(formData.password) ? '✓' : '○'} One number
                  </li>
                </ul>
              </div>
            )}
          </div>

          {/* Confirm Password (Signup only) */}
          {mode === 'signup' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                    formData.confirmPassword && formData.password !== formData.confirmPassword
                      ? 'border-red-300'
                      : 'border-gray-300'
                  }`}
                  placeholder="Confirm your password"
                  disabled={isLoading}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                <p className="text-xs text-red-600 mt-1">Passwords do not match</p>
              )}
            </div>
          )}

          {/* Terms Acceptance (Signup only) */}
          {mode === 'signup' && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
              <label className="flex items-start">
                <input
                  type="checkbox"
                  name="acceptTerms"
                  checked={formData.acceptTerms}
                  onChange={handleInputChange}
                  className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-xs text-gray-600">
                  I agree to the{' '}
                  <button
                    type="button"
                    onClick={() => setShowTerms(true)}
                    className="text-blue-600 hover:underline"
                  >
                    Terms of Service
                  </button>
                  {' '}and{' '}
                  <button
                    type="button"
                    onClick={() => setShowTerms(true)}
                    className="text-blue-600 hover:underline"
                  >
                    Privacy Policy
                  </button>
                </span>
              </label>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="flex items-start space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <span className="text-sm text-red-700">{error}</span>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="flex items-start space-x-2 p-3 bg-green-50 border border-green-200 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <span className="text-sm text-green-700">{success}</span>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center space-x-2 shadow-lg"
          >
            {isLoading && <Loader2 className="w-5 h-5 animate-spin" />}
            <span>
              {mode === 'login' && 'Sign In'}
              {mode === 'signup' && (
                <>
                  <Zap className="w-4 h-4 inline mr-1" />
                  Start Free Trial
                </>
              )}
            </span>
          </button>

          {/* Google Sign In */}
          <>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              className="w-full bg-white border-2 border-gray-300 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center space-x-2"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span>Continue with Google</span>
            </button>
          </>
        </form>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-xl">
          <div className="text-center">
            {mode === 'login' && (
              <div className="space-y-2">
                <div className="text-sm text-gray-600">
                  Don't have an account?{' '}
                  <button
                    onClick={() => setMode('signup')}
                    className="text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Start free trial
                  </button>
                </div>
                <button
                  onClick={() => {
                    // Handle forgot password
                    setError('Password reset coming soon. Please contact support.');
                  }}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  Forgot your password?
                </button>
              </div>
            )}
            {mode === 'signup' && (
              <div className="text-sm text-gray-600">
                Already have an account?{' '}
                <button
                  onClick={() => setMode('login')}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  Sign in
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnifiedAuthFlow;

