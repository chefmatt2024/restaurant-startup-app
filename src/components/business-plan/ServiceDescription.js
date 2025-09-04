import React from 'react';
import { useApp } from '../../contexts/AppContext';
import FormField from '../ui/FormField';
import SectionCard from '../ui/SectionCard';

const ServiceDescription = () => {
  const { state, actions } = useApp();
  const data = state.businessPlan.serviceDescription;

  const handleFieldChange = (field, value) => {
    actions.updateBusinessPlan('serviceDescription', { [field]: value });
  };

  return (
    <div className="animate-fade-in">
      <SectionCard 
        title="Products & Services Description" 
        description="Describe what you're selling and your value proposition."
        color="red"
      >
        <div className="space-y-6">
          <FormField
            label="Products/Services Offered"
            type="textarea"
            value={data.productsServices}
            onChange={(value) => handleFieldChange('productsServices', value)}
            placeholder="Detailed description of your products or services"
            rows={4}
          />
          
          <FormField
            label="Unique Selling Proposition"
            type="textarea"
            value={data.uniqueSellingProposition}
            onChange={(value) => handleFieldChange('uniqueSellingProposition', value)}
            placeholder="What makes your offering unique and valuable to customers?"
            rows={3}
          />
          
          <FormField
            label="Pricing Strategy"
            type="textarea"
            value={data.pricingStrategy}
            onChange={(value) => handleFieldChange('pricingStrategy', value)}
            placeholder="Pricing model, competitive positioning, value justification"
            rows={3}
          />
          
          <FormField
            label="Product/Service Lifecycle"
            type="textarea"
            value={data.lifecycle}
            onChange={(value) => handleFieldChange('lifecycle', value)}
            placeholder="Development stage, future enhancements, expansion plans"
            rows={3}
          />
        </div>
      </SectionCard>
    </div>
  );
};

export default ServiceDescription; 