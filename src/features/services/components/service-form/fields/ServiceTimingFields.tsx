
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ServiceFormValues } from '../../../types';

interface ServiceTimingFieldsProps {
  serviceForm: UseFormReturn<ServiceFormValues>;
}

export const ServiceTimingFields: React.FC<ServiceTimingFieldsProps> = ({ serviceForm }) => {
  return (
    <>
      <FormField
        control={serviceForm.control}
        name="duration"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Durata (lavorazione)</FormLabel>
            <Select
              onValueChange={(value) => field.onChange(parseInt(value))}
              defaultValue={field.value.toString()}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Seleziona durata" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="15">15 minuti</SelectItem>
                <SelectItem value="30">30 minuti</SelectItem>
                <SelectItem value="45">45 minuti</SelectItem>
                <SelectItem value="60">1 ora</SelectItem>
                <SelectItem value="90">1 ora 30 minuti</SelectItem>
                <SelectItem value="120">2 ore</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={serviceForm.control}
        name="tempoDiPosa"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Tempo di posa</FormLabel>
            <Select
              onValueChange={(value) => field.onChange(parseInt(value))}
              defaultValue={field.value.toString()}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Seleziona tempo" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="0">Nessuna posa</SelectItem>
                <SelectItem value="5">5 minuti</SelectItem>
                <SelectItem value="10">10 minuti</SelectItem>
                <SelectItem value="15">15 minuti</SelectItem>
                <SelectItem value="20">20 minuti</SelectItem>
                <SelectItem value="30">30 minuti</SelectItem>
                <SelectItem value="45">45 minuti</SelectItem>
                <SelectItem value="60">1 ora</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};
