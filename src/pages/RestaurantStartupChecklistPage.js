import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Lightbulb,
  DollarSign,
  MapPin,
  Shield,
  Wrench,
  Rocket,
  CheckCircle,
  Circle,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  Download,
} from 'lucide-react';
import { STARTUP_CHECKLIST_PHASES } from '../config/restaurantStartupChecklist';
import Footer from '../components/layout/Footer';
import analyticsService, { FUNNELS, FUNNEL_STAGES } from '../services/analytics';
import { savePendingStartupChecklist } from '../utils/freeStartupChecklistStorage';

const ICONS = { Lightbulb, DollarSign, MapPin, Shield, Wrench, Rocket };

const PHASE_COLORS = {
  blue: 'bg-blue-50 border-blue-200 text-blue-700',
  green: 'bg-green-50 border-green-200 text-green-700',
  purple: 'bg-purple-50 border-purple-200 text-purple-700',
  red: 'bg-red-50 border-red-200 text-red-700',
  orange: 'bg-orange-50 border-orange-200 text-orange-700',
  indigo: 'bg-indigo-50 border-indigo-200 text-indigo-700',
};

const getDefaultCompleted = () => {
  const out = {};
  STARTUP_CHECKLIST_PHASES.forEach((phase) => {
    phase.items.forEach((item) => {
      out[item.id] = false;
    });
  });
  return out;
};

const getTotalItems = () =>
  STARTUP_CHECKLIST_PHASES.reduce((acc, p) => acc + p.items.length, 0);

export default function RestaurantStartupChecklistPage() {
  const [completed, setCompleted] = useState(getDefaultCompleted);
  const [expandedPhase, setExpandedPhase] = useState(STARTUP_CHECKLIST_PHASES[0]?.id || null);
  const [projectName, setProjectName] = useState('');

  const completedCount = useMemo(
    () => Object.values(completed).filter(Boolean).length,
    [completed]
  );
  const totalItems = getTotalItems();
  const progressPct = totalItems > 0 ? Math.round((completedCount / totalItems) * 100) : 0;

  useEffect(() => {
    analyticsService.track('restaurant_startup_checklist_viewed', {});
    analyticsService.trackFunnelStage(FUNNEL_STAGES.ASSESSMENT_STARTED, {
      funnel: FUNNELS.WEBSITE_TO_APP,
      entryPoint: 'startup_checklist_page',
    });
  }, []);

  const toggleItem = (itemId) => {
    setCompleted((prev) => ({ ...prev, [itemId]: !prev[itemId] }));
  };

  const handleSignupToSave = () => {
    const completedIds = Object.entries(completed)
      .filter(([, v]) => v)
      .map(([k]) => k);
    const payload = {
      id: `checklist_${Date.now()}`,
      source: 'free_startup_checklist',
      createdAt: new Date().toISOString(),
      projectName: projectName?.trim() || '',
      completedIds,
      completedCount,
      totalItems,
      progressPct,
      completed, // full state for restore
    };
    savePendingStartupChecklist(payload);
    analyticsService.track('restaurant_startup_checklist_signup_clicked', {
      completedCount,
      totalItems,
      progressPct,
    });
    analyticsService.trackFunnelStage(FUNNEL_STAGES.SIGNUP_CTA_CLICKED_FROM_ASSESSMENT, {
      funnel: FUNNELS.WEBSITE_TO_APP,
      score: progressPct,
      source: 'startup_checklist',
    });
  };

  const handleDownload = () => {
    const phaseProgress = STARTUP_CHECKLIST_PHASES.map((p) => ({
      phase: p.title,
      duration: p.duration,
      items: p.items.map((item) => ({
        label: item.label,
        done: completed[item.id] ?? false,
      })),
    }));
    const data = {
      projectName: projectName?.trim() || 'My Restaurant',
      completedCount,
      totalItems,
      progressPct,
      lastUpdated: new Date().toISOString(),
      phases: phaseProgress,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `restaurant-startup-checklist-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    analyticsService.track('restaurant_startup_checklist_downloaded', { completedCount, totalItems });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-3xl mx-auto px-4 py-6">
          <Link to="/landing" className="text-sm text-indigo-600 hover:text-indigo-800 font-medium">
            ← Back to Restauranteur
          </Link>
          <h1 className="mt-2 text-2xl sm:text-3xl font-bold text-gray-900">
            Restaurant Startup Checklist
          </h1>
          <p className="mt-1 text-gray-600">
            Track your progress from idea to open. Based on the Restauranteur App&apos;s full journey—concept, funding, permits, buildout, and launch.
          </p>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8">
        {/* Project name (optional) */}
        <div className="mb-6 p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Project name (optional)</label>
          <input
            type="text"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            placeholder="e.g. Downtown Bistro"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
          />
        </div>

        {/* Progress bar */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>{completedCount} of {totalItems} completed</span>
            <span>{progressPct}%</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-indigo-500 transition-all duration-300"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>

        {/* Phases */}
        <div className="space-y-3">
          {STARTUP_CHECKLIST_PHASES.map((phase) => {
            const Icon = ICONS[phase.icon] || Lightbulb;
            const isExpanded = expandedPhase === phase.id;
            const phaseCompleted = phase.items.filter((i) => completed[i.id]).length;
            const phaseTotal = phase.items.length;
            const phasePct = phaseTotal > 0 ? Math.round((phaseCompleted / phaseTotal) * 100) : 0;
            const colorClass = PHASE_COLORS[phase.color] || PHASE_COLORS.blue;

            return (
              <div
                key={phase.id}
                className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => setExpandedPhase(isExpanded ? null : phase.id)}
                  className="w-full px-4 py-4 flex items-center justify-between text-left hover:bg-gray-50"
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${colorClass} border`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="font-semibold text-gray-900">{phase.title}</h2>
                      <p className="text-sm text-gray-500">
                        {phase.description} · {phase.duration}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">
                      {phaseCompleted}/{phaseTotal}
                    </span>
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                </button>
                {isExpanded && (
                  <div className="px-4 pb-4 border-t border-gray-100 pt-4 space-y-2">
                    {phase.items.map((item) => {
                      const isDone = completed[item.id];
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => toggleItem(item.id)}
                          className={`w-full flex items-center gap-3 py-2 px-3 rounded-lg text-left transition-colors ${
                            isDone ? 'bg-green-50 text-green-800' : 'hover:bg-gray-50'
                          }`}
                        >
                          {isDone ? (
                            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                          ) : (
                            <Circle className="w-5 h-5 text-gray-300 flex-shrink-0" />
                          )}
                          <span className={`text-sm flex-1 ${isDone ? 'line-through text-gray-600' : 'text-gray-800'}`}>
                            {item.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* CTAs */}
        <div className="mt-8 p-6 bg-white rounded-2xl border-2 border-indigo-200 shadow-lg">
          <h2 className="text-lg font-bold text-gray-900 mb-2">Save your progress</h2>
          <p className="text-sm text-gray-600 mb-4">
            Sign up for a free Restauranteur account to save this checklist, sync with your full opening plan, and unlock financial projections, permit tracking, and more.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/"
              onClick={handleSignupToSave}
              className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm font-medium"
            >
              Sign up free to save &amp; continue
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="https://iterumfoods.com?utm_source=checklist&utm_medium=results&utm_campaign=consulting"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 border border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-50 text-sm font-medium"
            >
              Book a strategy call with an expert
            </a>
            <button
              type="button"
              onClick={handleDownload}
              className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 text-sm font-medium"
            >
              <Download className="w-4 h-4" />
              Download checklist (JSON)
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
