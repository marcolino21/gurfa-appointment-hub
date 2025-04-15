
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { UseFormReturn } from 'react-hook-form';
import { ProductFormValues } from '../../schemas/productSchema';

interface ProductDetailsFieldsProps {
  form: UseFormReturn<ProductFormValues>;
}

export const ProductDetailsFields: React.FC<ProductDetailsFieldsProps> = ({ form }) => {
  return (
    <FormField
      control={form.control}
      name="description"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Descrizione</FormLabel>
          <FormControl>
            <Textarea {...field} rows={3} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
