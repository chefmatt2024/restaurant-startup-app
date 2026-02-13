import React, { useState } from 'react';
import EquipmentPlanning from './EquipmentPlanning';
import MenuBuilder from '../menu/MenuBuilder';
import { Wrench, Utensils } from 'lucide-react';

const EquipmentAndMenu = () => {
  const [subTab, setSubTab] = useState('equipment'); // 'equipment' | 'menu'

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <div className="inline-flex p-1 bg-gray-100 rounded-lg">
          <button type="button" onClick={() => setSubTab('equipment')} className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${subTab === 'equipment' ? 'bg-white text-purple-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}>
            <Wrench className="w-4 h-4" /> Equipment
          </button>
          <button type="button" onClick={() => setSubTab('menu')} className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${subTab === 'menu' ? 'bg-white text-purple-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}>
            <Utensils className="w-4 h-4" /> Menu Builder
          </button>
        </div>
      </div>
      {subTab === 'equipment' && <EquipmentPlanning />}
      {subTab === 'menu' && <MenuBuilder />}
    </div>
  );
};

export default EquipmentAndMenu;
