import React, { useState, useEffect } from 'react';
import { 
  getPendingInvitations, 
  acceptInvitation, 
  declineInvitation 
} from '../../services/sharingService';
import { 
  Mail, 
  CheckCircle, 
  XCircle, 
  Clock,
  User,
  FileText,
  Loader2
} from 'lucide-react';

const InvitationManager = () => {
  const [invitations, setInvitations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(null);

  useEffect(() => {
    loadInvitations();
    // Refresh every 30 seconds
    const interval = setInterval(loadInvitations, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadInvitations = async () => {
    try {
      const pending = await getPendingInvitations();
      setInvitations(pending);
    } catch (error) {
      console.error('Error loading invitations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (shareId) => {
    setProcessing(shareId);
    try {
      await acceptInvitation(shareId);
      await loadInvitations();
    } catch (error) {
      console.error('Error accepting invitation:', error);
    } finally {
      setProcessing(null);
    }
  };

  const handleDecline = async (shareId) => {
    setProcessing(shareId);
    try {
      await declineInvitation(shareId);
      await loadInvitations();
    } catch (error) {
      console.error('Error declining invitation:', error);
    } finally {
      setProcessing(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
      </div>
    );
  }

  if (invitations.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <Mail className="w-12 h-12 mx-auto mb-2 opacity-50" />
        <p>No pending invitations</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {invitations.map((invitation) => (
        <div
          key={invitation.id}
          className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <User className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {invitation.ownerEmail}
                  </p>
                  <p className="text-xs text-gray-600">
                    wants to share a project with you
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4 text-xs text-gray-500 mt-2">
                <div className="flex items-center space-x-1">
                  <FileText className="w-3 h-3" />
                  <span>Draft ID: {invitation.draftId.substring(0, 8)}...</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="w-3 h-3" />
                  <span>
                    {invitation.createdAt?.toDate 
                      ? new Date(invitation.createdAt.toDate()).toLocaleDateString()
                      : 'Recently'}
                  </span>
                </div>
                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded">
                  {invitation.permission === 'editor' ? 'Editor' : 'Viewer'}
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-2 ml-4">
              <button
                onClick={() => handleAccept(invitation.id)}
                disabled={processing === invitation.id}
                className="flex items-center space-x-1 px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                {processing === invitation.id ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    <span>Accept</span>
                  </>
                )}
              </button>
              <button
                onClick={() => handleDecline(invitation.id)}
                disabled={processing === invitation.id}
                className="flex items-center space-x-1 px-3 py-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                <XCircle className="w-4 h-4" />
                <span>Decline</span>
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default InvitationManager;

