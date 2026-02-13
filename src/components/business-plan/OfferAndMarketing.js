import React, { useState } from 'react';
import ServiceDescription from './ServiceDescription';
import MarketingStrategy from './MarketingStrategy';
import { Target } from 'lucide-react';

const OfferAndMarketing = () => {
  const [subTab, setSubTab] = useState('services'); // 'services' | 'marketing'

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <div className="inline-flex p-1 bg-gray-100 rounded-lg">
          <button type="button" onClick={() => setSubTab('services')} className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${subTab === 'services' ? 'bg-white text-purple-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}>
            <Target className="w-4 h-4" /> Products/Services
          </button>
          <button type="button" onClick={() => setSubTab('marketing')} className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${subTab === 'marketing' ? 'bg-white text-purple-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}>
            <Target className="w-4 h-4" /> Marketing
          </button>
        </div>
      </div>
      {subTab === 'services' && <ServiceDescription />}
      {subTab === 'marketing' && <MarketingStrategy />}
    </div>
  );
};

export default OfferAndMarketing;
