
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { FreelanceFormData } from '../../../types';

interface PostalCodeFieldProps {
  form: UseFormReturn<FreelanceFormData>;
}

export const PostalCodeField: React.FC<PostalCodeFieldProps> = ({ form }) => {
  return (
    <FormField
      control={form.control}
      name="postal_code"
      render={({ field }) => (
        <FormItem>
          <FormLabel>CAP</FormLabel>
          <FormControl>
            <Input placeholder="CAP" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
