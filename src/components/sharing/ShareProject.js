import React, { useState, useEffect } from 'react';
import { useApp } from '../../contexts/AppContext';
import { 
  shareDraft, 
  getDraftShares, 
  removeShare, 
  updateSharePermission,
  PERMISSION_LEVELS 
} from '../../services/sharingService';
import { 
  Share2, 
  Mail, 
  UserPlus, 
  X, 
  Edit, 
  Eye, 
  Crown,
  CheckCircle,
  AlertCircle,
  Loader2
} from 'lucide-react';

const ShareProject = ({ draftId, onClose }) => {
  const { state } = useApp();
  const [email, setEmail] = useState('');
  const [permission, setPermission] = useState(PERMISSION_LEVELS.VIEWER);
  const [shares, setShares] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sharing, setSharing] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const currentDraft = state.drafts.find(d => d.id === draftId);

  useEffect(() => {
    if (draftId) {
      loadShares();
    }
  }, [draftId]);

  const loadShares = async () => {
    setLoading(true);
    try {
      const draftShares = await getDraftShares(draftId);
      setShares(draftShares);
    } catch (err) {
      setError('Failed to load shares');
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Please enter an email address');
      return;
    }

    setSharing(true);
    setError(null);
    setSuccess(null);

    try {
      await shareDraft(draftId, email.trim(), permission);
      setSuccess(`Invitation sent to ${email}`);
      setEmail('');
      await loadShares();
    } catch (err) {
      setError(err.message || 'Failed to share project');
    } finally {
      setSharing(false);
    }
  };

  const handleRemoveShare = async (shareId) => {
    if (!window.confirm('Are you sure you want to remove this collaborator?')) {
      return;
    }

    try {
      await removeShare(shareId, draftId);
      setSuccess('Collaborator removed');
      await loadShares();
    } catch (err) {
      setError(err.message || 'Failed to remove collaborator');
    }
  };

  const handleUpdatePermission = async (shareId, newPermission) => {
    try {
      await updateSharePermission(shareId, newPermission);
      setSuccess('Permission updated');
      await loadShares();
    } catch (err) {
      setError(err.message || 'Failed to update permission');
    }
  };

  const getPermissionIcon = (perm) => {
    switch (perm) {
      case PERMISSION_LEVELS.OWNER:
        return <Crown className="w-4 h-4 text-yellow-600" />;
      case PERMISSION_LEVELS.EDITOR:
        return <Edit className="w-4 h-4 text-blue-600" />;
      case PERMISSION_LEVELS.VIEWER:
        return <Eye className="w-4 h-4 text-gray-600" />;
      default:
        return <Eye className="w-4 h-4" />;
    }
  };

  const getPermissionLabel = (perm) => {
    switch (perm) {
      case PERMISSION_LEVELS.OWNER:
        return 'Owner';
      case PERMISSION_LEVELS.EDITOR:
        return 'Editor';
      case PERMISSION_LEVELS.VIEWER:
        return 'Viewer';
      default:
        return perm;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <Share2 className="w-6 h-6 text-blue-600" />
            <div>
              <h2 className="text-xl font-bold text-gray-900">Share Project</h2>
              <p className="text-sm text-gray-600">{currentDraft?.name || 'Draft'}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Share Form */}
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center">
              <UserPlus className="w-4 h-4 mr-2" />
              Invite Collaborator
            </h3>
            <form onSubmit={handleShare} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="flex space-x-2">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="collaborator@example.com"
                    className="flex-1 form-input"
                    required
                  />
                  <button
                    type="submit"
                    disabled={sharing}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                  >
                    {sharing ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <Mail className="w-4 h-4" />
                        <span>Send Invite</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Permission Level
                </label>
                <select
                  value={permission}
                  onChange={(e) => setPermission(e.target.value)}
                  className="form-input w-full"
                >
                  <option value={PERMISSION_LEVELS.VIEWER}>
                    Viewer - Can view only
                  </option>
                  <option value={PERMISSION_LEVELS.EDITOR}>
                    Editor - Can view and edit
                  </option>
                </select>
              </div>
            </form>
          </div>

          {/* Messages */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start space-x-2">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {success && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-start space-x-2">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-green-700">{success}</p>
            </div>
          )}

          {/* Current Collaborators */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">
              Collaborators ({shares.length})
            </h3>
            
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
              </div>
            ) : shares.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Share2 className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No collaborators yet. Share this project to get started!</p>
              </div>
            ) : (
              <div className="space-y-2">
                {/* Owner */}
                <div className="flex items-center justify-between p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Crown className="w-5 h-5 text-yellow-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {state.user?.email || 'You'}
                      </p>
                      <p className="text-xs text-gray-600">Owner</p>
                    </div>
                  </div>
                  <span className="text-xs text-gray-500">Full access</span>
                </div>

                {/* Shared Users */}
                {shares.map((share) => (
                  <div
                    key={share.id}
                    className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      {getPermissionIcon(share.permission)}
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {share.sharedWithEmail}
                        </p>
                        <p className="text-xs text-gray-600">
                          {getPermissionLabel(share.permission)} • {share.status}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {share.status === 'accepted' && (
                        <select
                          value={share.permission}
                          onChange={(e) => handleUpdatePermission(share.id, e.target.value)}
                          className="text-xs border border-gray-300 rounded px-2 py-1"
                        >
                          <option value={PERMISSION_LEVELS.VIEWER}>Viewer</option>
                          <option value={PERMISSION_LEVELS.EDITOR}>Editor</option>
                        </select>
                      )}
                      <button
                        onClick={() => handleRemoveShare(share.id)}
                        className="text-red-600 hover:text-red-800"
                        title="Remove collaborator"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <h4 className="text-sm font-semibold text-gray-900 mb-2">Permission Levels</h4>
            <ul className="text-xs text-gray-600 space-y-1">
              <li className="flex items-start">
                <Eye className="w-3 h-3 mr-2 mt-0.5 flex-shrink-0" />
                <span><strong>Viewer:</strong> Can view the project but cannot make changes</span>
              </li>
              <li className="flex items-start">
                <Edit className="w-3 h-3 mr-2 mt-0.5 flex-shrink-0" />
                <span><strong>Editor:</strong> Can view and edit all sections of the project</span>
              </li>
              <li className="flex items-start">
                <Crown className="w-3 h-3 mr-2 mt-0.5 flex-shrink-0" />
                <span><strong>Owner:</strong> Full control, including sharing and deletion</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShareProject;

