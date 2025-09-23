import React, { useState } from 'react';
import { Shield, Lock, Eye, AlertTriangle, CheckCircle } from 'lucide-react';

const TermsAndPrivacy = ({ onAccept, onDecline }) => {
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [acceptedPrivacy, setAcceptedPrivacy] = useState(false);
  const [showFullTerms, setShowFullTerms] = useState(false);

  const handleAccept = () => {
    if (acceptedTerms && acceptedPrivacy) {
      onAccept();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center space-x-3 mb-6">
            <Shield className="h-8 w-8 text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-900">Terms of Service & Privacy Notice</h2>
          </div>

          <div className="space-y-6">
            {/* Beta Testing Notice */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-yellow-800">Beta Testing Agreement</h3>
                  <p className="text-sm text-yellow-700 mt-1">
                    You are accessing a beta version of our restaurant startup planning application. 
                    By using this application, you agree to participate in beta testing and provide feedback.
                  </p>
                </div>
              </div>
            </div>

            {/* Data Protection Notice */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <Lock className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-blue-800">Data Protection</h3>
                  <p className="text-sm text-blue-700 mt-1">
                    Your data is protected and will not be shared with third parties. 
                    All information is encrypted and stored securely.
                  </p>
                </div>
              </div>
            </div>

            {/* Terms Summary */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Key Terms:</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>This is a beta version for testing purposes only</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Do not use for actual business planning without verification</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Your data will be used to improve the application</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Report bugs and provide feedback when possible</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Do not share access credentials with unauthorized users</span>
                </li>
              </ul>
            </div>

            {/* Privacy Notice */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Privacy Notice:</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-start space-x-3">
                  <Eye className="h-5 w-5 text-gray-600 mt-0.5" />
                  <div className="text-sm text-gray-700">
                    <p className="mb-2">
                      <strong>Data Collection:</strong> We collect usage data, form inputs, and feedback to improve the application.
                    </p>
                    <p className="mb-2">
                      <strong>Data Usage:</strong> Your data is used solely for application development and improvement.
                    </p>
                    <p className="mb-2">
                      <strong>Data Storage:</strong> Data is stored securely and encrypted in our Firebase database.
                    </p>
                    <p>
                      <strong>Data Sharing:</strong> We do not share your personal data with third parties.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Full Terms Toggle */}
            <div>
              <button
                onClick={() => setShowFullTerms(!showFullTerms)}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                {showFullTerms ? 'Hide' : 'Show'} Full Terms of Service
              </button>
              
              {showFullTerms && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg text-sm text-gray-700 max-h-60 overflow-y-auto">
                  <h4 className="font-semibold mb-2">Complete Terms of Service</h4>
                  <div className="space-y-3">
                    <p>
                      <strong>1. Beta Testing Agreement:</strong> By using this application, you agree to participate in beta testing. 
                      This software is provided "as is" and may contain bugs or incomplete features.
                    </p>
                    <p>
                      <strong>2. Limitation of Liability:</strong> The developers are not liable for any damages arising from the use of this application. 
                      Use at your own risk.
                    </p>
                    <p>
                      <strong>3. Data Usage:</strong> You grant permission to use your data for application improvement, 
                      provided it is anonymized and aggregated.
                    </p>
                    <p>
                      <strong>4. Intellectual Property:</strong> The application and its features are proprietary. 
                      Do not attempt to reverse engineer or copy the code.
                    </p>
                    <p>
                      <strong>5. Termination:</strong> Access may be terminated at any time without notice.
                    </p>
                    <p>
                      <strong>6. Updates:</strong> Terms may be updated. Continued use constitutes acceptance of new terms.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Acceptance Checkboxes */}
            <div className="space-y-3">
              <label className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  checked={acceptedTerms}
                  onChange={(e) => setAcceptedTerms(e.target.checked)}
                  className="mt-1 h-4 w-4 text-blue-600 rounded"
                />
                <span className="text-sm text-gray-700">
                  I have read and agree to the Terms of Service and Beta Testing Agreement
                </span>
              </label>
              
              <label className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  checked={acceptedPrivacy}
                  onChange={(e) => setAcceptedPrivacy(e.target.checked)}
                  className="mt-1 h-4 w-4 text-blue-600 rounded"
                />
                <span className="text-sm text-gray-700">
                  I have read and agree to the Privacy Notice and data usage terms
                </span>
              </label>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={onDecline}
              className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Decline
            </button>
            <button
              onClick={handleAccept}
              disabled={!acceptedTerms || !acceptedPrivacy}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              Accept & Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsAndPrivacy;
