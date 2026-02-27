import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Eye,
  Users,
  Utensils,
  ShieldCheck,
  LayoutGrid,
  Sparkles,
  AlertTriangle,
  CheckCircle,
  XCircle,
  MinusCircle,
  FileText,
  ChevronDown,
  ChevronUp,
  Mail,
  Download,
  ArrowRight,
} from 'lucide-react';
import { ASSESSMENT_SECTIONS, SCORE_LABELS } from '../config/restaurantAssessmentChecklist';
import Footer from '../components/layout/Footer';
import analyticsService, { FUNNELS, FUNNEL_STAGES } from '../services/analytics';
import { savePendingAssessment } from '../utils/freeAssessmentStorage';

const ICONS = {
  Eye,
  Users,
  Utensils,
  ShieldCheck,
  LayoutGrid,
  Sparkles,
  AlertTriangle,
};

const VALUE_NA = 'na';
const VALUE_PASS = 'pass';
const VALUE_FAIL = 'fail';

const getDefaultAnswers = () => {
  const out = {};
  ASSESSMENT_SECTIONS.forEach((sec) => {
    sec.items.forEach((item) => {
      out[item.id] = null;
    });
  });
  return out;
};

const getScore = (answers) => {
  const normalSections = ASSESSMENT_SECTIONS.filter((s) => !s.redFlag);
  let applicable = 0;
  let passed = 0;
  normalSections.forEach((sec) => {
    sec.items.forEach((item) => {
      const v = answers[item.id];
      if (v === VALUE_NA) return;
      applicable += 1;
      if (v === VALUE_PASS) passed += 1;
    });
  });
  const redFlags = ASSESSMENT_SECTIONS.find((s) => s.redFlag);
  let redFlagCount = 0;
  if (redFlags) {
    redFlags.items.forEach((item) => {
      if (answers[item.id] === VALUE_FAIL) redFlagCount += 1;
    });
  }
  const score = applicable > 0 ? Math.round((passed / applicable) * 100) : null;
  return { score, passed, applicable, redFlagCount };
};

const getScoreTier = (score) => {
  if (score === null) return null;
  if (score >= SCORE_LABELS.high.min) return 'high';
  if (score >= SCORE_LABELS.medium.min) return 'medium';
  return 'low';
};

export default function RestaurantAssessmentPage() {
  const [answers, setAnswers] = useState(getDefaultAnswers);
  const [expandedSection, setExpandedSection] = useState(ASSESSMENT_SECTIONS[0]?.id || null);
  const [showResults, setShowResults] = useState(false);
  const [restaurantName, setRestaurantName] = useState('');
  const [visitDate, setVisitDate] = useState(new Date().toISOString().split('T')[0]);
  const [emailForReport, setEmailForReport] = useState('');

  const { score, passed, applicable, redFlagCount } = useMemo(() => getScore(answers), [answers]);
  const tier = getScoreTier(score);
  const tierConfig = tier ? SCORE_LABELS[tier] : null;

  useEffect(() => {
    analyticsService.trackFunnelStage(FUNNEL_STAGES.ASSESSMENT_STARTED, {
      funnel: FUNNELS.WEBSITE_TO_APP,
      entryPoint: 'free_assessment_page',
    });
  }, []);

  const updateAnswer = (itemId, value) => {
    setAnswers((prev) => ({ ...prev, [itemId]: value }));
  };

  const handleSeeResults = () => {
    setShowResults(true);
    analyticsService.track('restaurant_assessment_completed', {
      score,
      redFlagCount,
      applicable,
      restaurantName: restaurantName || undefined,
    });
    analyticsService.trackFunnelStage(FUNNEL_STAGES.ASSESSMENT_COMPLETED, {
      funnel: FUNNELS.WEBSITE_TO_APP,
      score,
      redFlagCount,
    });
  };

  const handleSignupToSaveAssessment = () => {
    const payload = {
      id: `assessment_${Date.now()}`,
      source: 'free_assessment',
      createdAt: new Date().toISOString(),
      restaurantName: restaurantName?.trim() || '',
      visitDate,
      answers,
      summary: {
        score,
        passed,
        applicable,
        redFlagCount,
        tier: getScoreTier(score),
      },
    };
    savePendingAssessment(payload);
    analyticsService.track('restaurant_assessment_signup_clicked', {
      score,
      redFlagCount,
      applicable,
    });
    analyticsService.trackFunnelStage(FUNNEL_STAGES.SIGNUP_CTA_CLICKED_FROM_ASSESSMENT, {
      funnel: FUNNELS.WEBSITE_TO_APP,
      score,
      redFlagCount,
    });
  };

  const colorClasses = {
    pass: 'bg-green-100 text-green-800 border-green-300',
    fail: 'bg-red-100 text-red-800 border-red-300',
    na: 'bg-gray-100 text-gray-600 border-gray-300',
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-3xl mx-auto px-4 py-6">
          <Link to="/landing" className="text-sm text-indigo-600 hover:text-indigo-800 font-medium">
            ← Back to Restauranteur
          </Link>
          <h1 className="mt-2 text-2xl sm:text-3xl font-bold text-gray-900">
            Free Restaurant Assessment
          </h1>
          <p className="mt-1 text-gray-600">
            A secret-shopper style checklist to evaluate a restaurant in one visit—before deeper due diligence.
          </p>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8">
        {/* Optional: name & date */}
        <div className="mb-8 p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
          <h2 className="text-sm font-semibold text-gray-700 mb-3">Visit details (optional)</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Restaurant name</label>
              <input
                type="text"
                value={restaurantName}
                onChange={(e) => setRestaurantName(e.target.value)}
                placeholder="e.g. The Beacon"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Date of visit</label>
              <input
                type="date"
                value={visitDate}
                onChange={(e) => setVisitDate(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              />
            </div>
          </div>
        </div>

        {/* Checklist by section */}
        <div className="space-y-3">
          {ASSESSMENT_SECTIONS.map((section) => {
            const Icon = ICONS[section.icon] || FileText;
            const isExpanded = expandedSection === section.id;
            return (
              <div
                key={section.id}
                className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => setExpandedSection(isExpanded ? null : section.id)}
                  className="w-full px-4 py-4 flex items-center justify-between text-left hover:bg-gray-50"
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${section.redFlag ? 'bg-red-50 text-red-600' : 'bg-indigo-50 text-indigo-600'}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="font-semibold text-gray-900">{section.title}</h2>
                      <p className="text-sm text-gray-500">{section.description}</p>
                    </div>
                  </div>
                  {isExpanded ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                </button>
                {isExpanded && (
                  <div className="px-4 pb-4 border-t border-gray-100 pt-4 space-y-3">
                    {section.items.map((item) => (
                      <div key={item.id} className="flex items-center justify-between gap-4 py-2 border-b border-gray-50 last:border-0">
                        <span className="text-sm text-gray-700 flex-1">{item.label}</span>
                        <div className="flex gap-2 flex-shrink-0">
                          {[VALUE_PASS, VALUE_FAIL, VALUE_NA].map((val) => {
                            const isActive = answers[item.id] === val;
                            const label = val === VALUE_PASS ? 'Pass' : val === VALUE_FAIL ? 'Fail' : 'N/A';
                            const Icon = val === VALUE_PASS ? CheckCircle : val === VALUE_FAIL ? XCircle : MinusCircle;
                            return (
                              <button
                                key={val}
                                type="button"
                                onClick={() => updateAnswer(item.id, val)}
                                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-sm font-medium transition-colors ${isActive ? colorClasses[val] : 'border-gray-200 text-gray-500 hover:bg-gray-50'}`}
                              >
                                <Icon className="w-4 h-4" />
                                {label}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* See results */}
        <div className="mt-8 text-center">
          <button
            type="button"
            onClick={handleSeeResults}
            className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 shadow-md"
          >
            See my assessment score
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>

        {/* Results panel */}
        {showResults && (
          <div className="mt-10 p-6 bg-white rounded-2xl border-2 border-indigo-200 shadow-lg">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Your assessment result</h2>
            {applicable > 0 ? (
              <>
                <div className="flex items-center gap-4 mb-4">
                  <div className={`text-4xl font-bold ${tier === 'high' ? 'text-green-600' : tier === 'medium' ? 'text-amber-600' : 'text-red-600'}`}>
                    {score}%
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{tierConfig?.label}</p>
                    <p className="text-sm text-gray-600">
                      {passed} of {applicable} items passed
                      {redFlagCount > 0 && (
                        <span className="ml-2 text-red-600 font-medium">
                          • {redFlagCount} red flag{redFlagCount !== 1 ? 's' : ''}
                        </span>
                      )}
                    </p>
                  </div>
                </div>
                {redFlagCount > 0 && (
                  <p className="text-sm text-amber-800 bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4">
                    Red flags suggest deeper due diligence before committing—inspect permits, financials, and operations.
                  </p>
                )}
              </>
            ) : (
              <p className="text-gray-600">Answer at least one item (Pass or Fail) to see a score.</p>
            )}

            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-sm font-medium text-gray-900 mb-1">
                Save your results and go deeper
              </p>
              <p className="text-sm text-gray-600 mb-3">
                Sign up for a free account to save this assessment and unlock the full due diligence planner—business plan, financials, permits, and more.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  to="/"
                  onClick={handleSignupToSaveAssessment}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm font-medium"
                >
                  Sign up free to save &amp; continue
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    const data = { restaurantName, visitDate, score, passed, applicable, redFlagCount, answers };
                    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `restaurant-assessment-${visitDate}-${(restaurantName || 'visit').replace(/\s+/g, '-')}.json`;
                    a.click();
                    URL.revokeObjectURL(url);
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 text-sm font-medium"
                >
                  <Download className="w-4 h-4" />
                  Download results (JSON)
                </a>
              </div>
            </div>

            <div className="mt-6 p-4 bg-gray-50 rounded-xl">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Mail className="w-4 h-4 inline mr-2" />
                Email me a copy of this assessment (optional)
              </label>
              <div className="flex gap-2">
                <input
                  type="email"
                  value={emailForReport}
                  onChange={(e) => setEmailForReport(e.target.value)}
                  placeholder="you@example.com"
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm"
                />
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-700 text-white rounded-lg text-sm font-medium hover:bg-gray-800"
                  onClick={() => {
                    if (emailForReport.trim()) {
                      analyticsService.track('restaurant_assessment_email_requested', { email: emailForReport.trim() });
                      alert('Thanks! Email delivery is not set up yet—download the JSON for now. We’ll notify you when report-by-email is available.');
                    }
                  }}
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
