
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { FreelanceFormData } from '../../../types';

interface StreetFieldProps {
  form: UseFormReturn<FreelanceFormData>;
}

export const StreetField: React.FC<StreetFieldProps> = ({ form }) => {
  return (
    <FormField
      control={form.control}
      name="street_address"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Indirizzo</FormLabel>
          <FormControl>
            <Input placeholder="Indirizzo" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
