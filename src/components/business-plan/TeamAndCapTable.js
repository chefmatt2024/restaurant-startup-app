import React, { useState } from 'react';
import ManagementTeam from './ManagementTeam';
import StaffingPlanSection from './StaffingPlanSection';
import CapTable from '../financial/CapTable';
import SectionCard from '../ui/SectionCard';
import { PieChart, UserCog } from 'lucide-react';

const TeamAndCapTable = () => {
  const [subTab, setSubTab] = useState('staffing-management'); // 'staffing-management' | 'cap-table'

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <div className="inline-flex p-1 bg-gray-100 rounded-lg">
          <button
            type="button"
            onClick={() => setSubTab('staffing-management')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
              subTab === 'staffing-management' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <UserCog className="w-4 h-4" />
            Staffing & Management
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

      {subTab === 'staffing-management' ? (
        <div className="space-y-8">
          <SectionCard title="Staffing Plan" description="Headcount, roles, and labor requirements." color="purple">
            <StaffingPlanSection />
          </SectionCard>
          <ManagementTeam />
        </div>
      ) : (
        <CapTable />
      )}
    </div>
  );
};

export default TeamAndCapTable;
