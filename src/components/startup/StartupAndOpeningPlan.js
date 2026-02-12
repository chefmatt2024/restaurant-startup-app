import React, { useState } from 'react';
import StartupJourney from './StartupJourney';
import OpeningPlan from './OpeningPlan';
import { Compass, Target } from 'lucide-react';

const StartupAndOpeningPlan = () => {
  const [subTab, setSubTab] = useState('journey'); // 'journey' | 'opening'

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <div className="inline-flex p-1 bg-gray-100 rounded-lg">
          <button
            type="button"
            onClick={() => setSubTab('journey')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
              subTab === 'journey' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Compass className="w-4 h-4" />
            Startup Journey
          </button>
          <button
            type="button"
            onClick={() => setSubTab('opening')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
              subTab === 'opening' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Target className="w-4 h-4" />
            Opening Plan
          </button>
        </div>
      </div>
      {subTab === 'journey' ? <StartupJourney /> : <OpeningPlan />}
    </div>
  );
};

export default StartupAndOpeningPlan;
