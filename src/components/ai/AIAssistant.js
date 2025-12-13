import React, { useState } from 'react';
import { Sparkles, Loader2, Send, X, CheckCircle, AlertCircle, Lightbulb } from 'lucide-react';
import { aiService } from '../../services/aiService';

const AIAssistant = ({ 
  onGenerate, 
  context = {}, 
  section = null,
  placeholder = "Ask me anything about your restaurant business plan...",
  showQuickActions = true 
}) => {
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [showChat, setShowChat] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!question.trim() || loading) return;

    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      const answer = await aiService.answerQuestion(question, context);
      setResponse(answer);
    } catch (err) {
      setError(err.message || 'Failed to get AI response. Please check your API key configuration.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickAction = async (action) => {
    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      let result;
      switch (action) {
        case 'generate':
          if (section) {
            result = await aiService.generateBusinessPlanSection(section, context);
            if (onGenerate) {
              onGenerate(result);
            }
          }
          break;
        case 'research':
          result = await aiService.researchMarketData(context.location, context.concept);
          setResponse(result);
          break;
        case 'improve':
          if (context.content) {
            result = await aiService.suggestImprovements(context.content, section || 'this section');
            setResponse(result);
          }
          break;
        case 'autoFill':
          if (section) {
            result = await aiService.autoFillFormSection(section, context);
            if (onGenerate) {
              onGenerate(result);
            }
          }
          break;
        default:
          break;
      }
    } catch (err) {
      setError(err.message || 'Failed to process request. Please check your API key configuration.');
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    { id: 'generate', label: 'Generate Content', icon: Sparkles, description: 'AI will generate this section' },
    { id: 'autoFill', label: 'Auto-Fill', icon: CheckCircle, description: 'Complete missing fields' },
    { id: 'research', label: 'Research Market', icon: Lightbulb, description: 'Get market data & insights' },
    { id: 'improve', label: 'Improve Content', icon: AlertCircle, description: 'Get improvement suggestions' },
  ];

  if (!showChat && !showQuickActions) {
    return (
      <button
        onClick={() => setShowChat(true)}
        className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-colors z-50"
        title="Open AI Assistant"
      >
        <Sparkles className="w-6 h-6" />
      </button>
    );
  }

  return (
    <div className="space-y-4">
      {/* Quick Actions */}
      {showQuickActions && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <button
                key={action.id}
                onClick={() => handleQuickAction(action.id)}
                disabled={loading}
                className="flex flex-col items-center p-4 bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-lg hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Icon className="w-5 h-5 text-blue-600 mb-2" />
                <span className="text-sm font-semibold text-gray-800">{action.label}</span>
                <span className="text-xs text-gray-600 mt-1">{action.description}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Chat Interface */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-blue-600" />
            <h3 className="font-semibold text-gray-900">AI Assistant</h3>
          </div>
          {showChat && (
            <button
              onClick={() => setShowChat(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Response Display */}
        {(response || error) && (
          <div className="p-4 border-b border-gray-200 max-h-96 overflow-y-auto">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-start space-x-2">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-red-800 mb-1">Error</h4>
                    <p className="text-sm text-red-700">{error}</p>
                    {error.includes('API key') && (
                      <p className="text-xs text-red-600 mt-2">
                        Add your API key to <code className="bg-red-100 px-1 rounded">.env.local</code>:
                        <br />
                        <code>REACT_APP_OPENAI_API_KEY=your_key_here</code>
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
            {response && (
              <div className="prose prose-sm max-w-none">
                <div className="whitespace-pre-wrap text-gray-700">{response}</div>
              </div>
            )}
          </div>
        )}

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="p-4">
          <div className="flex space-x-2">
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder={placeholder}
              className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !question.trim()}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Thinking...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Ask</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AIAssistant;

