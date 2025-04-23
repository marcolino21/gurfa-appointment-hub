
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { FreelanceFormData } from '../../../types';

interface SdiCodeFieldProps {
  form: UseFormReturn<FreelanceFormData>;
}

export const SdiCodeField: React.FC<SdiCodeFieldProps> = ({ form }) => {
  return (
    <FormField
      control={form.control}
      name="sdi_code"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Codice SDI</FormLabel>
          <FormControl>
            <Input placeholder="Codice SDI" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
