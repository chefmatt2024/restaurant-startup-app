import React from 'react';
import { useApp } from '../../contexts/AppContext';
import { 
  CheckCircle, 
  Save, 
  Cloud, 
  Users, 
  FileText, 
  X,
  ArrowRight
} from 'lucide-react';

const WelcomeMessage = ({ isOpen, onClose }) => {
  const { state, actions } = useApp();
  // const [currentStep, setCurrentStep] = useState(0);

  const features = [
    {
      icon: <Save className="w-8 h-8 text-blue-600" />,
      title: "Save Your Progress",
      description: "Your business plans are automatically saved and synced across devices."
    },
    {
      icon: <Cloud className="w-8 h-8 text-green-600" />,
      title: "Cloud Backup",
      description: "Never lose your work. All data is securely backed up in the cloud."
    },
    {
      icon: <Users className="w-8 h-8 text-purple-600" />,
      title: "Multiple Drafts",
      description: "Create and compare different business plan versions side by side."
    },
    {
      icon: <FileText className="w-8 h-8 text-orange-600" />,
      title: "Export & Share",
      description: "Generate professional business plans and share with investors."
    }
  ];

  const handleGetStarted = () => {
    onClose();
    // Optionally redirect to a specific tab
    actions.setActiveTab('idea-formation');
    // Trigger welcome tour after a short delay
    setTimeout(() => {
      const tourCompleted = localStorage.getItem('welcomeTourCompleted');
      if (!tourCompleted) {
        // Tour will be triggered by Dashboard component
      }
    }, 1000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Welcome to Your Account!</h2>
              <p className="text-sm text-gray-600">Your restaurant business planning journey starts here</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="text-center mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              🎉 Account Created Successfully!
            </h3>
            <p className="text-gray-600">
              You now have access to all premium features. Here's what you can do:
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {features.map((feature, index) => (
              <div key={index} className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
                <div className="flex-shrink-0">
                  {feature.icon}
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">{feature.title}</h4>
                  <p className="text-sm text-gray-600">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Current Data Status */}
          {state.drafts && state.drafts.length > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex items-center space-x-2 mb-2">
                <FileText className="w-5 h-5 text-blue-600" />
                <h4 className="font-semibold text-blue-900">Your Existing Data</h4>
              </div>
              <p className="text-sm text-blue-700">
                We found {state.drafts.length} business plan draft{state.drafts.length !== 1 ? 's' : ''} 
                {' '}that have been automatically saved to your account.
              </p>
            </div>
          )}

          {/* Quick Start Options */}
          <div className="space-y-3">
            <h4 className="font-semibold text-gray-900">Quick Start Options:</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={() => {
                  actions.setActiveTab('idea-formation');
                  onClose();
                }}
                className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
              >
                <div className="text-left">
                  <div className="font-medium text-blue-900">Start New Plan</div>
                  <div className="text-sm text-blue-600">Begin with idea formation</div>
                </div>
                <ArrowRight className="w-5 h-5 text-blue-600" />
              </button>
              
              <button
                onClick={() => {
                  actions.setActiveTab('timeline');
                  onClose();
                }}
                className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors"
              >
                <div className="text-left">
                  <div className="font-medium text-green-900">View Timeline</div>
                  <div className="text-sm text-green-600">Plan your restaurant opening</div>
                </div>
                <ArrowRight className="w-5 h-5 text-green-600" />
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-xl">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-600">
              Need help? Check out our guides and tutorials.
            </div>
            <button
              onClick={handleGetStarted}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors flex items-center space-x-2"
            >
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeMessage;
