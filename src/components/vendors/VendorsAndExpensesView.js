import React, { useState } from 'react';
import VendorManagement from './VendorManagement';
import LedgerView from '../ledger/LedgerView';
import { Truck, Receipt } from 'lucide-react';

const SUB_TABS = [
  { id: 'vendors', label: 'Vendors', icon: Truck, description: 'Vendor contacts & management' },
  { id: 'expenses', label: 'Expenses & Ledger', icon: Receipt, description: 'Expenses & invoices' },
];

const VendorsAndExpensesView = () => {
  const [subTab, setSubTab] = useState('vendors');

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-4">
        {SUB_TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => setSubTab(id)}
            className={`
              inline-flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm transition-colors
              ${subTab === id
                ? 'bg-amber-100 text-amber-800 border border-amber-300'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border border-transparent'}
            `}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>
      {subTab === 'vendors' && <VendorManagement />}
      {subTab === 'expenses' && <LedgerView />}
    </div>
  );
};

export default VendorsAndExpensesView;
