import React, { useState } from 'react';
import ManagementTeam from './ManagementTeam';
import CapTable from '../financial/CapTable';
import { Users, PieChart } from 'lucide-react';

const TeamAndCapTable = () => {
  const [subTab, setSubTab] = useState('team'); // 'team' | 'cap-table'

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <div className="inline-flex p-1 bg-gray-100 rounded-lg">
          <button
            type="button"
            onClick={() => setSubTab('team')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
              subTab === 'team' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Users className="w-4 h-4" />
            Management Team
          </button>
          <button
            type="button"
            onClick={() => setSubTab('cap-table')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
              subTab === 'cap-table' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <PieChart className="w-4 h-4" />
            Cap Table
          </button>
        </div>
      </div>
      {subTab === 'team' ? <ManagementTeam /> : <CapTable />}
    </div>
  );
};

export default TeamAndCapTable;
