import React, { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import { Building2, Save, User, FileText, ChevronDown, GitCompare, LogIn, UserCircle, LogOut, Menu, X } from 'lucide-react';
import DraftManager from './DraftManager';
import DraftComparison from './DraftComparison';
import AuthModal from '../auth/AuthModal';
import UserProfile from '../auth/UserProfile';

const Header = () => {
  const { state, actions } = useApp();
  const [showDraftManager, setShowDraftManager] = useState(false);
  const [showDraftDropdown, setShowDraftDropdown] = useState(false);
  const [showDraftComparison, setShowDraftComparison] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showUserProfile, setShowUserProfile] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const currentDraft = state.drafts.find(draft => draft.id === state.currentDraftId);

  const handleSave = async () => {
    await actions.saveData();
  };

  const handleSwitchDraft = (draftId) => {
    actions.setCurrentDraftId(draftId);
    setShowDraftDropdown(false);
  };

  const handleCreateQuickDraft = () => {
    const draftName = `Draft ${state.drafts.length + 1}`;
    actions.createDraft(draftName);
    setShowDraftDropdown(false);
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

  return (
    <>
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Main Header Row */}
          <div className="flex justify-between items-center py-4">
            {/* Logo and Title - Mobile Responsive */}
            <div className="flex items-center space-x-3 lg:space-x-6">
              <div className="flex items-center space-x-2 lg:space-x-3">
                <Building2 className="w-6 h-6 lg:w-8 lg:h-8 text-blue-600 flex-shrink-0" />
                <div className="min-w-0">
                  <h1 className="text-lg lg:text-2xl font-bold text-gray-900 truncate">
                    <span className="hidden sm:inline">Boston Restaurant Business Planning</span>
                    <span className="sm:hidden">Restaurant Planner</span>
                  </h1>
                  <p className="text-xs lg:text-sm text-gray-600 hidden lg:block">
                    Create comprehensive restaurant business plans with local market data
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
                          className={`w-full text-left px-3 py-2 hover:bg-gray-50 transition-colors ${
                            draft.id === state.currentDraftId ? 'bg-blue-50 text-blue-900' : 'text-gray-700'
                          }`}
                        >
                          <div className="font-medium">{draft.name}</div>
                          <div className="text-xs text-gray-500">
                            Updated {new Date(draft.updatedAt).toLocaleDateString()}
                          </div>
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
              {/* User Info */}
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <User className="w-4 h-4" />
                <span>
                  {state.user?.displayName || 
                   (state.user?.email ? state.user.email.split('@')[0] : 
                    state.isAuthenticated ? `User: ${state.userId?.slice(-8)}` : 'Anonymous User')}
                </span>
              </div>

              {/* Draft Count Badge */}
              {state.drafts.length > 1 && (
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <FileText className="w-4 h-4" />
                  <span>{state.drafts.length} drafts</span>
                </div>
              )}

              {/* Authentication Buttons */}
              {state.isAuthenticated ? (
                <div className="relative">
                  <button
                    onClick={() => setShowUserDropdown(!showUserDropdown)}
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
              
              <button
                onClick={handleSave}
                disabled={state.isLoading || !state.currentDraftId}
                className="btn-primary flex items-center space-x-2 disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>Save Draft</span>
              </button>
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
                  <button
                    onClick={() => {
                      handleSave();
                      setShowMobileMenu(false);
                    }}
                    disabled={state.isLoading || !state.currentDraftId}
                    className="w-full btn-primary flex items-center justify-center space-x-2 disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Draft</span>
                  </button>

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
          onClose={() => setShowUserProfile(false)} 
        />
      )}
    </>
  );
};

export default Header;