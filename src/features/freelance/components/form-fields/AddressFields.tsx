
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FreelanceFormData } from '../../types';
import { StreetField } from './address/StreetField';
import { CityField } from './address/CityField';
import { ProvinceField } from './address/ProvinceField';
import { PostalCodeField } from './address/PostalCodeField';

interface AddressFieldsProps {
  form: UseFormReturn<FreelanceFormData>;
}

export const AddressFields: React.FC<AddressFieldsProps> = ({ form }) => {
  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <StreetField form={form} />
        <CityField form={form} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <ProvinceField form={form} />
        <PostalCodeField form={form} />
      </div>
    </>
  );
};
