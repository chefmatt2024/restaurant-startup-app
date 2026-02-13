import React, { useState } from 'react';
import DocumentsCompliance from './DocumentsCompliance';
import OpenRestaurantManager from './OpenRestaurantManager';
import CertificationManager from './CertificationManager';
import { Shield, Rocket, Award } from 'lucide-react';

const ComplianceHub = () => {
  const [subTab, setSubTab] = useState('documents'); // 'documents' | 'open-restaurant' | 'certifications'

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <div className="inline-flex p-1 bg-gray-100 rounded-lg flex-wrap gap-1">
          <button type="button" onClick={() => setSubTab('documents')} className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${subTab === 'documents' ? 'bg-white text-red-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}>
            <Shield className="w-4 h-4" /> Documents
          </button>
          <button type="button" onClick={() => setSubTab('open-restaurant')} className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${subTab === 'open-restaurant' ? 'bg-white text-red-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}>
            <Rocket className="w-4 h-4" /> Open Restaurant
          </button>
          <button type="button" onClick={() => setSubTab('certifications')} className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${subTab === 'certifications' ? 'bg-white text-red-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}>
            <Award className="w-4 h-4" /> Certifications
          </button>
        </div>
      </div>
      {subTab === 'documents' && <DocumentsCompliance />}
      {subTab === 'open-restaurant' && <OpenRestaurantManager />}
      {subTab === 'certifications' && <CertificationManager />}
    </div>
  );
};

export default ComplianceHub;
