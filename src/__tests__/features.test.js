/**
 * Feature smoke tests: render each major feature and assert no errors.
 * Firebase and analytics are mocked so tests run without real backend.
 */

import React from 'react';
import { screen } from '@testing-library/react';
import { renderWithApp, getMockAppState, getMockActions } from '../test-utils';

// Mock Firebase before any component that uses it is loaded
jest.mock('../services/firebase', () => ({
  authService: {
    onAuthStateChanged: (callback) => {
      setTimeout(() => callback(null), 0);
      return () => {};
    },
    signInWithEmailAndPassword: () => Promise.resolve({ user: { uid: 'test' } }),
    signInWithGoogle: () => Promise.resolve({ user: { uid: 'test' } }),
    signOut: () => Promise.resolve(),
    createUserWithEmailAndPassword: () => Promise.resolve({ user: { uid: 'test' } }),
    sendPasswordResetEmail: () => Promise.resolve(),
    getCurrentUser: () => null,
    getUserId: () => null,
  },
  dbService: {
    getDrafts: () => Promise.resolve([]),
    saveDraft: () => Promise.resolve(),
    saveDraftsMetadata: () => Promise.resolve(),
    getBusinessPlan: () => Promise.resolve(null),
    saveBusinessPlan: () => Promise.resolve(),
  },
  getAppId: () => 'test-app',
  getInitialAuthToken: () => null,
  getAllUsers: () => Promise.resolve([]),
  deleteUserAccount: () => Promise.resolve(),
}));

// Mock analytics (used by various components)
jest.mock('../services/analytics', () => ({
  default: {
    track: jest.fn(),
    trackPageView: jest.fn(),
  },
}));

// Mock Stripe
jest.mock('@stripe/react-stripe-js', () => ({
  loadStripe: () => Promise.resolve(null),
  Elements: ({ children }) => children,
  useStripe: () => null,
  useElements: () => null,
}));

describe('Feature smoke tests', () => {
  describe('Financial tab', () => {
    it('renders FinancialProjections without error', () => {
      const FinancialProjections = require('../components/financial/FinancialProjections').default;
      const { getInitialAppState } = require('../contexts/AppContext');
      const state = getMockAppState({
        activeTab: 'financials',
        financialData: getInitialAppState().financialData || {},
      });
      expect(() => {
        renderWithApp(<FinancialProjections />, { state });
      }).not.toThrow();
      expect(screen.getByRole('heading', { name: 'Restaurant Type & Initial Costs' })).toBeInTheDocument();
    });
  });

  describe('Tab navigation', () => {
    it('renders TabNavigation without error', () => {
      const TabNavigation = require('../components/layout/TabNavigation').default;
      const state = getMockAppState();
      expect(() => {
        renderWithApp(<TabNavigation />, { state });
      }).not.toThrow();
      expect(screen.getByRole('navigation', { name: /section navigation/i })).toBeInTheDocument();
    });
  });

  describe('Project setup', () => {
    it('renders ProjectSetupModal without error', () => {
      const ProjectSetupModal = require('../components/layout/ProjectSetupModal').default;
      const actions = getMockActions();
      expect(() => {
        renderWithApp(
          <ProjectSetupModal isOpen={true} onClose={() => {}} isFirstProject={true} allowClose={false} />,
          { actions }
        );
      }).not.toThrow();
      expect(screen.getByRole('heading', { name: /Set up your first project|What are you planning/i })).toBeInTheDocument();
    });
  });

  describe('Spoon mascot', () => {
    it('renders SpoonMascot without error', () => {
      const SpoonMascot = require('../components/ai/SpoonMascot').default;
      expect(() => {
        renderWithApp(<SpoonMascot size={48} animated />);
      }).not.toThrow();
    });
  });

  describe('Dashboard overview', () => {
    it('renders DashboardOverview without error', () => {
      const DashboardOverview = require('../components/dashboard/DashboardOverview').default;
      const state = getMockAppState();
      expect(() => {
        renderWithApp(<DashboardOverview onSwitchToDetailed={() => {}} />, { state });
      }).not.toThrow();
      expect(screen.getAllByText(/sections completed|Completed|Progress/i).length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('Config and utils', () => {
    it('featurePresets exports valid presets', () => {
      const { FEATURE_PRESETS, ALL_FEATURE_IDS, getEnabledFeatureIds, isFeatureEnabled } = require('../config/featurePresets');
      expect(Array.isArray(FEATURE_PRESETS)).toBe(true);
      expect(FEATURE_PRESETS.length).toBeGreaterThanOrEqual(2);
      expect(Array.isArray(ALL_FEATURE_IDS)).toBe(true);
      expect(getEnabledFeatureIds(null)).toBe(null);
      expect(getEnabledFeatureIds([])).toBe(null);
      expect(getEnabledFeatureIds(['financials'])).toEqual(['financials']);
      expect(isFeatureEnabled('financials', null)).toBe(true);
      expect(isFeatureEnabled('financials', ['financials'])).toBe(true);
      expect(isFeatureEnabled('other', ['financials'])).toBe(false);
    });

    it('sectionStatus getSectionStatus handles empty draft', () => {
      const { getSectionStatus } = require('../utils/sectionStatus');
      const result = getSectionStatus(null, []);
      expect(typeof result).toBe('object');
      expect(result).toEqual({});
    });
  });

  describe('Public pages', () => {
    it('renders TermsPage without error', () => {
      const TermsPage = require('../pages/TermsPage').default;
      expect(() => {
        renderWithApp(<TermsPage />);
      }).not.toThrow();
      expect(screen.getByRole('heading', { name: 'Terms of Service & Privacy Notice' })).toBeInTheDocument();
    });

    it('renders PrivacyPage without error', () => {
      const PrivacyPage = require('../pages/PrivacyPage').default;
      expect(() => {
        renderWithApp(<PrivacyPage />);
      }).not.toThrow();
      expect(screen.getByRole('heading', { name: 'Terms of Service & Privacy Notice' })).toBeInTheDocument();
    });

    it('renders FAQPage without error', () => {
      const FAQPage = require('../pages/FAQPage').default;
      expect(() => {
        renderWithApp(<FAQPage />);
      }).not.toThrow();
    });

    it('renders SitemapPage without error', () => {
      const SitemapPage = require('../pages/SitemapPage').default;
      expect(() => {
        renderWithApp(<SitemapPage />);
      }).not.toThrow();
      expect(screen.getByRole('heading', { name: /Site Map/i })).toBeInTheDocument();
    });
  });

  describe('Planning tabs', () => {
    it('renders OpeningPlan without error', () => {
      const OpeningPlan = require('../components/startup/OpeningPlan').default;
      const state = getMockAppState();
      expect(() => {
        renderWithApp(<OpeningPlan />, { state });
      }).not.toThrow();
      expect(screen.getByRole('heading', { name: /Boston Restaurant Opening Plan/i })).toBeInTheDocument();
    });

    it('renders MarketAnalysis without error', () => {
      const MarketAnalysis = require('../components/business-plan/MarketAnalysis').default;
      const state = getMockAppState();
      expect(() => {
        renderWithApp(<MarketAnalysis />, { state });
      }).not.toThrow();
      expect(screen.getByRole('heading', { name: /Market|Competition|Analysis/i })).toBeInTheDocument();
    });

    it('renders BrandingPlanner without error', () => {
      const BrandingPlanner = require('../components/branding/BrandingPlanner').default;
      const state = getMockAppState();
      expect(() => {
        renderWithApp(<BrandingPlanner />, { state });
      }).not.toThrow();
      expect(screen.getByRole('heading', { name: 'Branding & Visual Identity Planner' })).toBeInTheDocument();
    });
  });

  describe('Compliance and UI', () => {
    it('renders FormField without error', () => {
      const FormField = require('../components/ui/FormField').default;
      expect(() => {
        renderWithApp(<FormField label="Test field" value="" onChange={() => {}} />);
      }).not.toThrow();
      expect(screen.getByText('Test field')).toBeInTheDocument();
    });
  });
});
