import React, { useState } from 'react';
import IdeaFormation from './IdeaFormation';
import ElevatorPitchBuilder from './ElevatorPitchBuilder';
import ExecutiveSummary from '../business-plan/ExecutiveSummary';
import { Lightbulb, Mic, FileText } from 'lucide-react';

const ConceptAndPitch = () => {
  const [subTab, setSubTab] = useState('idea'); // 'idea' | 'pitch' | 'summary'

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <div className="inline-flex p-1 bg-gray-100 rounded-lg">
          <button type="button" onClick={() => setSubTab('idea')} className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${subTab === 'idea' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}>
            <Lightbulb className="w-4 h-4" /> Idea
          </button>
          <button type="button" onClick={() => setSubTab('pitch')} className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${subTab === 'pitch' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}>
            <Mic className="w-4 h-4" /> Elevator Pitch
          </button>
          <button type="button" onClick={() => setSubTab('summary')} className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${subTab === 'summary' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}>
            <FileText className="w-4 h-4" /> Executive Summary
          </button>
        </div>
      </div>
      {subTab === 'idea' && <IdeaFormation />}
      {subTab === 'pitch' && <ElevatorPitchBuilder />}
      {subTab === 'summary' && <ExecutiveSummary />}
    </div>
  );
};

export default ConceptAndPitch;
