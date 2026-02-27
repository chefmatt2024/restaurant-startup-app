import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../../contexts/AppContext';
import { Building2, Save, User, FileText, ChevronDown, GitCompare, LogIn, UserCircle, LogOut, Menu, X, Mail, Bell, CheckCircle, Loader2, AlertCircle } from 'lucide-react';
import DraftManager from './DraftManager';
import DraftComparison from './DraftComparison';
import AuthModal from '../auth/EnhancedAuthModal';
import UserProfile from '../auth/UserProfile';
import TrialStatus from '../auth/TrialStatus';
import InvitationManager from '../sharing/InvitationManager';
import ProjectSetupModal from './ProjectSetupModal';
import { getPendingInvitations } from '../../services/sharingService';
import { getNotifications } from '../../utils/notificationsUtils';

const Header = () => {
  const { state, actions } = useApp();
  const [showDraftManager, setShowDraftManager] = useState(false);
  const [showDraftDropdown, setShowDraftDropdown] = useState(false);
  const [showProjectSetupModal, setShowProjectSetupModal] = useState(false);
  const [showDraftComparison, setShowDraftComparison] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showUserProfile, setShowUserProfile] = useState(false);
  const [userProfileSection, setUserProfileSection] = useState('profile');
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showInvitations, setShowInvitations] = useState(false);
  const [pendingInvitations, setPendingInvitations] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  const currentDraft = state.drafts.find(draft => draft.id === state.currentDraftId);
  const notifications = useMemo(() => getNotifications(state), [state.notificationReadIds, state.openingPlanProgress, state.subscription]);

  const handleSave = async () => {
    await actions.saveData();
  };

  const handleSwitchDraft = (draftId) => {
    actions.setCurrentDraftId(draftId);
    setShowDraftDropdown(false);
  };

  const handleCreateQuickDraft = () => {
    setShowDraftDropdown(false);
    setShowProjectSetupModal(true);
  };

  const handleSignOut = async () => {
    try {
      await actions.signOut();
      setShowUserDropdown(false);
      actions.showMessage('Success', 'Signed out successfully.', 'success');
    } catch (error) {
      // console.error('Error signing out:', error);
      actions.showMessage('Error', 'Failed to sign out. Please try again.', 'error');
    }
  };

  // Load pending invitations
  useEffect(() => {
    if (state.isAuthenticated) {
      loadInvitations();
      const interval = setInterval(loadInvitations, 30000); // Check every 30 seconds
      return () => clearInterval(interval);
    }
  }, [state.isAuthenticated]);

  const loadInvitations = async () => {
    try {
      const invitations = await getPendingInvitations();
      setPendingInvitations(invitations);
    } catch (error) {
      // Silently fail
    }
  };

  return (
    <>
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-[95%] xl:max-w-[1600px] mx-auto px-3 sm:px-4 lg:px-6">
          {/* Main Header Row */}
          <div className="flex justify-between items-center py-4">
            {/* Logo and Title - Mobile Responsive */}
            <div className="flex items-center space-x-3 lg:space-x-6">
              <div className="flex items-center space-x-2 lg:space-x-3">
                <img 
                  src="/logo.png" 
                  alt="Restauranteur System Logo" 
                  className="w-8 h-8 lg:w-10 lg:h-10 flex-shrink-0 object-contain"
                />
                <div className="min-w-0">
                  <h1 className="text-lg lg:text-2xl font-bold text-gray-900 truncate">
                    <span className="hidden sm:inline">Restaurant Business Planning</span>
                    <span className="sm:hidden">Restaurant Planner</span>
                  </h1>
                  <p className="text-xs lg:text-sm text-gray-600 hidden lg:block">
                    Create comprehensive restaurant business plans with city-specific market data
                  </p>
                </div>
              </div>
            </div>

            {/* Draft Selector - Hidden on mobile, shown in mobile menu */}
            {currentDraft && (
              <div className="relative hidden lg:block">
                <button
                  onClick={() => setShowDraftDropdown(!showDraftDropdown)}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  <FileText className="w-4 h-4 text-blue-600" />
                  <div className="text-left">
                    <div className="text-sm font-semibold text-blue-900">
                      {currentDraft.name}
                    </div>
                    <div className="text-xs text-blue-600">
                      Current Draft
                    </div>
                  </div>
                  <ChevronDown className="w-4 h-4 text-blue-600" />
                </button>

                {/* Draft Dropdown */}
                {showDraftDropdown && (
                  <div className="absolute top-full left-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                    <div className="p-3 border-b border-gray-200">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-gray-900">Your Drafts</h3>
                        <button
                          onClick={() => {
                            setShowDraftManager(true);
                            setShowDraftDropdown(false);
                          }}
                          className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                        >
                          Manage All
                        </button>
                      </div>
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                      {state.drafts.map((draft) => (
                        <button
                          key={draft.id}
                          onClick={() => handleSwitchDraft(draft.id)}
                          className={`w-full text-left px-3 py-2 hover:bg-gray-50 transition-colors flex items-center justify-between gap-2 ${
                            draft.id === state.currentDraftId ? 'bg-blue-50 text-blue-900' : 'text-gray-700'
                          }`}
                        >
                          <span className="font-medium truncate min-w-0">{draft.name}</span>
                          <span className="text-xs text-gray-500 whitespace-nowrap shrink-0">
                            {draft.updatedAt
                              ? new Date(draft.updatedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
                              : '—'}
                          </span>
                        </button>
                      ))}
                      <button
                        onClick={handleCreateQuickDraft}
                        className="w-full text-left px-3 py-2 text-blue-600 hover:bg-blue-50 transition-colors border-t border-gray-200"
                      >
                        <div className="font-medium">+ Create New Draft</div>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {/* Right Side - Desktop */}
            <div className="hidden lg:flex items-center space-x-4">
              {/* Trial Status */}
              {state.user?.trialData && (
                <TrialStatus onUpgrade={() => {
                  setUserProfileSection('pricing');
                  setShowUserProfile(true);
                  setShowUserDropdown(false);
                }} />
              )}
              
              {/* Draft Count Badge */}
              {state.drafts.length > 1 && (
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <FileText className="w-4 h-4" />
                  <span>{state.drafts.length} drafts</span>
                </div>
              )}

              {/* In-app Notifications */}
              {state.isAuthenticated && (
                <div className="relative">
                  <button
                    onClick={() => {
                      setShowNotifications(!showNotifications);
                      setShowUserDropdown(false);
                      setShowInvitations(false);
                    }}
                    className="relative flex items-center justify-center w-10 h-10 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                    aria-label={notifications.length ? `${notifications.length} notifications` : 'Notifications'}
                  >
                    <Bell className="w-5 h-5" />
                    {notifications.length > 0 && (
                      <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-amber-500 text-[10px] font-bold text-white">
                        {notifications.length > 3 ? '3+' : notifications.length}
                      </span>
                    )}
                  </button>
                  {showNotifications && (
                    <div className="absolute right-0 top-full mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50 py-1">
                      <div className="px-3 py-2 border-b border-gray-100">
                        <h3 className="font-semibold text-gray-900">Notifications</h3>
                      </div>
                      <div className="max-h-72 overflow-y-auto">
                        {notifications.length === 0 ? (
                          <p className="px-3 py-4 text-sm text-gray-500">You're all caught up.</p>
                        ) : (
                          notifications.map((n) => (
                            <button
                              key={n.id}
                              onClick={() => {
                                actions.markNotificationsRead([n.id]);
                                if (n.actionTab) actions.setActiveTab(n.actionTab);
                                setShowNotifications(false);
                              }}
                              className="w-full text-left px-3 py-2.5 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0"
                            >
                              <div className="font-medium text-gray-900 text-sm">{n.title}</div>
                              <div className="text-xs text-gray-600 mt-0.5">{n.body}</div>
                            </button>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Invitation Notification */}
              {state.isAuthenticated && pendingInvitations.length > 0 && (
                <div className="relative">
                  <button
                    onClick={() => {
                      setShowInvitations(!showInvitations);
                      setShowUserDropdown(false);
                      setShowNotifications(false);
                    }}
                    className="relative flex items-center space-x-2 px-3 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <Bell className="w-5 h-5" />
                    <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {pendingInvitations.length}
                    </span>
                  </button>
                  
                  {/* Invitations Dropdown */}
                  {showInvitations && (
                    <div className="absolute top-full right-0 mt-2 w-96 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
                      <div className="p-4 border-b border-gray-200">
                        <h3 className="font-semibold text-gray-900 flex items-center">
                          <Mail className="w-4 h-4 mr-2" />
                          Pending Invitations ({pendingInvitations.length})
                        </h3>
                      </div>
                      <div className="p-4">
                        <InvitationManager />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Authentication Buttons */}
              {state.isAuthenticated ? (
                <div className="relative">
                  <button
                    onClick={() => {
                      setShowUserDropdown(!showUserDropdown);
                      setShowInvitations(false);
                    }}
                    className="flex items-center space-x-2 px-3 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <UserCircle className="w-5 h-5" />
                    <span>
                      {state.user?.displayName || 
                       (state.user?.email ? state.user.email.split('@')[0] : 'User')}
                    </span>
                    <ChevronDown className="w-4 h-4" />
                  </button>

                  {/* User Dropdown */}
                  {showUserDropdown && (
                    <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                      <div className="p-3 border-b border-gray-200">
                        <div className="text-sm font-semibold text-gray-900">
                          {state.user?.displayName || 'User'}
                        </div>
                        <div className="text-xs text-gray-500">
                          {state.user?.email || 'Anonymous User'}
                        </div>
                      </div>
                      <div className="py-1">
                        <button
                          onClick={() => {
                            setShowUserProfile(true);
                            setShowUserDropdown(false);
                          }}
                          className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center space-x-2"
                        >
                          <UserCircle className="w-4 h-4" />
                          <span>Profile Settings</span>
                        </button>
                        <button
                          onClick={handleSignOut}
                          className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center space-x-2"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="flex items-center space-x-2 px-3 py-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <LogIn className="w-5 h-5" />
                  <span>Sign In</span>
                </button>
              )}
              
              <div className="flex items-center space-x-2">
                {/* Save Status Indicator */}
                {state.saveStatus === 'saving' && (
                  <div className="flex items-center space-x-1 text-blue-600 text-sm">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="hidden sm:inline">Saving...</span>
                  </div>
                )}
                {state.saveStatus === 'saved' && (
                  <div className="flex items-center space-x-1 text-green-600 text-sm">
                    <CheckCircle className="w-4 h-4" />
                    <span className="hidden sm:inline">Saved</span>
                  </div>
                )}
                {state.saveStatus === 'error' && (
                  <div className="flex items-center space-x-1 text-red-600 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    <span className="hidden sm:inline">Error</span>
                  </div>
                )}
                
                {/* Save Button */}
                <button
                  onClick={handleSave}
                  disabled={state.isLoading || !state.currentDraftId || state.saveStatus === 'saving'}
                  className="btn-primary flex items-center space-x-2 disabled:opacity-50"
                  title={state.saveStatus === 'saved' ? 'All changes saved automatically' : 'Save manually'}
                >
                  <Save className="w-4 h-4" />
                  <span className="hidden sm:inline">Save Draft</span>
                  <span className="sm:hidden">Save</span>
                </button>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <div className="lg:hidden">
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                {showMobileMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {showMobileMenu && (
            <div className="lg:hidden border-t border-gray-200 bg-white">
              <div className="px-4 py-4 space-y-4">
                {/* Current Draft - Mobile */}
                {currentDraft && (
                  <div className="border border-gray-200 rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <FileText className="w-4 h-4 text-blue-600" />
                        <div>
                          <div className="text-sm font-semibold text-blue-900">
                            {currentDraft.name}
                          </div>
                          <div className="text-xs text-blue-600">Current Draft</div>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          setShowDraftManager(true);
                          setShowMobileMenu(false);
                        }}
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                      >
                        Manage
                      </button>
                    </div>
                  </div>
                )}

                {/* User Info - Mobile */}
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <User className="w-4 h-4" />
                  <span>
                    {state.user?.displayName || 
                     (state.user?.email ? state.user.email.split('@')[0] : 
                      state.isAuthenticated ? `User: ${state.userId?.slice(-8)}` : 'Anonymous User')}
                  </span>
                </div>

                {/* Draft Count - Mobile */}
                {state.drafts.length > 1 && (
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <FileText className="w-4 h-4" />
                    <span>{state.drafts.length} drafts</span>
                  </div>
                )}

                {/* Mobile Actions */}
                <div className="space-y-2">
                  <div className="w-full space-y-2">
                    {/* Save Status - Mobile */}
                    {state.saveStatus === 'saving' && (
                      <div className="flex items-center justify-center space-x-1 text-blue-600 text-sm">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Saving...</span>
                      </div>
                    )}
                    {state.saveStatus === 'saved' && (
                      <div className="flex items-center justify-center space-x-1 text-green-600 text-sm">
                        <CheckCircle className="w-4 h-4" />
                        <span>Saved</span>
                      </div>
                    )}
                    {state.saveStatus === 'error' && (
                      <div className="flex items-center justify-center space-x-1 text-red-600 text-sm">
                        <AlertCircle className="w-4 h-4" />
                        <span>Error saving</span>
                      </div>
                    )}
                    
                    {/* Save Button - Mobile */}
                    <button
                      onClick={() => {
                        handleSave();
                        setShowMobileMenu(false);
                      }}
                      disabled={state.isLoading || !state.currentDraftId || state.saveStatus === 'saving'}
                      className="w-full btn-primary flex items-center justify-center space-x-2 disabled:opacity-50"
                    >
                      <Save className="w-4 h-4" />
                      <span>Save Draft</span>
                    </button>
                  </div>

                  {state.isAuthenticated ? (
                    <div className="space-y-2">
                      <button
                        onClick={() => {
                          setShowUserProfile(true);
                          setShowMobileMenu(false);
                        }}
                        className="w-full flex items-center justify-center space-x-2 px-3 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <UserCircle className="w-4 h-4" />
                        <span>Profile Settings</span>
                      </button>
                      <button
                        onClick={() => {
                          handleSignOut();
                          setShowMobileMenu(false);
                        }}
                        className="w-full flex items-center justify-center space-x-2 px-3 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        setShowAuthModal(true);
                        setShowMobileMenu(false);
                      }}
                      className="w-full flex items-center justify-center space-x-2 px-3 py-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <LogIn className="w-4 h-4" />
                      <span>Sign In</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Draft Manager Modal */}
      <DraftManager 
        isOpen={showDraftManager} 
        onClose={() => setShowDraftManager(false)} 
      />

      {/* Draft Comparison Modal */}
      <DraftComparison 
        isOpen={showDraftComparison} 
        onClose={() => setShowDraftComparison(false)} 
      />

      {/* Auth Modal */}
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />

      {/* User Profile Modal */}
      {showUserProfile && (
        <UserProfile 
          isOpen={showUserProfile} 
          onClose={() => {
            setShowUserProfile(false);
            setUserProfileSection('profile'); // Reset to profile on close
          }}
          initialSection={userProfileSection}
        />
      )}

      {/* New project setup: intent + optional name */}
      <ProjectSetupModal
        isOpen={showProjectSetupModal}
        isFirstProject={false}
        allowClose={true}
        onClose={() => setShowProjectSetupModal(false)}
        onSubmit={({ projectName, projectIntent, enabledFeatures }) => {
          actions.createDraft(projectName || 'My Restaurant Plan', null, projectIntent, enabledFeatures);
          setShowProjectSetupModal(false);
          actions.showMessage('Success', 'New project created.', 'success');
        }}
      />
    </>
  );
};

export default Header;