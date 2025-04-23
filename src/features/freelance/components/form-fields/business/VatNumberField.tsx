
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { FreelanceFormData } from '../../../types';

interface VatNumberFieldProps {
  form: UseFormReturn<FreelanceFormData>;
}

export const VatNumberField: React.FC<VatNumberFieldProps> = ({ form }) => {
  return (
    <FormField
      control={form.control}
      name="vat_number"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Partita IVA</FormLabel>
          <FormControl>
            <Input placeholder="Partita IVA" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
