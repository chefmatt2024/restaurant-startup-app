import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import AppContext from './contexts/AppContext';

/**
 * Minimal app state for testing components that use useApp().
 * Override only what the test needs.
 */
export function getMockAppState(overrides = {}) {
  const base = {
    isLoading: false,
    isAuthenticated: true,
    userId: 'test-user',
    user: { uid: 'test-user', email: 'test@example.com' },
    activeTab: 'financials',
    drafts: [
      {
        id: 'draft-1',
        name: 'Test Plan',
        projectIntent: 'opening_new',
        enabledFeatures: null,
        businessPlan: {},
        financialData: {},
        vendors: [],
        openingPlanProgress: { completedTaskIds: [] },
        documentVersions: [],
        sops: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
    currentDraftId: 'draft-1',
    businessPlan: {},
    financialData: {},
    vendors: [],
    openingPlanProgress: { completedTaskIds: [] },
    documentVersions: [],
    sops: [],
    saveStatus: 'idle',
    subscription: { status: 'active', plan: 'free' },
  };
  return { ...base, ...overrides };
}

/**
 * No-op actions for tests (components only need them to be functions).
 */
export function getMockActions() {
  return {
    setActiveTab: jest.fn(),
    setCurrentDraftId: jest.fn(),
    updateFinancialData: jest.fn(),
    updateBusinessPlan: jest.fn(),
    updateDraft: jest.fn(),
    createDraft: jest.fn(),
    setDrafts: jest.fn(),
    showMessage: jest.fn(),
    setLoading: jest.fn(),
  };
}

/**
 * Render a component that uses useApp() with mock state and actions.
 */
export function renderWithApp(ui, { state = getMockAppState(), actions = getMockActions(), route = '/' } = {}) {
  const value = { state, actions };
  return render(
    <MemoryRouter initialEntries={[route]}>
      <AppContext.Provider value={value}>{ui}</AppContext.Provider>
    </MemoryRouter>
  );
}

/**
 * Re-export render for tests that don't need app context.
 */
export { render };
