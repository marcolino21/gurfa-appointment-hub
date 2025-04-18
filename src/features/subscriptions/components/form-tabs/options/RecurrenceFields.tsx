
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { SubscriptionFormValues } from '../../../types/formTypes';

interface RecurrenceFieldsProps {
  form: UseFormReturn<SubscriptionFormValues>;
}

export const RecurrenceFields: React.FC<RecurrenceFieldsProps> = ({ form }) => {
  return (
    <>
      <FormField
        control={form.control}
        name="recurrenceType"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Tipo di ricorrenza</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Seleziona la ricorrenza" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="monthly">Mensile</SelectItem>
                <SelectItem value="quarterly">Trimestrale</SelectItem>
                <SelectItem value="annually">Annuale</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="cancellableImmediately"
        render={({ field }) => (
          <FormItem className="flex flex-row items-start space-x-3 space-y-0 py-2">
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
            <div className="space-y-1 leading-none">
              <FormLabel>
                Disdetta immediata
              </FormLabel>
            </div>
          </FormItem>
        )}
      />
    </>
  );
};
