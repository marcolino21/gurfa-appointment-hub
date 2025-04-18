
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { SubscriptionFormValues } from '../../../types/formTypes';

interface PriceFieldsProps {
  form: UseFormReturn<SubscriptionFormValues>;
}

export const PriceFields: React.FC<PriceFieldsProps> = ({ form }) => {
  return (
    <>
      <FormField
        control={form.control}
        name="price"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Prezzo (€)</FormLabel>
            <FormControl>
              <Input 
                type="number" 
                min={0} 
                step={0.01} 
                placeholder="Inserisci prezzo" 
                {...field}
                onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="discount"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Sconto (%)</FormLabel>
            <FormControl>
              <Input 
                type="number" 
                min={0} 
                max={100} 
                placeholder="Inserisci sconto" 
                {...field}
                onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};
