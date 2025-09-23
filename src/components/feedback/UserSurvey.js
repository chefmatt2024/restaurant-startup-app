import React, { useState } from 'react';
import { CheckCircle, Circle, ChevronRight, ChevronLeft } from 'lucide-react';
import analyticsService from '../../services/analytics';

const UserSurvey = ({ isOpen, onClose, surveyData }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const handleAnswer = (questionId, answer) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleNext = () => {
    if (currentStep < surveyData.questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      // Track survey completion
      analyticsService.track('survey_completed', {
        surveyId: surveyData.id,
        surveyTitle: surveyData.title,
        answers,
        completionTime: Date.now(),
        totalQuestions: surveyData.questions.length
      });

      // Store survey response
      const response = {
        id: `survey_${Date.now()}`,
        surveyId: surveyData.id,
        answers,
        completedAt: new Date().toISOString(),
        userId: analyticsService.getCurrentUser()?.uid || 'anonymous'
      };

      const stored = JSON.parse(localStorage.getItem('survey_responses') || '[]');
      stored.push(response);
      localStorage.setItem('survey_responses', JSON.stringify(stored));

      setIsCompleted(true);
    } catch (error) {
      console.error('Failed to submit survey:', error);
      alert('Failed to submit survey. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderQuestion = (question, index) => {
    const questionNumber = index + 1;
    const totalQuestions = surveyData.questions.length;

    switch (question.type) {
      case 'multiple_choice':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {questionNumber}. {question.question}
            </h3>
            {question.description && (
              <p className="text-gray-600 mb-4">{question.description}</p>
            )}
            <div className="space-y-3">
              {question.options.map((option, optionIndex) => (
                <label
                  key={optionIndex}
                  className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                >
                  <input
                    type="radio"
                    name={`question_${index}`}
                    value={option.value}
                    checked={answers[question.id] === option.value}
                    onChange={() => handleAnswer(question.id, option.value)}
                    className="sr-only"
                  />
                  <div className="flex items-center">
                    {answers[question.id] === option.value ? (
                      <CheckCircle className="h-5 w-5 text-blue-600 mr-3" />
                    ) : (
                      <Circle className="h-5 w-5 text-gray-400 mr-3" />
                    )}
                    <span className="text-gray-900">{option.label}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>
        );

      case 'rating':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {questionNumber}. {question.question}
            </h3>
            {question.description && (
              <p className="text-gray-600 mb-4">{question.description}</p>
            )}
            <div className="flex justify-center space-x-2">
              {Array.from({ length: question.max || 5 }, (_, i) => i + 1).map((rating) => (
                <button
                  key={rating}
                  onClick={() => handleAnswer(question.id, rating)}
                  className={`p-2 rounded-lg transition-colors ${
                    answers[question.id] >= rating
                      ? 'bg-yellow-100 text-yellow-600'
                      : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                  }`}
                >
                  ⭐
                </button>
              ))}
            </div>
            <div className="flex justify-between text-sm text-gray-500">
              <span>{question.labels?.min || 'Poor'}</span>
              <span>{question.labels?.max || 'Excellent'}</span>
            </div>
          </div>
        );

      case 'text':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {questionNumber}. {question.question}
            </h3>
            {question.description && (
              <p className="text-gray-600 mb-4">{question.description}</p>
            )}
            <textarea
              value={answers[question.id] || ''}
              onChange={(e) => handleAnswer(question.id, e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder={question.placeholder || 'Your answer...'}
            />
          </div>
        );

      case 'checkbox':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {questionNumber}. {question.question}
            </h3>
            {question.description && (
              <p className="text-gray-600 mb-4">{question.description}</p>
            )}
            <div className="space-y-3">
              {question.options.map((option, optionIndex) => (
                <label
                  key={optionIndex}
                  className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={(answers[question.id] || []).includes(option.value)}
                    onChange={(e) => {
                      const currentAnswers = answers[question.id] || [];
                      if (e.target.checked) {
                        handleAnswer(question.id, [...currentAnswers, option.value]);
                      } else {
                        handleAnswer(question.id, currentAnswers.filter(a => a !== option.value));
                      }
                    }}
                    className="sr-only"
                  />
                  <div className="flex items-center">
                    <div className={`w-5 h-5 border-2 rounded mr-3 flex items-center justify-center ${
                      (answers[question.id] || []).includes(option.value)
                        ? 'border-blue-600 bg-blue-600'
                        : 'border-gray-300'
                    }`}>
                      {(answers[question.id] || []).includes(option.value) && (
                        <CheckCircle className="h-3 w-3 text-white" />
                      )}
                    </div>
                    <span className="text-gray-900">{option.label}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (!isOpen || !surveyData) return null;

  const currentQuestion = surveyData.questions[currentStep];
  const progress = ((currentStep + 1) / surveyData.questions.length) * 100;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {isCompleted ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Survey Completed!</h2>
              <p className="text-gray-600 mb-6">Thank you for your valuable feedback.</p>
              <button
                onClick={onClose}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Close
              </button>
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  {surveyData.title}
                </h2>
                {surveyData.description && (
                  <p className="text-gray-600">{surveyData.description}</p>
                )}
                
                {/* Progress Bar */}
                <div className="mt-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>Question {currentStep + 1} of {surveyData.questions.length}</span>
                    <span>{Math.round(progress)}% Complete</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Question */}
              <div className="mb-6">
                {renderQuestion(currentQuestion, currentStep)}
              </div>

              {/* Navigation */}
              <div className="flex justify-between">
                <button
                  onClick={handlePrevious}
                  disabled={currentStep === 0}
                  className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-800 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Previous
                </button>
                
                <button
                  onClick={handleNext}
                  disabled={isSubmitting}
                  className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Submitting...
                    </>
                  ) : (
                    <>
                      {currentStep === surveyData.questions.length - 1 ? 'Complete' : 'Next'}
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </>
                  )}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserSurvey;
