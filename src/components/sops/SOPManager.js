import React, { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import SectionCard from '../ui/SectionCard';
import FormField from '../ui/FormField';
import { FileText, Plus, Trash2, Edit2, ChevronDown, ChevronRight } from 'lucide-react';

const SOP_CATEGORIES = [
  { id: 'opening', label: 'Opening' },
  { id: 'closing', label: 'Closing' },
  { id: 'food-safety', label: 'Food Safety' },
  { id: 'cleaning', label: 'Cleaning' },
  { id: 'cash-handling', label: 'Cash Handling' },
  { id: 'customer-service', label: 'Customer Service' },
  { id: 'other', label: 'Other' }
];

const newSOP = () => ({
  id: `sop_${Date.now()}`,
  title: '',
  category: 'opening',
  steps: [{ order: 1, text: '' }],
  updatedAt: new Date()
});

const SOPManager = () => {
  const { state, actions } = useApp();
  const sops = state.sops || [];
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(null);
  const [expandedId, setExpandedId] = useState(null);

  const handleAdd = () => {
    const sop = newSOP();
    setForm(sop);
    setEditingId(sop.id);
  };

  const handleEdit = (sop) => {
    setForm({ ...sop, steps: sop.steps?.length ? sop.steps.map((s) => ({ ...s })) : [{ order: 1, text: '' }] });
    setEditingId(sop.id);
  };

  const handleSave = () => {
    if (!form || !form.title.trim()) return;
    const updated = form.id && sops.some((s) => s.id === form.id)
      ? sops.map((s) => (s.id === form.id ? { ...form, updatedAt: new Date() } : s))
      : [...sops, { ...form, id: form.id || `sop_${Date.now()}`, updatedAt: new Date() }];
    actions.updateSops(updated);
    setForm(null);
    setEditingId(null);
  };

  const handleDelete = (id) => {
    if (!window.confirm('Delete this SOP?')) return;
    actions.updateSops(sops.filter((s) => s.id !== id));
    if (editingId === id) {
      setForm(null);
      setEditingId(null);
    }
  };

  const updateStep = (index, text) => {
    if (!form) return;
    const steps = [...(form.steps || [])];
    while (steps.length <= index) steps.push({ order: steps.length + 1, text: '' });
    steps[index] = { ...steps[index], order: index + 1, text };
    setForm({ ...form, steps });
  };

  const addStep = () => {
    if (!form) return;
    const steps = [...(form.steps || []), { order: (form.steps?.length || 0) + 1, text: '' }];
    setForm({ ...form, steps });
  };

  const removeStep = (index) => {
    if (!form || !form.steps?.length) return;
    const steps = form.steps.filter((_, i) => i !== index).map((s, i) => ({ ...s, order: i + 1 }));
    setForm({ ...form, steps });
  };

  return (
    <div className="space-y-6">
      <SectionCard title="SOPs" color="indigo">
        <p className="text-sm text-gray-600 mb-4">
          Create and store standard operating procedures by category. Use these for training and daily operations.
        </p>
        <button
          type="button"
          onClick={handleAdd}
          className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm font-medium"
        >
          <Plus className="w-4 h-4" />
          Add SOP
        </button>
      </SectionCard>

      {editingId && form && (
        <SectionCard title={sops.some((s) => s.id === form.id) ? 'Edit SOP' : 'New SOP'} color="indigo">
          <div className="space-y-4">
            <FormField
              label="Title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="e.g. Daily opening checklist"
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="border border-gray-300 rounded-md px-3 py-2 w-full max-w-xs"
              >
                {SOP_CATEGORIES.map((c) => (
                  <option key={c.id} value={c.id}>{c.label}</option>
                ))}
              </select>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">Steps</label>
                <button type="button" onClick={addStep} className="text-sm text-indigo-600 hover:text-indigo-800">
                  + Add step
                </button>
              </div>
              <ul className="space-y-2">
                {(form.steps || []).map((step, index) => (
                  <li key={index} className="flex gap-2 items-start">
                    <span className="flex-shrink-0 w-6 h-9 flex items-center text-gray-500 text-sm">{index + 1}.</span>
                    <input
                      type="text"
                      value={step.text}
                      onChange={(e) => updateStep(index, e.target.value)}
                      placeholder="Step description"
                      className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => removeStep(index)}
                      className="p-2 text-gray-400 hover:text-red-600"
                      aria-label="Remove step"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={handleSave}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm font-medium"
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => { setForm(null); setEditingId(null); }}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        </SectionCard>
      )}

      <SectionCard title="Your SOPs" color="gray">
        {sops.length === 0 ? (
          <p className="text-gray-500 text-sm">No SOPs yet. Click &quot;Add SOP&quot; to create one.</p>
        ) : (
          <ul className="space-y-2">
            {sops.map((sop) => (
              <li key={sop.id} className="border border-gray-200 rounded-lg overflow-hidden">
                <div
                  className="flex items-center gap-2 p-3 bg-gray-50 cursor-pointer hover:bg-gray-100"
                  onClick={() => setExpandedId(expandedId === sop.id ? null : sop.id)}
                >
                  {expandedId === sop.id ? (
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-gray-500" />
                  )}
                  <FileText className="w-4 h-4 text-indigo-600 flex-shrink-0" />
                  <span className="font-medium text-gray-900 flex-1">{sop.title || 'Untitled SOP'}</span>
                  <span className="text-xs text-gray-500">
                    {SOP_CATEGORIES.find((c) => c.id === sop.category)?.label || sop.category}
                  </span>
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); handleEdit(sop); }}
                    className="p-1.5 text-gray-400 hover:text-indigo-600"
                    aria-label="Edit"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); handleDelete(sop.id); }}
                    className="p-1.5 text-gray-400 hover:text-red-600"
                    aria-label="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                {expandedId === sop.id && (
                  <div className="p-3 pt-0 border-t border-gray-200 bg-white">
                    <ol className="list-decimal list-inside space-y-1 text-sm text-gray-700">
                      {(sop.steps || []).map((step, i) => (
                        <li key={i}>{step.text || '(empty)'}</li>
                      ))}
                    </ol>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </SectionCard>
    </div>
  );
};

export default SOPManager;
