
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { FreelanceFormData } from '../../../types';

interface CityFieldProps {
  form: UseFormReturn<FreelanceFormData>;
}

export const CityField: React.FC<CityFieldProps> = ({ form }) => {
  return (
    <FormField
      control={form.control}
      name="city"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Città</FormLabel>
          <FormControl>
            <Input placeholder="Città" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
