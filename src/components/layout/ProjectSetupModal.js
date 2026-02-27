import React, { useState } from 'react';
import { useApp, PROJECT_INTENTS } from '../../contexts/AppContext';
import { Store, Building, Building2, X, ArrowRight, Layers, Check } from 'lucide-react';
import { FEATURE_PRESETS, ALL_FEATURE_IDS } from '../../config/featurePresets';
import { DETAIL_VIEW_TABS } from './TabNavigation';

const INTENT_OPTIONS = [
  {
    value: PROJECT_INTENTS.OPENING_NEW,
    label: 'Opening a new restaurant',
    description: 'Planning from scratch: concept, location, permits, and launch.',
    icon: Store,
  },
  {
    value: PROJECT_INTENTS.BUYING_EXISTING,
    label: 'Potentially buying an existing restaurant',
    description: 'Due diligence, valuation, and transition planning.',
    icon: Building,
  },
  {
    value: PROJECT_INTENTS.HELPING_EXISTING,
    label: 'Helping an existing restaurant',
    description: 'Improving operations, marketing, or planning for a current business.',
    icon: Building2,
  },
];

const tabsById = Object.fromEntries(DETAIL_VIEW_TABS.map((t) => [t.id, t]));

const ProjectSetupModal = ({
  isOpen,
  onClose,
  onSubmit,
  isFirstProject = false,
  allowClose = true,
}) => {
  const { actions } = useApp();
  const [projectIntent, setProjectIntent] = useState(null);
  const [projectName, setProjectName] = useState('');
  const [featurePreset, setFeaturePreset] = useState('full');
  const [showCustomFeatures, setShowCustomFeatures] = useState(false);
  const [customFeatureIds, setCustomFeatureIds] = useState(() => FEATURE_PRESETS[0].featureIds.slice());

  if (!isOpen) return null;

  const resolveEnabledFeatures = () => {
    if (featurePreset === 'full') return null;
    if (featurePreset === 'custom') {
      return customFeatureIds.length > 0 ? customFeatureIds : null;
    }
    const preset = FEATURE_PRESETS.find((p) => p.id === featurePreset);
    return preset ? preset.featureIds : null;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const intent = projectIntent || PROJECT_INTENTS.OPENING_NEW;
    const name = (projectName || '').trim() || (isFirstProject ? 'My First Restaurant Plan' : 'My Restaurant Plan');
    const enabledFeatures = resolveEnabledFeatures();
    if (onSubmit) {
      onSubmit({ projectIntent: intent, projectName: name, enabledFeatures });
    } else {
      actions.createDraft(name, null, intent, enabledFeatures);
      if (onClose) onClose();
    }
    setProjectIntent(null);
    setProjectName('');
    setFeaturePreset('full');
    setShowCustomFeatures(false);
  };

  const handleClose = () => {
    setProjectIntent(null);
    setProjectName('');
    setFeaturePreset('full');
    setShowCustomFeatures(false);
    if (onClose) onClose();
  };

  const toggleCustomFeature = (id) => {
    setCustomFeatureIds((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 sm:p-8">
          <div className="flex items-start justify-between gap-4 mb-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                {isFirstProject ? 'Set up your first project' : 'New project'}
              </h2>
              <p className="text-gray-600 mt-1">
                {isFirstProject
                  ? 'Tell us what you’re working on so we can tailor your plan.'
                  : 'Choose the focus for this project.'}
              </p>
            </div>
            {allowClose && (
              <button
                type="button"
                onClick={handleClose}
                className="text-gray-400 hover:text-gray-600 p-1 rounded"
                aria-label="Close"
              >
                <X className="w-6 h-6" />
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                What are you planning?
              </label>
              <div className="space-y-2">
                {INTENT_OPTIONS.map((opt) => {
                  const Icon = opt.icon;
                  const selected = projectIntent === opt.value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setProjectIntent(opt.value)}
                      className={`w-full text-left p-4 rounded-lg border-2 transition-all flex items-start gap-3 ${
                        selected
                          ? 'border-indigo-500 bg-indigo-50 text-indigo-900'
                          : 'border-gray-200 hover:border-gray-300 bg-white text-gray-700'
                      }`}
                    >
                      <div className={`p-2 rounded-lg ${selected ? 'bg-indigo-100' : 'bg-gray-100'}`}>
                        <Icon className={`w-5 h-5 ${selected ? 'text-indigo-600' : 'text-gray-500'}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="font-medium block">{opt.label}</span>
                        <span className={`text-sm block mt-0.5 ${selected ? 'text-indigo-700' : 'text-gray-500'}`}>
                          {opt.description}
                        </span>
                      </div>
                      {selected && <ArrowRight className="w-5 h-5 text-indigo-600 flex-shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label htmlFor="project-name" className="block text-sm font-medium text-gray-700 mb-1">
                Project name <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <input
                id="project-name"
                type="text"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder={isFirstProject ? 'e.g. My First Restaurant Plan' : 'e.g. Downtown location'}
                className="form-input w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Which areas do you want to use?
              </label>
              <p className="text-xs text-gray-500 mb-3">
                Smaller projects can start with just a few — you can add more later in project settings.
              </p>
              <div className="space-y-2">
                {FEATURE_PRESETS.map((preset) => {
                  const selected = featurePreset === preset.id && !showCustomFeatures;
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => {
                        setFeaturePreset(preset.id);
                        setShowCustomFeatures(false);
                      }}
                      className={`w-full text-left p-3 rounded-lg border-2 transition-all flex items-start gap-3 ${
                        selected
                          ? 'border-indigo-500 bg-indigo-50 text-indigo-900'
                          : 'border-gray-200 hover:border-gray-300 bg-white text-gray-700'
                      }`}
                    >
                      {selected && <Check className="w-5 h-5 text-indigo-600 flex-shrink-0" />}
                      <div className="flex-1 min-w-0">
                        <span className="font-medium block">{preset.label}</span>
                        <span className={`text-sm block mt-0.5 ${selected ? 'text-indigo-700' : 'text-gray-500'}`}>
                          {preset.description}
                        </span>
                      </div>
                    </button>
                  );
                })}
                <button
                  type="button"
                  onClick={() => {
                    setFeaturePreset('custom');
                    setShowCustomFeatures(true);
                    if (customFeatureIds.length === 0) {
                      setCustomFeatureIds(FEATURE_PRESETS[0].featureIds.slice());
                    }
                  }}
                  className={`w-full text-left p-3 rounded-lg border-2 transition-all flex items-center gap-3 ${
                    showCustomFeatures
                      ? 'border-indigo-500 bg-indigo-50 text-indigo-900'
                      : 'border-gray-200 hover:border-gray-300 bg-white text-gray-700'
                  }`}
                >
                  {showCustomFeatures && <Check className="w-5 h-5 text-indigo-600 flex-shrink-0" />}
                  <Layers className="w-5 h-5 text-gray-500 flex-shrink-0" />
                  <span className="font-medium">Choose specific areas</span>
                </button>
              </div>
              {showCustomFeatures && (
                <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-200 max-h-48 overflow-y-auto">
                  <p className="text-xs text-gray-600 mb-2">Select the sections you want in this project:</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {ALL_FEATURE_IDS.map((id) => {
                      const tab = tabsById[id];
                      const label = tab?.label || id;
                      const checked = customFeatureIds.includes(id);
                      return (
                        <label
                          key={id}
                          className="flex items-center gap-2 cursor-pointer text-sm text-gray-700 hover:bg-gray-100 rounded px-2 py-1"
                        >
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => toggleCustomFeature(id)}
                            className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                          />
                          <span className="truncate">{label}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="submit"
                className="btn-primary flex items-center gap-2"
              >
                {isFirstProject ? 'Create my plan' : 'Create project'}
                <ArrowRight className="w-4 h-4" />
              </button>
              {allowClose && (
                <button type="button" onClick={handleClose} className="btn-secondary">
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProjectSetupModal;
export { INTENT_OPTIONS, PROJECT_INTENTS };
