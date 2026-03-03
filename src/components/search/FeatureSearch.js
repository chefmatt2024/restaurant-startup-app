import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useApp } from '../../contexts/AppContext';
import { getEnabledFeatureIds } from '../../config/featurePresets';
import { DETAIL_VIEW_TABS } from '../layout/TabNavigation';
import { Search, X } from 'lucide-react';

/**
 * Simple fuzzy match: query matches if all words appear (in order) in label or description.
 */
const matchesSearch = (query, label, description) => {
  if (!query || !query.trim()) return true;
  const q = query.toLowerCase().trim();
  const text = `${(label || '').toLowerCase()} ${(description || '').toLowerCase()}`;
  const words = q.split(/\s+/).filter(Boolean);
  return words.every(w => text.includes(w));
};

const FeatureSearch = ({ isOpen, onClose, onSelect }) => {
  const { state } = useApp();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);
  const listRef = useRef(null);

  const currentDraft = state.drafts?.find(d => d.id === state.currentDraftId);
  const enabledIds = useMemo(
    () => getEnabledFeatureIds(currentDraft?.enabledFeatures),
    [currentDraft?.enabledFeatures]
  );

  const filteredTabs = useMemo(() => {
    const tabs = enabledIds === null
      ? DETAIL_VIEW_TABS
      : DETAIL_VIEW_TABS.filter(t => enabledIds.includes(t.id));
    if (!query.trim()) return tabs;
    return tabs.filter(t =>
      matchesSearch(query, t.label, t.description)
    );
  }, [enabledIds, query]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  useEffect(() => {
    if (!isOpen) return;
    setQuery('');
    setSelectedIndex(0);
    inputRef.current?.focus();
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
        e.preventDefault();
      } else if (e.key === 'ArrowDown') {
        setSelectedIndex(i => Math.min(i + 1, filteredTabs.length - 1));
        e.preventDefault();
      } else if (e.key === 'ArrowUp') {
        setSelectedIndex(i => Math.max(i - 1, 0));
        e.preventDefault();
      } else if (e.key === 'Enter' && filteredTabs[selectedIndex]) {
        onSelect(filteredTabs[selectedIndex].id);
        onClose();
        e.preventDefault();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, onSelect, filteredTabs, selectedIndex]);

  useEffect(() => {
    const el = listRef.current?.children[selectedIndex];
    el?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }, [selectedIndex]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] px-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} aria-hidden />
      <div className="relative w-full max-w-xl bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden">
        <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-100">
          <Search className="w-5 h-5 text-slate-400" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search features..."
            className="flex-1 py-2 text-slate-900 placeholder-slate-400 focus:outline-none"
            autoComplete="off"
          />
          <kbd className="hidden sm:inline-flex px-2 py-1 text-xs font-medium text-slate-500 bg-slate-100 rounded">Esc</kbd>
        </div>
        <div ref={listRef} className="max-h-64 overflow-y-auto py-2">
          {filteredTabs.length === 0 ? (
            <div className="px-4 py-8 text-center text-slate-500 text-sm">No features match "{query}"</div>
          ) : (
            filteredTabs.map((tab, i) => {
              const Icon = tab.icon;
              const isSelected = i === selectedIndex;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => {
                    onSelect(tab.id);
                    onClose();
                  }}
                  onMouseEnter={() => setSelectedIndex(i)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                    isSelected ? 'bg-slate-100' : 'hover:bg-slate-50'
                  }`}
                >
                  {Icon && <Icon className="w-5 h-5 text-slate-500 flex-shrink-0" />}
                  <div className="min-w-0 flex-1">
                    <div className="font-medium text-slate-900">{tab.label}</div>
                    {tab.description && (
                      <div className="text-xs text-slate-500 truncate">{tab.description}</div>
                    )}
                  </div>
                </button>
              );
            })
          )}
        </div>
        <div className="px-4 py-2 border-t border-slate-100 bg-slate-50/50 text-xs text-slate-500 flex items-center justify-between">
          <span><kbd className="px-1.5 py-0.5 bg-white rounded border border-slate-200">↑</kbd><kbd className="px-1.5 py-0.5 bg-white rounded border border-slate-200 ml-1">↓</kbd> to navigate · <kbd className="px-1.5 py-0.5 bg-white rounded border border-slate-200 ml-1">Enter</kbd> to select</span>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default FeatureSearch;
