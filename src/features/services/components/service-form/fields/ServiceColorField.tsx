
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { ServiceFormValues } from '../../../types';

interface ServiceColorFieldProps {
  serviceForm: UseFormReturn<ServiceFormValues>;
}

export const ServiceColorField: React.FC<ServiceColorFieldProps> = ({ serviceForm }) => {
  return (
    <FormField
      control={serviceForm.control}
      name="color"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Colore</FormLabel>
          <FormControl>
            <div className="flex gap-2">
              <Input {...field} type="color" className="w-12 h-10 p-1" />
              <Input {...field} placeholder="Codice colore" className="flex-1" />
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
