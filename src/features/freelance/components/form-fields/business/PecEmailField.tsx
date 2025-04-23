
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { FreelanceFormData } from '../../../types';

interface PecEmailFieldProps {
  form: UseFormReturn<FreelanceFormData>;
}

export const PecEmailField: React.FC<PecEmailFieldProps> = ({ form }) => {
  return (
    <FormField
      control={form.control}
      name="pec_email"
      render={({ field }) => (
        <FormItem>
          <FormLabel>PEC</FormLabel>
          <FormControl>
            <Input type="email" placeholder="PEC" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
