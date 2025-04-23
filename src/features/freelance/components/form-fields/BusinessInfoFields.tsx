
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FreelanceFormData } from '../../types';
import { VatNumberField } from './business/VatNumberField';
import { PecEmailField } from './business/PecEmailField';
import { SdiCodeField } from './business/SdiCodeField';

interface BusinessInfoFieldsProps {
  form: UseFormReturn<FreelanceFormData>;
}

export const BusinessInfoFields: React.FC<BusinessInfoFieldsProps> = ({ form }) => {
  return (
    <>
      <VatNumberField form={form} />
      <PecEmailField form={form} />
      <SdiCodeField form={form} />
    </>
  );
};
