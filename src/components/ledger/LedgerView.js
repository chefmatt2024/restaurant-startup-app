import React, { useState, useMemo } from 'react';
import { useApp } from '../../contexts/AppContext';
import SectionCard from '../ui/SectionCard';
import FormField from '../ui/FormField';
import { DollarSign, Receipt, FileText, Plus, Trash2, Edit2, Filter } from 'lucide-react';

const EXPENSE_CATEGORIES = [
  'Food & Beverage', 'Supplies', 'Labor', 'Rent', 'Utilities', 'Marketing', 'Insurance', 'Licenses', 'Equipment', 'Other'
];

const newExpense = () => ({
  id: `ledger_${Date.now()}`,
  type: 'expense',
  date: new Date().toISOString().slice(0, 10),
  description: '',
  amount: 0,
  category: 'Other',
  vendor: ''
});

const newInvoice = () => ({
  id: `ledger_${Date.now()}`,
  type: 'invoice',
  date: new Date().toISOString().slice(0, 10),
  dueDate: '',
  description: '',
  amount: 0,
  vendor: '',
  status: 'unpaid'
});

const LedgerView = () => {
  const { state, actions } = useApp();
  const entries = state.ledgerEntries || [];
  const [view, setView] = useState('all'); // 'all' | 'expenses' | 'invoices'
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(null);
  const [filterMonth, setFilterMonth] = useState('');

  const filtered = useMemo(() => {
    let list = view === 'expenses' ? entries.filter(e => e.type === 'expense')
      : view === 'invoices' ? entries.filter(e => e.type === 'invoice')
      : entries;
    if (filterMonth) {
      const [y, m] = filterMonth.split('-').map(Number);
      list = list.filter(e => {
        const d = e.date ? new Date(e.date) : null;
        return d && d.getFullYear() === y && d.getMonth() + 1 === m;
      });
    }
    return list.sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));
  }, [entries, view, filterMonth]);

  const totals = useMemo(() => {
    const expenses = entries.filter(e => e.type === 'expense');
    const invoices = entries.filter(e => e.type === 'invoice');
    const totalExpenses = expenses.reduce((s, e) => s + (Number(e.amount) || 0), 0);
    const totalInvoices = invoices.reduce((s, e) => s + (Number(e.amount) || 0), 0);
    const unpaidInvoices = invoices.filter(e => e.status === 'unpaid').reduce((s, e) => s + (Number(e.amount) || 0), 0);
    return { totalExpenses, totalInvoices, unpaidInvoices };
  }, [entries]);

  const handleSave = () => {
    if (!form) return;
    const amount = Number(form.amount);
    if (form.type === 'expense' && (amount <= 0 || !form.description?.trim())) return;
    if (form.type === 'invoice' && (amount <= 0 || !form.description?.trim())) return;
    const updated = form.id && entries.some(e => e.id === form.id)
      ? entries.map(e => e.id === form.id ? { ...form, amount } : e)
      : [...entries, { ...form, amount }];
    actions.updateLedgerEntries(updated);
    setForm(null);
    setEditing(null);
  };

  const handleDelete = (id) => {
    if (!window.confirm('Remove this entry?')) return;
    actions.updateLedgerEntries(entries.filter(e => e.id !== id));
    if (editing === id) { setForm(null); setEditing(null); }
  };

  const formatCurrency = (n) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 }).format(n ?? 0);

  const monthOptions = useMemo(() => {
    const opts = [{ value: '', label: 'All months' }];
    const seen = new Set();
    entries.forEach(e => {
      if (e.date) {
        const d = e.date.slice(0, 7);
        if (!seen.has(d)) { seen.add(d); opts.push({ value: d, label: new Date(d + '-01').toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) }); }
      }
    });
    return opts.sort((a, b) => (b.value || '').localeCompare(a.value || ''));
  }, [entries]);

  return (
    <div className="space-y-6">
      <SectionCard title="Expenses & invoices ledger" color="blue">
        <p className="text-sm text-gray-600 mb-4">
          Track expenses (outflows) and invoices (bills to pay or paid). Entries are saved with your current draft.
        </p>
        <div className="flex flex-wrap gap-4 mb-4">
          <div className="flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-2">
            <DollarSign className="w-5 h-5 text-red-600" />
            <span className="text-sm font-medium text-gray-700">Expenses</span>
            <span className="font-semibold text-gray-900">{formatCurrency(totals.totalExpenses)}</span>
          </div>
          <div className="flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-2">
            <FileText className="w-5 h-5 text-amber-600" />
            <span className="text-sm font-medium text-gray-700">Invoices total</span>
            <span className="font-semibold text-gray-900">{formatCurrency(totals.totalInvoices)}</span>
          </div>
          <div className="flex items-center gap-2 rounded-lg bg-amber-50 px-3 py-2 border border-amber-200">
            <span className="text-sm font-medium text-amber-800">Unpaid</span>
            <span className="font-semibold text-amber-900">{formatCurrency(totals.unpaidInvoices)}</span>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => { setForm(newExpense()); setEditing('new'); }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm font-medium"
          >
            <Plus className="w-4 h-4" />
            Add expense
          </button>
          <button
            type="button"
            onClick={() => { setForm(newInvoice()); setEditing('new'); }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 text-sm font-medium"
          >
            <Plus className="w-4 h-4" />
            Add invoice
          </button>
        </div>
      </SectionCard>

      {(editing && form) && (
        <SectionCard title={form.type === 'expense' ? 'Add / edit expense' : 'Add / edit invoice'} color="gray">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Date" type="date" value={form.date} onChange={val => setForm({ ...form, date: val })} />
            <FormField label="Description" value={form.description} onChange={val => setForm({ ...form, description: val })} placeholder="e.g. Weekly produce order" />
            <FormField label="Amount" type="number" min="0" step="0.01" value={form.amount || ''} onChange={val => setForm({ ...form, amount: val })} />
            <FormField label="Vendor / payee" value={form.vendor} onChange={val => setForm({ ...form, vendor: val })} placeholder="Optional" />
            {form.type === 'expense' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="border border-gray-300 rounded-md px-3 py-2 w-full">
                  {EXPENSE_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            )}
            {form.type === 'invoice' && (
              <>
                <FormField label="Due date" type="date" value={form.dueDate || ''} onChange={val => setForm({ ...form, dueDate: val })} />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} className="border border-gray-300 rounded-md px-3 py-2 w-full">
                    <option value="unpaid">Unpaid</option>
                    <option value="paid">Paid</option>
                  </select>
                </div>
              </>
            )}
          </div>
          <div className="flex gap-2 mt-4">
            <button type="button" onClick={handleSave} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium">Save</button>
            <button type="button" onClick={() => { setForm(null); setEditing(null); }} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 text-sm">Cancel</button>
          </div>
        </SectionCard>
      )}

      <SectionCard title="Ledger entries" color="gray">
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <div className="flex rounded-lg border border-gray-200 overflow-hidden">
            {['all', 'expenses', 'invoices'].map(v => (
              <button key={v} type="button" onClick={() => setView(v)} className={`px-3 py-2 text-sm font-medium capitalize ${view === v ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}>
                {v}
              </button>
            ))}
          </div>
          <select value={filterMonth} onChange={e => setFilterMonth(e.target.value)} className="border border-gray-300 rounded-md px-3 py-2 text-sm">
            {monthOptions.map(o => <option key={o.value || 'all'} value={o.value}>{o.label}</option>)}
          </select>
        </div>
        {filtered.length === 0 ? (
          <p className="text-gray-500 text-sm">No entries yet. Add an expense or invoice above.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 text-left text-gray-600">
                  <th className="py-2 pr-2">Date</th>
                  <th className="py-2 pr-2">Type</th>
                  <th className="py-2 pr-2">Description</th>
                  <th className="py-2 pr-2">Vendor</th>
                  {view !== 'expenses' && <th className="py-2 pr-2">Status</th>}
                  <th className="py-2 pr-2 text-right">Amount</th>
                  <th className="py-2 pr-2 w-20" />
                </tr>
              </thead>
              <tbody>
                {filtered.map(entry => (
                  <tr key={entry.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-2 pr-2 whitespace-nowrap">{entry.date ? new Date(entry.date).toLocaleDateString() : '—'}</td>
                    <td className="py-2 pr-2">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${entry.type === 'expense' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'}`}>
                        {entry.type === 'expense' ? <Receipt className="w-3 h-3" /> : <FileText className="w-3 h-3" />}
                        {entry.type}
                      </span>
                    </td>
                    <td className="py-2 pr-2">{entry.description || '—'}</td>
                    <td className="py-2 pr-2 text-gray-600">{entry.vendor || '—'}</td>
                    {view !== 'expenses' && <td className="py-2 pr-2">{entry.type === 'invoice' ? (entry.status === 'paid' ? 'Paid' : 'Unpaid') : '—'}</td>}
                    <td className="py-2 pr-2 text-right font-medium">{formatCurrency(entry.amount)}</td>
                    <td className="py-2 pr-2">
                      <div className="flex gap-1">
                        <button type="button" onClick={() => { setForm({ ...entry }); setEditing(entry.id); }} className="p-1 text-gray-400 hover:text-blue-600" aria-label="Edit"><Edit2 className="w-4 h-4" /></button>
                        <button type="button" onClick={() => handleDelete(entry.id)} className="p-1 text-gray-400 hover:text-red-600" aria-label="Delete"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </SectionCard>
    </div>
  );
};

export default LedgerView;
