import React, { useState, useEffect } from 'react';
import { useApp } from '../../contexts/AppContext';
import {
  X,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Compass,
  Lightbulb,
  BarChart3,
  Target,
  DollarSign,
  Users,
  Building,
  Calendar,
  Truck,
  Utensils,
  Palette,
  Shield,
  CheckCircle
} from 'lucide-react';
import { PROGRESS_SECTION_ORDER } from '../../utils/sectionStatus';
import { DETAIL_VIEW_TABS } from '../layout/TabNavigation';

const STEP_ICONS = {
  'startup-and-opening': Compass,
  'concept-pitch': Lightbulb,
  'market-competition': BarChart3,
  'offer-marketing': Target,
  'financials': DollarSign,
  'team-cap-table': Users,
  'operations': Building,
  'timeline': Calendar,
  'vendors': Truck,
  'equipment-menu': Utensils,
  'branding': Palette,
  'compliance': Shield
};

const STEP_BLURBS = {
  'startup-and-opening': 'Track your opening plan: lease → permits → buildout → opening. Check off tasks and use the Final 30 Days list as you get close.',
  'concept-pitch': 'Define your restaurant idea, elevator pitch, and executive summary. This is the foundation everything else builds on.',
  'market-competition': 'Research your market size, competition, and target customers. Know who you\'re serving and who you\'re up against.',
  'offer-marketing': 'Describe your menu, services, and how you\'ll reach customers. Marketing mix and acquisition strategy go here.',
  'financials': 'Build revenue projections, COGS, operating expenses, and startup costs. Use the monthly P&L to compare actuals once you\'re open.',
  'team-cap-table': 'Outline your management team and cap table. Staffing plan and labor costs link to Financials.',
  'operations': 'Plan facility, layout, square footage, seating, and operating schedule. Linked with Financial Projections.',
  'timeline': 'Set milestones and dates for your opening. Keeps the whole team aligned on what happens when.',
  'vendors': 'Add suppliers for food, beverage, and services. Link vendors to P&L line items for tracking.',
  'equipment-menu': 'List equipment needs and build your menu. Both feed into startup costs and operations.',
  'branding': 'Define your brand name, voice, and visual identity. Used across the plan and investor materials.',
  'compliance': 'Track permits, licenses, and inspections. Use the Open Restaurant view once you\'re running.'
};

const getTabLabel = (id) => {
  const tab = DETAIL_VIEW_TABS.find(t => t.id === id);
  return (tab && tab.label) || id.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
};

const GUIDE_STEPS = PROGRESS_SECTION_ORDER.filter(
  id => STEP_ICONS[id]
).map(id => ({
  id,
  label: getTabLabel(id),
  icon: STEP_ICONS[id],
  blurb: STEP_BLURBS[id]
}));

const GuideAssistant = ({ isOpen, onClose, sectionStatus = {} }) => {
  const { state, actions } = useApp();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1); // 1 = next, -1 = prev
  const [isExiting, setIsExiting] = useState(false);

  const currentStep = GUIDE_STEPS[currentIndex];
  const isCompleted = sectionStatus[currentStep?.id]?.completed;
  const progress = GUIDE_STEPS.length ? ((currentIndex + 1) / GUIDE_STEPS.length) * 100 : 0;

  // Sync to current tab when popup opens
  useEffect(() => {
    if (isOpen && state.activeTab) {
      const idx = GUIDE_STEPS.findIndex(s => s.id === state.activeTab);
      if (idx >= 0) setCurrentIndex(idx);
    }
  }, [isOpen, state.activeTab]);

  const goToStep = (tabId) => {
    actions.setActiveTab(tabId);
    onClose && onClose();
  };

  const handleNext = () => {
    if (currentIndex < GUIDE_STEPS.length - 1) {
      setDirection(1);
      setCurrentIndex(i => i + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setDirection(-1);
      setCurrentIndex(i => i - 1);
    }
  };

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      setIsExiting(false);
      onClose && onClose();
    }, 200);
  };

  if (!isOpen) return null;

  const Icon = currentStep?.icon || Sparkles;

  return (
    <div
      className="guide-assistant-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="guide-assistant-title"
    >
      <div
        className={`guide-assistant-backdrop ${isExiting ? 'guide-assistant-backdrop-exit' : ''}`}
        onClick={handleClose}
        aria-hidden="true"
      />
      <div className={`guide-assistant-card ${isExiting ? 'guide-assistant-card-exit' : ''}`}>
        <button
          type="button"
          onClick={handleClose}
          className="guide-assistant-close"
          aria-label="Close guide"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="guide-assistant-character" aria-hidden="true">
          <div className="guide-assistant-avatar">
            <Sparkles className="guide-assistant-avatar-icon" />
          </div>
        </div>

        <div className="guide-assistant-content">
          <div
            key={currentIndex}
            className={`guide-assistant-step ${direction === 1 ? 'guide-assistant-step-next' : 'guide-assistant-step-prev'}`}
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <h2 id="guide-assistant-title" className="text-lg font-bold text-gray-900">
                  {currentStep?.label}
                </h2>
                <p className="text-xs text-gray-500">
                  Step {currentIndex + 1} of {GUIDE_STEPS.length}
                  {isCompleted && (
                    <span className="ml-2 inline-flex items-center text-green-600">
                      <CheckCircle className="w-3.5 h-3.5 mr-0.5" /> Done
                    </span>
                  )}
                </p>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-4">{currentStep?.blurb}</p>
            <button
              type="button"
              onClick={() => goToStep(currentStep?.id)}
              className="guide-assistant-goto"
            >
              Take me there
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="guide-assistant-progress">
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div
              className="guide-assistant-progress-fill"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="guide-assistant-footer">
          <button
            type="button"
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className="guide-assistant-nav guide-assistant-nav-prev"
          >
            <ArrowLeft className="w-4 h-4" />
            Previous
          </button>
          <button
            type="button"
            onClick={handleNext}
            disabled={currentIndex === GUIDE_STEPS.length - 1}
            className="guide-assistant-nav guide-assistant-nav-next"
          >
            Next
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default GuideAssistant;
export { GUIDE_STEPS };
