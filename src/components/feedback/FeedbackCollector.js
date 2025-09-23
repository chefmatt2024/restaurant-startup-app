import React, { useState } from 'react';
import { Star, MessageSquare, Bug, Lightbulb, Send, X, ThumbsUp, ThumbsDown } from 'lucide-react';
import analyticsService from '../../services/analytics';

const FeedbackCollector = ({ isOpen, onClose, context = {} }) => {
  const [feedbackType, setFeedbackType] = useState('general');
  const [rating, setRating] = useState(0);
  const [content, setContent] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const feedbackTypes = [
    { id: 'general', label: 'General Feedback', icon: MessageSquare, color: 'blue' },
    { id: 'bug', label: 'Bug Report', icon: Bug, color: 'red' },
    { id: 'feature', label: 'Feature Request', icon: Lightbulb, color: 'green' },
    { id: 'improvement', label: 'Improvement Suggestion', icon: Star, color: 'purple' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    setIsSubmitting(true);

    try {
      // Track feedback submission
      analyticsService.trackFeedback(feedbackType, content, rating, {
        email: email || null,
        context,
        timestamp: new Date().toISOString()
      });

      // Store feedback locally (in production, send to server)
      const feedback = {
        id: `feedback_${Date.now()}`,
        type: feedbackType,
        content: content.trim(),
        rating,
        email: email || null,
        context,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href
      };

      const stored = JSON.parse(localStorage.getItem('user_feedback') || '[]');
      stored.push(feedback);
      localStorage.setItem('user_feedback', JSON.stringify(stored));

      setIsSubmitted(true);
      
      // Reset form after 2 seconds
      setTimeout(() => {
        setContent('');
        setRating(0);
        setEmail('');
        setFeedbackType('general');
        setIsSubmitted(false);
        onClose();
      }, 2000);

    } catch (error) {
      console.error('Failed to submit feedback:', error);
      alert('Failed to submit feedback. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Share Your Feedback</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {isSubmitted ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ThumbsUp className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Thank You!</h3>
              <p className="text-gray-600">Your feedback has been submitted successfully.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Feedback Type Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  What type of feedback would you like to share?
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {feedbackTypes.map((type) => {
                    const Icon = type.icon;
                    return (
                      <button
                        key={type.id}
                        type="button"
                        onClick={() => setFeedbackType(type.id)}
                        className={`p-3 rounded-lg border-2 transition-colors ${
                          feedbackType === type.id
                            ? `border-${type.color}-500 bg-${type.color}-50`
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <Icon className={`h-5 w-5 mx-auto mb-2 ${
                          feedbackType === type.id ? `text-${type.color}-600` : 'text-gray-400'
                        }`} />
                        <span className={`text-sm font-medium ${
                          feedbackType === type.id ? `text-${type.color}-700` : 'text-gray-700'
                        }`}>
                          {type.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Rating (for general feedback) */}
              {feedbackType === 'general' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    How would you rate your experience?
                  </label>
                  <div className="flex space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className="focus:outline-none"
                      >
                        <Star
                          className={`h-8 w-8 ${
                            star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Poor</span>
                    <span>Excellent</span>
                  </div>
                </div>
              )}

              {/* Feedback Content */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {feedbackType === 'bug' ? 'Describe the bug:' :
                   feedbackType === 'feature' ? 'Describe your feature request:' :
                   feedbackType === 'improvement' ? 'Describe your improvement suggestion:' :
                   'Tell us about your experience:'}
                </label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder={
                    feedbackType === 'bug' ? 'Please describe what happened, what you expected, and steps to reproduce...' :
                    feedbackType === 'feature' ? 'What feature would you like to see? How would it help you?' :
                    feedbackType === 'improvement' ? 'How can we improve this feature or the overall experience?' :
                    'Share your thoughts, suggestions, or any issues you encountered...'
                  }
                  required
                />
              </div>

              {/* Email (optional) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email (optional)
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="your@email.com"
                />
                <p className="text-xs text-gray-500 mt-1">
                  We'll only use this to follow up if needed
                </p>
              </div>

              {/* Context Information */}
              {Object.keys(context).length > 0 && (
                <div className="bg-gray-50 p-3 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Context Information:</h4>
                  <div className="text-xs text-gray-600 space-y-1">
                    {Object.entries(context).map(([key, value]) => (
                      <div key={key}>
                        <span className="font-medium">{key}:</span> {String(value)}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!content.trim() || isSubmitting}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Submit Feedback
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default FeedbackCollector;
