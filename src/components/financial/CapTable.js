import React, { useState, useMemo } from 'react';
import { useApp } from '../../contexts/AppContext';
import SectionCard from '../ui/SectionCard';
import { Plus, Trash2, Users, UserPlus, Percent, PieChart, Briefcase, Crown } from 'lucide-react';

const CapTable = () => {
  const { state, actions } = useApp();
  const entries = state.financialData?.capTable?.entries || [];
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAddFromTeam, setShowAddFromTeam] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ name: '', role: '', type: 'common', ownershipPercent: '', shares: '' });

  const updateCapTable = (newEntries) => {
    actions.updateFinancialData('capTable', { entries: newEntries });
  };

  const handleAdd = () => {
    const pct = parseFloat(form.ownershipPercent) || 0;
    if (!form.name.trim() || pct <= 0) return;
    const entry = {
      id: `cap_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: form.name.trim(),
      role: form.role.trim() || 'Owner',
      type: form.type,
      ownershipPercent: pct,
      shares: form.shares ? parseInt(form.shares, 10) : null,
      source: 'manual'
    };
    updateCapTable([...entries, entry]);
    setForm({ name: '', role: '', type: 'common', ownershipPercent: '', shares: '' });
    setShowAddModal(false);
  };

  const handleAddFromManagement = (member) => {
    const existing = entries.find(e => e.sourceId === member.id && e.source === 'management');
    if (existing) return;
    const pct = parseFloat(form.ownershipPercent) || 0;
    const entry = {
      id: `cap_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      sourceId: member.id,
      source: 'management',
      name: member.name || member.role || 'Team member',
      role: member.role || 'Manager',
      type: 'common',
      ownershipPercent: pct || 0,
      shares: null
    };
    updateCapTable([...entries, entry]);
    setShowAddFromTeam(false);
    setForm({ ...form, ownershipPercent: '' });
  };

  const handleAddFromLabor = (person, department) => {
    const existing = entries.find(e => e.sourceId === person.id && e.source === 'labor');
    if (existing) return;
    const entry = {
      id: `cap_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      sourceId: person.id,
      source: 'labor',
      name: person.name || 'Staff',
      role: person.department || department,
      type: 'common',
      ownershipPercent: parseFloat(form.ownershipPercent) || 0,
      shares: null
    };
    updateCapTable([...entries, entry]);
    setShowAddFromTeam(false);
    setForm({ ...form, ownershipPercent: '' });
  };

  const handleUpdate = (id, updates) => {
    updateCapTable(entries.map(e => e.id === id ? { ...e, ...updates } : e));
    setEditingId(null);
  };

  const handleRemove = (id) => {
    updateCapTable(entries.filter(e => e.id !== id));
    setEditingId(null);
  };

  const totalPercent = useMemo(() => entries.reduce((sum, e) => sum + (e.ownershipPercent || 0), 0), [entries]);

  // Management team members (for "Add from team")
  const teamMembers = state.businessPlan?.managementTeam?.teamMembers || [];

  // Labor / employees from financials (management, FOH, BOH, support)
  const laborEntries = useMemo(() => {
    const labor = state.financialData?.operatingExpenses?.labor || {};
    const list = [];
    ['management', 'frontOfHouse', 'backOfHouse', 'support'].forEach(dept => {
      const arr = labor[dept];
      if (Array.isArray(arr)) arr.forEach(p => list.push({ ...p, department: dept }));
    });
    return list;
  }, [state.financialData?.operatingExpenses?.labor]);

  return (
    <div className="animate-fade-in">
      <SectionCard
        title="Cap Table"
        description="Ownership and equity: add founders, managers, and employees to the cap table."
        color="indigo"
      >
        <div className="flex flex-wrap gap-2 mb-4">
          <button
            type="button"
            onClick={() => { setForm({ name: '', role: '', type: 'common', ownershipPercent: '', shares: '' }); setShowAddModal(true); }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm font-medium"
          >
            <Plus className="w-4 h-4" /> Add entry
          </button>
          <button
            type="button"
            onClick={() => setShowAddFromTeam(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-50 text-sm font-medium"
          >
            <UserPlus className="w-4 h-4" /> Add from team or staff
          </button>
        </div>

        <div className="mb-4 p-3 bg-gray-50 rounded-lg flex items-center gap-2">
          <PieChart className="w-5 h-5 text-indigo-600" />
          <span className="font-medium">Total ownership: {totalPercent.toFixed(1)}%</span>
          {totalPercent > 100 && <span className="text-red-600 text-sm">(over 100%)</span>}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-left text-gray-600">
                <th className="py-2 pr-4">Name</th>
                <th className="py-2 pr-4">Role / Type</th>
                <th className="py-2 pr-4">Ownership %</th>
                <th className="py-2 pr-4">Shares</th>
                <th className="py-2 w-20"></th>
              </tr>
            </thead>
            <tbody>
              {entries.length === 0 ? (
                <tr><td colSpan={5} className="py-6 text-gray-500 text-center">No cap table entries yet. Add manually or from your management team and staff.</td></tr>
              ) : (
                entries.map((entry) => (
                  <tr key={entry.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-2 pr-4 font-medium">{entry.name}</td>
                    <td className="py-2 pr-4">
                      <span className="text-gray-700">{entry.role}</span>
                      <span className="text-gray-400 ml-1">· {entry.type}</span>
                      {entry.source !== 'manual' && (
                        <span className="ml-1 text-xs text-indigo-600">
                          {entry.source === 'management' ? <Crown className="w-3 h-3 inline" /> : <Briefcase className="w-3 h-3 inline" />}
                        </span>
                      )}
                    </td>
                    <td className="py-2 pr-4">
                      {editingId === entry.id ? (
                        <input
                          type="number"
                          min="0"
                          step="0.1"
                          value={entry.ownershipPercent}
                          onChange={(e) => handleUpdate(entry.id, { ownershipPercent: parseFloat(e.target.value) || 0 })}
                          className="w-20 border rounded px-2 py-1"
                        />
                      ) : (
                        <span>{entry.ownershipPercent != null ? `${entry.ownershipPercent}%` : '—'}</span>
                      )}
                    </td>
                    <td className="py-2 pr-4">{entry.shares != null ? entry.shares.toLocaleString() : '—'}</td>
                    <td className="py-2">
                      <button type="button" onClick={() => setEditingId(editingId === entry.id ? null : entry.id)} className="text-gray-500 hover:text-indigo-600 mr-1">Edit</button>
                      <button type="button" onClick={() => handleRemove(entry.id)} className="text-gray-500 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Add entry modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowAddModal(false)}>
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6" onClick={e => e.stopPropagation()}>
              <h3 className="text-lg font-semibold mb-4">Add cap table entry</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Full name" className="w-full border rounded-lg px-3 py-2" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                  <input type="text" value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} placeholder="e.g. Founder, Manager" className="w-full border rounded-lg px-3 py-2" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                  <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} className="w-full border rounded-lg px-3 py-2">
                    <option value="common">Common</option>
                    <option value="preferred">Preferred</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ownership %</label>
                  <input type="number" min="0" step="0.1" value={form.ownershipPercent} onChange={e => setForm({ ...form, ownershipPercent: e.target.value })} className="w-full border rounded-lg px-3 py-2" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Shares (optional)</label>
                  <input type="number" min="0" value={form.shares} onChange={e => setForm({ ...form, shares: e.target.value })} className="w-full border rounded-lg px-3 py-2" />
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <button type="button" onClick={() => setShowAddModal(false)} className="px-4 py-2 border rounded-lg">Cancel</button>
                <button type="button" onClick={handleAdd} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">Add</button>
              </div>
            </div>
          </div>
        )}

        {/* Add from team / staff modal */}
        {showAddFromTeam && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowAddFromTeam(false)}>
            <div className="bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[80vh] overflow-hidden flex flex-col" onClick={e => e.stopPropagation()}>
              <div className="p-4 border-b">
                <h3 className="text-lg font-semibold">Add from management team or staff</h3>
                <p className="text-sm text-gray-500 mt-1">Select a person to add to the cap table, then set ownership %.</p>
                <div className="mt-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ownership % for selected</label>
                  <input type="number" min="0" step="0.1" value={form.ownershipPercent} onChange={e => setForm({ ...form, ownershipPercent: e.target.value })} className="w-24 border rounded px-2 py-1" />
                </div>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {teamMembers.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-800 mb-2 flex items-center gap-2"><Crown className="w-4 h-4" /> Management team</h4>
                    <ul className="space-y-1">
                      {teamMembers.map((m) => {
                        const already = entries.some(e => e.sourceId === m.id && e.source === 'management');
                        return (
                          <li key={m.id} className="flex items-center justify-between py-1">
                            <span>{m.name || m.role || 'Unnamed'}</span>
                            <button type="button" disabled={already} onClick={() => handleAddFromManagement(m)} className="text-indigo-600 disabled:text-gray-400 text-sm font-medium">
                              {already ? 'Added' : 'Add to cap table'}
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}
                {laborEntries.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-800 mb-2 flex items-center gap-2"><Users className="w-4 h-4" /> Staff (from financials)</h4>
                    <ul className="space-y-1">
                      {laborEntries.map((p) => {
                        const already = entries.some(e => e.sourceId === p.id && e.source === 'labor');
                        return (
                          <li key={p.id} className="flex items-center justify-between py-1">
                            <span>{p.name || 'Unnamed'} · {p.department}</span>
                            <button type="button" disabled={already} onClick={() => handleAddFromLabor(p, p.department)} className="text-indigo-600 disabled:text-gray-400 text-sm font-medium">
                              {already ? 'Added' : 'Add to cap table'}
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}
                {teamMembers.length === 0 && laborEntries.length === 0 && (
                  <p className="text-gray-500 text-sm">Add people in the Management Team tab or in Financial Projections → Labor to see them here.</p>
                )}
              </div>
              <div className="p-4 border-t">
                <button type="button" onClick={() => setShowAddFromTeam(false)} className="w-full py-2 border rounded-lg">Close</button>
              </div>
            </div>
          </div>
        )}
      </SectionCard>
    </div>
  );
};

export default CapTable;
