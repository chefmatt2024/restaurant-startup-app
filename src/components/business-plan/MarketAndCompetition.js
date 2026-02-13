import React, { useState } from 'react';
import MarketAnalysis from './MarketAnalysis';
import CompetitiveAnalysis from './CompetitiveAnalysis';
import { BarChart3, Target } from 'lucide-react';

const MarketAndCompetition = () => {
  const [subTab, setSubTab] = useState('market'); // 'market' | 'competition'

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <div className="inline-flex p-1 bg-gray-100 rounded-lg">
          <button type="button" onClick={() => setSubTab('market')} className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${subTab === 'market' ? 'bg-white text-green-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}>
            <BarChart3 className="w-4 h-4" /> Market Analysis
          </button>
          <button type="button" onClick={() => setSubTab('competition')} className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${subTab === 'competition' ? 'bg-white text-green-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}>
            <Target className="w-4 h-4" /> Competitive Analysis
          </button>
        </div>
      </div>
      {subTab === 'market' && <MarketAnalysis />}
      {subTab === 'competition' && <CompetitiveAnalysis />}
    </div>
  );
};

export default MarketAndCompetition;
