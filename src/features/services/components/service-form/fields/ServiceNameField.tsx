
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { ServiceFormValues } from '../../../types';

interface ServiceNameFieldProps {
  serviceForm: UseFormReturn<ServiceFormValues>;
}

export const ServiceNameField: React.FC<ServiceNameFieldProps> = ({ serviceForm }) => {
  return (
    <FormField
      control={serviceForm.control}
      name="name"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Nome del servizio</FormLabel>
          <FormControl>
            <Input {...field} placeholder="Es. Taglio capelli uomo" />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
