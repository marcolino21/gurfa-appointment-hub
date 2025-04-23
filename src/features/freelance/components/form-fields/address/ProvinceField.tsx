
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { FreelanceFormData } from '../../../types';

interface ProvinceFieldProps {
  form: UseFormReturn<FreelanceFormData>;
}

export const ProvinceField: React.FC<ProvinceFieldProps> = ({ form }) => {
  return (
    <FormField
      control={form.control}
      name="province"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Provincia</FormLabel>
          <FormControl>
            <Input placeholder="Provincia" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
