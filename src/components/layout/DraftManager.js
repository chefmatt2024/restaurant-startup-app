import React, { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import { getTemplateOptions, applyTemplate } from '../../utils/restaurantTemplates';
import { 
  Plus, 
  Copy, 
  Trash2, 
  Edit3, 
  Clock, 
  FileText, 
  CheckCircle,
  GitCompare,
  ChevronDown,
  X,
  FolderOpen,
  Folder,
  Tag,
  Layers
} from 'lucide-react';

const DraftManager = ({ isOpen, onClose }) => {
  const { state, actions } = useApp();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showConceptForm, setShowConceptForm] = useState(false);
  const [editingDraft, setEditingDraft] = useState(null);
  const [editingConcept, setEditingConcept] = useState(null);
  const [newDraftName, setNewDraftName] = useState('');
  const [newConceptName, setNewConceptName] = useState('');
  const [newConceptDescription, setNewConceptDescription] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [selectedForComparison, setSelectedForComparison] = useState([]);
  const [expandedConcepts, setExpandedConcepts] = useState(new Set());
  const [activeTab, setActiveTab] = useState('concepts'); // 'concepts' or 'all-drafts'

  const currentDraft = state.drafts.find(draft => draft.id === state.currentDraftId);

  // Group drafts by concept
  const draftsByConcept = state.drafts.reduce((acc, draft) => {
    const concept = draft.concept || 'Uncategorized';
    if (!acc[concept]) {
      acc[concept] = [];
    }
    acc[concept].push(draft);
    return acc;
  }, {});

  const concepts = Object.keys(draftsByConcept).sort();

  const handleCreateConcept = (e) => {
    e.preventDefault();
    if (!newConceptName.trim()) return;

    const conceptId = `concept_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Create a new draft for this concept
    const newDraft = {
      ...actions.createDraft(newConceptName.trim()),
      concept: newConceptName.trim(),
      conceptId: conceptId,
      conceptDescription: newConceptDescription.trim()
    };

    actions.updateDraft(newDraft.id, { 
      concept: newConceptName.trim(),
      conceptId: conceptId,
      conceptDescription: newConceptDescription.trim()
    });

    setNewConceptName('');
    setNewConceptDescription('');
    setShowConceptForm(false);
    setExpandedConcepts(prev => new Set([...prev, newConceptName.trim()]));
    actions.showMessage('Success', `New concept "${newConceptName}" created with initial draft!`, 'success');
  };

  const handleCreateDraft = (e) => {
    e.preventDefault();
    if (!newDraftName.trim()) return;

    let newDraft = actions.createDraft(newDraftName.trim());
    
    // Apply template if selected
    if (selectedTemplate) {
      newDraft = applyTemplate(selectedTemplate, newDraft);
      actions.updateDraft(newDraft.id, {
        businessPlan: newDraft.businessPlan,
        financialData: newDraft.financialData
      });
    }
    
    // If we're in a concept view, assign the concept
    if (activeTab === 'concepts' && concepts.length > 0) {
      const selectedConcept = concepts[0]; // Default to first concept, could be enhanced with concept selection
      actions.updateDraft(newDraft.id, { 
        concept: selectedConcept,
        conceptId: `concept_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      });
    }

    setNewDraftName('');
    setSelectedTemplate('');
    setShowCreateForm(false);
    const templateMsg = selectedTemplate ? ` with ${getTemplateOptions().find(t => t.value === selectedTemplate)?.label} template` : '';
    actions.showMessage('Success', `New draft "${newDraftName}" created${templateMsg}!`, 'success');
  };

  const handleCreateDraftInConcept = (conceptName) => {
    setNewDraftName('');
    setShowCreateForm(true);
    // This will be handled in handleCreateDraft with the concept context
  };

  const handleDuplicateDraft = (draftId) => {
    const originalDraft = state.drafts.find(d => d.id === draftId);
    if (!originalDraft) return;

    const duplicateName = `${originalDraft.name} (Variation)`;
    const newDraft = actions.duplicateDraft(draftId, duplicateName);
    
    // Maintain the same concept
    if (originalDraft.concept) {
      actions.updateDraft(newDraft.id, { 
        concept: originalDraft.concept,
        conceptId: originalDraft.conceptId
      });
    }
    
    actions.showMessage('Success', `Draft duplicated as "${duplicateName}"`, 'success');
  };

  const handleDeleteDraft = (draftId) => {
    const draftToDelete = state.drafts.find(d => d.id === draftId);
    if (!draftToDelete) return;

    if (state.drafts.length === 1) {
      actions.showMessage('Warning', 'Cannot delete the last remaining draft', 'error');
      return;
    }

    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${draftToDelete.name}"? This action cannot be undone.`
    );

    if (confirmDelete) {
      actions.deleteDraft(draftId);
      actions.showMessage('Success', `Draft "${draftToDelete.name}" deleted`, 'success');
    }
  };

  const handleRenameDraft = (draftId, newName) => {
    if (!newName.trim()) return;
    
    actions.updateDraft(draftId, { name: newName.trim() });
    setEditingDraft(null);
    actions.showMessage('Success', 'Draft renamed successfully', 'success');
  };

  const handleRenameConcept = (oldConceptName, newConceptName) => {
    if (!newConceptName.trim() || oldConceptName === newConceptName.trim()) return;
    
    // Update all drafts in this concept
    state.drafts.forEach(draft => {
      if (draft.concept === oldConceptName) {
        actions.updateDraft(draft.id, { concept: newConceptName.trim() });
      }
    });
    
    setEditingConcept(null);
    actions.showMessage('Success', 'Concept renamed successfully', 'success');
  };

  const handleSwitchDraft = (draftId) => {
    if (draftId === state.currentDraftId) return;
    
    actions.setCurrentDraftId(draftId);
    const draft = state.drafts.find(d => d.id === draftId);
    actions.showMessage('Info', `Switched to "${draft?.name}"`, 'info');
  };

  const toggleComparisonSelection = (draftId) => {
    setSelectedForComparison(prev => {
      if (prev.includes(draftId)) {
        return prev.filter(id => id !== draftId);
      } else if (prev.length < 2) {
        return [...prev, draftId];
      } else {
        // Replace the first selected if already 2 selected
        return [prev[1], draftId];
      }
    });
  };

  const handleStartComparison = () => {
    if (selectedForComparison.length === 2) {
      actions.setDraftComparison({
        isVisible: true,
        draftIds: selectedForComparison
      });
      setSelectedForComparison([]);
      onClose();
    }
  };

  const toggleConceptExpansion = (conceptName) => {
    setExpandedConcepts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(conceptName)) {
        newSet.delete(conceptName);
      } else {
        newSet.add(conceptName);
      }
      return newSet;
    });
  };

  const formatDate = (date) => {
    if (!date) return 'Unknown';
    const d = date instanceof Date ? date : new Date(date);
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-5xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Draft Manager</h2>
            <p className="text-gray-600 mt-1">
              Organize your business plan drafts by concepts and create multiple variations
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('concepts')}
            className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
              activeTab === 'concepts'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <FolderOpen className="w-4 h-4 inline mr-2" />
            Concepts
          </button>
          <button
            onClick={() => setActiveTab('all-drafts')}
            className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
              activeTab === 'all-drafts'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Layers className="w-4 h-4 inline mr-2" />
            All Drafts
          </button>
        </div>

        {/* Actions Bar */}
        <div className="p-4 bg-gray-50 border-b border-gray-200">
          <div className="flex flex-wrap items-center gap-3">
            {activeTab === 'concepts' ? (
              <button
                onClick={() => setShowConceptForm(true)}
                className="btn-primary flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>New Concept</span>
              </button>
            ) : (
              <button
                onClick={() => setShowCreateForm(true)}
                className="btn-primary flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>New Draft</span>
              </button>
            )}

            {selectedForComparison.length === 2 && (
              <button
                onClick={handleStartComparison}
                className="btn-secondary flex items-center space-x-2"
              >
                <GitCompare className="w-4 h-4" />
                <span>Compare Selected</span>
              </button>
            )}

            <div className="text-sm text-gray-600">
              {selectedForComparison.length > 0 && (
                <span>
                  {selectedForComparison.length}/2 selected for comparison
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Create Concept Form */}
        {showConceptForm && (
          <div className="p-4 bg-blue-50 border-b border-blue-200">
            <form onSubmit={handleCreateConcept} className="space-y-3">
              <div className="flex items-center space-x-3">
                <input
                  type="text"
                  value={newConceptName}
                  onChange={(e) => setNewConceptName(e.target.value)}
                  placeholder="Enter concept name (e.g., 'North End Italian', 'Fast Casual')"
                  className="form-input flex-1"
                  autoFocus
                />
                <button type="submit" className="btn-primary">
                  Create Concept
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowConceptForm(false);
                    setNewConceptName('');
                    setNewConceptDescription('');
                  }}
                  className="btn-secondary"
                >
                  Cancel
                </button>
              </div>
              <input
                type="text"
                value={newConceptDescription}
                onChange={(e) => setNewConceptDescription(e.target.value)}
                placeholder="Brief description of this concept (optional)"
                className="form-input w-full"
              />
            </form>
          </div>
        )}

        {/* Create Draft Form */}
        {showCreateForm && (
          <div className="p-4 bg-green-50 border-b border-green-200">
            <form onSubmit={handleCreateDraft} className="space-y-3">
              <div className="flex items-center space-x-3">
                <input
                  type="text"
                  value={newDraftName}
                  onChange={(e) => setNewDraftName(e.target.value)}
                  placeholder="Enter draft name (e.g., 'Location A', 'Budget Version', 'Premium Concept')"
                  className="form-input flex-1"
                  autoFocus
                />
                <button type="submit" className="btn-primary">
                  Create Draft
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateForm(false);
                    setNewDraftName('');
                    setSelectedTemplate('');
                  }}
                  className="btn-secondary"
                >
                  Cancel
                </button>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Choose a Restaurant Type Template (Optional)
                </label>
                <select
                  value={selectedTemplate}
                  onChange={(e) => setSelectedTemplate(e.target.value)}
                  className="form-input w-full"
                >
                  <option value="">Start from scratch</option>
                  {getTemplateOptions().map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label} - {option.description}
                    </option>
                  ))}
                </select>
                {selectedTemplate && (
                  <p className="text-xs text-gray-500 mt-1">
                    Template will pre-fill restaurant operations, financial data, and business concept
                  </p>
                )}
              </div>
            </form>
          </div>
        )}

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto max-h-96">
          {activeTab === 'concepts' ? (
            // Concepts View
            concepts.length === 0 ? (
              <div className="text-center py-12">
                <Folder className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-600">No Concepts Yet</h3>
                <p className="text-gray-500">Create your first business concept to get started</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {concepts.map((conceptName) => {
                  const conceptDrafts = draftsByConcept[conceptName];
                  const isExpanded = expandedConcepts.has(conceptName);
                  const currentDraftInConcept = conceptDrafts.find(d => d.id === state.currentDraftId);
                  
                  return (
                    <div key={conceptName} className="border-l-4 border-blue-200">
                      {/* Concept Header */}
                      <div className="p-4 hover:bg-gray-50 transition-colors">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4 flex-1">
                            <button
                              onClick={() => toggleConceptExpansion(conceptName)}
                              className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                              <ChevronDown className={`w-5 h-5 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                            </button>
                            
                            <div className="flex items-center space-x-3">
                              <Folder className="w-5 h-5 text-blue-600" />
                              <div>
                                <div className="flex items-center space-x-3">
                                  {editingConcept === conceptName ? (
                                    <input
                                      type="text"
                                      defaultValue={conceptName}
                                      className="text-lg font-semibold bg-white border rounded px-2 py-1"
                                      autoFocus
                                      onBlur={(e) => handleRenameConcept(conceptName, e.target.value)}
                                      onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                          handleRenameConcept(conceptName, e.target.value);
                                        } else if (e.key === 'Escape') {
                                          setEditingConcept(null);
                                        }
                                      }}
                                    />
                                  ) : (
                                    <h3 className="text-lg font-semibold text-gray-900">{conceptName}</h3>
                                  )}
                                  
                                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                    {conceptDrafts.length} draft{conceptDrafts.length !== 1 ? 's' : ''}
                                  </span>
                                  
                                  {currentDraftInConcept && (
                                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                      <CheckCircle className="w-3 h-3 mr-1" />
                                      Active
                                    </span>
                                  )}
                                </div>
                                
                                <div className="flex items-center text-sm text-gray-500 mt-1 space-x-4">
                                  <div className="flex items-center space-x-1">
                                    <Clock className="w-4 h-4" />
                                    <span>Updated {formatDate(conceptDrafts[0]?.updatedAt)}</span>
                                  </div>
                                  <div className="flex items-center space-x-1">
                                    <Tag className="w-4 h-4" />
                                    <span>Concept</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Concept Actions */}
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => setEditingConcept(conceptName)}
                              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                              title="Rename Concept"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            
                            <button
                              onClick={() => handleCreateDraftInConcept(conceptName)}
                              className="p-2 text-blue-400 hover:text-blue-600 transition-colors"
                              title="Add Draft to Concept"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Concept Drafts (when expanded) */}
                      {isExpanded && (
                        <div className="bg-gray-50 border-t border-gray-200">
                          <div className="divide-y divide-gray-200">
                            {conceptDrafts.map((draft) => (
                              <div
                                key={draft.id}
                                className={`p-4 ml-8 hover:bg-white transition-colors ${
                                  draft.id === state.currentDraftId ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                                }`}
                              >
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center space-x-4 flex-1">
                                    {/* Selection Checkbox for Comparison */}
                                    <input
                                      type="checkbox"
                                      checked={selectedForComparison.includes(draft.id)}
                                      onChange={() => toggleComparisonSelection(draft.id)}
                                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                                    />

                                    {/* Draft Info */}
                                    <div className="flex-1 cursor-pointer" onClick={() => handleSwitchDraft(draft.id)}>
                                      <div className="flex items-center space-x-3">
                                        {editingDraft === draft.id ? (
                                          <input
                                            type="text"
                                            defaultValue={draft.name}
                                            className="text-lg font-semibold bg-white border rounded px-2 py-1"
                                            autoFocus
                                            onClick={(e) => e.stopPropagation()}
                                            onBlur={(e) => handleRenameDraft(draft.id, e.target.value)}
                                            onKeyDown={(e) => {
                                              if (e.key === 'Enter') {
                                                handleRenameDraft(draft.id, e.target.value);
                                              } else if (e.key === 'Escape') {
                                                setEditingDraft(null);
                                              }
                                            }}
                                          />
                                        ) : (
                                          <h4 className="text-md font-medium text-gray-900">{draft.name}</h4>
                                        )}
                                        
                                        {draft.id === state.currentDraftId && (
                                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                            <CheckCircle className="w-3 h-3 mr-1" />
                                            Current
                                          </span>
                                        )}
                                      </div>
                                      
                                      <div className="flex items-center text-sm text-gray-500 mt-1 space-x-4">
                                        <div className="flex items-center space-x-1">
                                          <Clock className="w-4 h-4" />
                                          <span>Updated {formatDate(draft.updatedAt)}</span>
                                        </div>
                                        <div className="flex items-center space-x-1">
                                          <FileText className="w-4 h-4" />
                                          <span>Created {formatDate(draft.createdAt)}</span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Draft Actions */}
                                  <div className="flex items-center space-x-2">
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setEditingDraft(draft.id);
                                      }}
                                      className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                                      title="Rename"
                                    >
                                      <Edit3 className="w-4 h-4" />
                                    </button>
                                    
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleDuplicateDraft(draft.id);
                                      }}
                                      className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                                      title="Duplicate"
                                    >
                                      <Copy className="w-4 h-4" />
                                    </button>
                                    
                                    {conceptDrafts.length > 1 && (
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleDeleteDraft(draft.id);
                                        }}
                                        className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                                        title="Delete"
                                      >
                                        <Trash2 className="w-4 h-4" />
                                      </button>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )
          ) : (
            // All Drafts View (existing functionality)
            state.drafts.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-600">No Drafts Yet</h3>
                <p className="text-gray-500">Create your first business plan draft to get started</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {state.drafts.map((draft) => (
                  <div
                    key={draft.id}
                    className={`p-4 hover:bg-gray-50 transition-colors ${
                      draft.id === state.currentDraftId ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 flex-1">
                        {/* Selection Checkbox for Comparison */}
                        <input
                          type="checkbox"
                          checked={selectedForComparison.includes(draft.id)}
                          onChange={() => toggleComparisonSelection(draft.id)}
                          className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                        />

                        {/* Draft Info */}
                        <div className="flex items-center space-x-4 flex-1 cursor-pointer" onClick={() => handleSwitchDraft(draft.id)}>
                          <div className="flex items-center space-x-3">
                            {editingDraft === draft.id ? (
                              <input
                                type="text"
                                defaultValue={draft.name}
                                className="text-lg font-semibold bg-white border rounded px-2 py-1"
                                autoFocus
                                onClick={(e) => e.stopPropagation()}
                                onBlur={(e) => handleRenameDraft(draft.id, e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    handleRenameDraft(draft.id, e.target.value);
                                  } else if (e.key === 'Escape') {
                                    setEditingDraft(null);
                                  }
                                }}
                              />
                            ) : (
                              <h3 className="text-lg font-semibold text-gray-900">{draft.name}</h3>
                            )}
                            
                            {draft.id === state.currentDraftId && (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Current
                              </span>
                            )}
                          </div>
                          
                          {draft.concept && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                              <Tag className="w-3 h-3 mr-1" />
                              {draft.concept}
                            </span>
                          )}
                        </div>
                        
                        <div className="flex items-center text-sm text-gray-500 mt-1 space-x-4">
                          <div className="flex items-center space-x-1">
                            <Clock className="w-4 h-4" />
                            <span>Updated {formatDate(draft.updatedAt)}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <FileText className="w-4 h-4" />
                            <span>Created {formatDate(draft.createdAt)}</span>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingDraft(draft.id);
                          }}
                          className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                          title="Rename"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDuplicateDraft(draft.id);
                          }}
                          className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                          title="Duplicate"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                        
                        {state.drafts.length > 1 && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteDraft(draft.id);
                            }}
                            className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-50 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              {activeTab === 'concepts' ? (
                <>
                  {concepts.length} concept{concepts.length !== 1 ? 's' : ''} total
                  {state.drafts.length > 0 && (
                    <span className="ml-2">
                      • {state.drafts.length} draft{state.drafts.length !== 1 ? 's' : ''} across all concepts
                    </span>
                  )}
                </>
              ) : (
                <>
                  {state.drafts.length} draft{state.drafts.length !== 1 ? 's' : ''} total
                  {concepts.length > 0 && (
                    <span className="ml-2">
                      • {concepts.length} concept{concepts.length !== 1 ? 's' : ''} created
                    </span>
                  )}
                </>
              )}
              {currentDraft && (
                <span className="ml-2">
                  • Currently editing: <span className="font-medium">{currentDraft.name}</span>
                  {currentDraft.concept && (
                    <span className="text-purple-600"> in {currentDraft.concept}</span>
                  )}
                </span>
              )}
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="text-xs text-gray-500">
                💡 Tip: {activeTab === 'concepts' 
                  ? 'Create multiple drafts within each concept to explore different scenarios, locations, or business models'
                  : 'Organize drafts by concepts to group related business ideas and variations'
                }
              </div>
              <button onClick={onClose} className="btn-primary">
                Done
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DraftManager; 