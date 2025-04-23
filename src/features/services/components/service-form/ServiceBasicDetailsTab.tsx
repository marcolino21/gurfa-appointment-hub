
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { ServiceFormValues } from '../../types';
import { ServiceCategory } from '@/types';
import { ServiceNameField } from './fields/ServiceNameField';
import { ServiceCategoryField } from './fields/ServiceCategoryField';
import { ServiceColorField } from './fields/ServiceColorField';
import { ServiceTimingFields } from './fields/ServiceTimingFields';
import { ServicePriceField } from './fields/ServicePriceField';
import { ServiceDescriptionField } from './fields/ServiceDescriptionField';

interface ServiceBasicDetailsTabProps {
  serviceForm: UseFormReturn<ServiceFormValues>;
  categories: ServiceCategory[];
  useCustomCategory: boolean;
  setUseCustomCategory: (value: boolean) => void;
}

export const ServiceBasicDetailsTab: React.FC<ServiceBasicDetailsTabProps> = ({
  serviceForm,
  categories,
  useCustomCategory,
  setUseCustomCategory,
}) => {
  return (
    <div className="space-y-4">
      <ServiceNameField serviceForm={serviceForm} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ServiceCategoryField
          serviceForm={serviceForm}
          categories={categories}
          useCustomCategory={useCustomCategory}
          setUseCustomCategory={setUseCustomCategory}
        />
        <ServiceColorField serviceForm={serviceForm} />
      </div>

      <ServiceDescriptionField serviceForm={serviceForm} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <ServiceTimingFields serviceForm={serviceForm} />
        <ServicePriceField serviceForm={serviceForm} />
      </div>
    </div>
  );
};
