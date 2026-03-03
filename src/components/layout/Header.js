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

  const draftDropdownRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (showDraftDropdown && draftDropdownRef.current && !draftDropdownRef.current.contains(e.target)) {
        setShowDraftDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showDraftDropdown]);

  return (
    <>
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-[95%] xl:max-w-[1600px] mx-auto px-3 sm:px-4 lg:px-6">
          {/* Main Header Row */}
          <div className="flex justify-between items-center py-3">
            {/* Logo and Title */}
            <div className="flex items-center min-w-0 flex-1 lg:flex-initial">
              <div className="flex items-center space-x-2 lg:space-x-3 min-w-0">
                <img 
                  src="/logo.png" 
                  alt="Restauranteur" 
                  className="w-8 h-8 lg:w-9 lg:h-9 flex-shrink-0 object-contain"
                />
                <div className="min-w-0 hidden sm:block">
                  <h1 className="text-base lg:text-xl font-bold text-slate-900 truncate">
                    Restaurant Planner
                  </h1>
                  <p className="text-xs text-slate-500 hidden lg:block truncate">
                    Business plans with city-specific data
                  </p>
                </div>
              </div>
            </div>

            {/* Project Selector - Center/Right on desktop */}
            <div ref={draftDropdownRef} className="relative flex-1 flex justify-center mx-4 max-w-md hidden lg:flex">
              {currentDraft ? (
                <>
                  <button
                    onClick={() => setShowDraftDropdown(!showDraftDropdown)}
                    className="flex items-center gap-3 w-full max-w-sm px-4 py-2.5 rounded-lg border border-slate-200 bg-slate-50/50 hover:bg-slate-100 hover:border-slate-300 transition-colors text-left group"
                    title="Switch project"
                  >
                    <div className="p-1.5 rounded-md bg-white border border-slate-200 group-hover:border-slate-300">
                      <FileText className="w-4 h-4 text-slate-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-medium text-slate-900 truncate">{currentDraft.name}</div>
                      <div className="text-xs text-slate-500 flex items-center gap-1">
                        {(state.financialData?.restaurantDetails?.location || currentDraft.financialData?.restaurantDetails?.location) && (
                          <>
                            <MapPin className="w-3 h-3 flex-shrink-0" />
                            <span className="truncate">{state.financialData?.restaurantDetails?.location || currentDraft.financialData?.restaurantDetails?.location}</span>
                            <span className="text-slate-400">·</span>
                          </>
                        )}
                        <span>{state.drafts.length} project{state.drafts.length !== 1 ? 's' : ''}</span>
                      </div>
                    </div>
                    <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${showDraftDropdown ? 'rotate-180' : ''}`} />
                  </button>

                  {showDraftDropdown && (
                    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-80 bg-white rounded-xl border border-slate-200 shadow-xl z-50 overflow-hidden">
                      <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
                        <span className="text-sm font-medium text-slate-500">Projects</span>
                        <button
                          onClick={() => {
                            setShowDraftManager(true);
                            setShowDraftDropdown(false);
                          }}
                          className="text-sm font-medium text-slate-600 hover:text-slate-900"
                        >
                          Manage all
                        </button>
                      </div>
                      <div className="max-h-72 overflow-y-auto py-1">
                        {state.drafts.map((draft) => (
                          <button
                            key={draft.id}
                            onClick={() => handleSwitchDraft(draft.id)}
                            className={`w-full text-left px-4 py-3 flex items-center gap-3 transition-colors ${
                              draft.id === state.currentDraftId 
                                ? 'bg-slate-100 text-slate-900' 
                                : 'text-slate-700 hover:bg-slate-50'
                            }`}
                          >
                            <FileText className={`w-4 h-4 flex-shrink-0 ${draft.id === state.currentDraftId ? 'text-slate-600' : 'text-slate-400'}`} />
                            <div className="min-w-0 flex-1">
                              <div className="font-medium truncate">{draft.name}</div>
                              <div className="text-xs text-slate-500 mt-0.5">
                                {draft.financialData?.restaurantDetails?.location && (
                                  <span className="mr-2">{draft.financialData.restaurantDetails.location}</span>
                                )}
                                {draft.updatedAt
                                  ? new Date(draft.updatedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
                                  : '—'}
                              </div>
                            </div>
                            {draft.id === state.currentDraftId && (
                              <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                            )}
                          </button>
                        ))}
                        <button
                          onClick={handleCreateQuickDraft}
                          className="w-full text-left px-4 py-3 flex items-center gap-3 text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors border-t border-slate-100"
                        >
                          <div className="w-8 h-8 rounded-lg border-2 border-dashed border-slate-300 flex items-center justify-center">
                            <Plus className="w-4 h-4" />
                          </div>
                          <span className="font-medium">New project</span>
                        </button>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <button
                  onClick={handleCreateQuickDraft}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-dashed border-slate-300 text-slate-600 hover:border-slate-400 hover:text-slate-900 hover:bg-slate-50 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span className="font-medium">Create project</span>
                </button>
              )}
            </div>
            
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
            <div className="lg:hidden border-t border-slate-200 bg-slate-50/50">
              <div className="px-4 py-4 space-y-3">
                {/* Project Selector - Mobile */}
                <div className="space-y-1">
                  <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Project</span>
                  {currentDraft ? (
                    <div className="rounded-lg border border-slate-200 bg-white p-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <div className="font-medium text-slate-900">{currentDraft.name}</div>
                          {(state.financialData?.restaurantDetails?.location || currentDraft.financialData?.restaurantDetails?.location) && (
                            <div className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {state.financialData?.restaurantDetails?.location || currentDraft.financialData?.restaurantDetails?.location}
                            </div>
                          )}
                        </div>
                        <button
                          onClick={() => {
                            setShowDraftManager(true);
                            setShowMobileMenu(false);
                          }}
                          className="text-sm font-medium text-slate-600 hover:text-slate-900 shrink-0"
                        >
                          Switch
                        </button>
                      </div>
                      {state.drafts.length > 1 && (
                        <div className="mt-2 text-xs text-slate-500">
                          {state.drafts.length} projects — tap Switch to change
                        </div>
                      )}
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        handleCreateQuickDraft();
                        setShowMobileMenu(false);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg border border-dashed border-slate-300 text-slate-600 hover:bg-white"
                    >
                      <Plus className="w-4 h-4" />
                      <span className="font-medium">Create project</span>
                    </button>
                  )}
                </div>

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
        onSubmit={({ projectName, projectIntent, enabledFeatures, location }) => {
          actions.createDraft(projectName || 'My Restaurant Plan', null, projectIntent, enabledFeatures, location);
          setShowProjectSetupModal(false);
          actions.showMessage('Success', 'New project created.', 'success');
        }}
      />
    </>
  );
};

export default Header;