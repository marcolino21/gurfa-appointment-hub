
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Euro } from 'lucide-react';
import { ServiceFormValues } from '../../../types';

interface ServicePriceFieldProps {
  serviceForm: UseFormReturn<ServiceFormValues>;
}

export const ServicePriceField: React.FC<ServicePriceFieldProps> = ({ serviceForm }) => {
  return (
    <FormField
      control={serviceForm.control}
      name="price"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Prezzo</FormLabel>
          <FormControl>
            <div className="relative">
              <Euro className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="number"
                step="0.01"
                value={field.value}
                onChange={(e) => field.onChange(parseFloat(e.target.value))}
                className="pl-8"
                placeholder="0.00"
              />
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
