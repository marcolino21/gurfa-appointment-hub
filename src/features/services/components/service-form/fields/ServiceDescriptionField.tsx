
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { ServiceFormValues } from '../../../types';

interface ServiceDescriptionFieldProps {
  serviceForm: UseFormReturn<ServiceFormValues>;
}

export const ServiceDescriptionField: React.FC<ServiceDescriptionFieldProps> = ({ serviceForm }) => {
  return (
    <FormField
      control={serviceForm.control}
      name="description"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Descrizione (Facoltativo)</FormLabel>
          <FormControl>
            <textarea
              {...field}
              className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              rows={3}
              placeholder="Aggiungi una breve descrizione"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
