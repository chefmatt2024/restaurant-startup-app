import React from 'react';
import { useNavigate } from 'react-router-dom';
import TermsAndPrivacy from '../components/auth/TermsAndPrivacy';

const PrivacyPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <TermsAndPrivacy 
          onAccept={() => navigate(-1)} 
          onDecline={() => navigate(-1)} 
        />
      </div>
    </div>
  );
};

export default PrivacyPage;


