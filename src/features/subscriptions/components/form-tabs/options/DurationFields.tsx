
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SubscriptionFormValues } from '../../../types/formTypes';

interface DurationFieldsProps {
  form: UseFormReturn<SubscriptionFormValues>;
}

export const DurationFields: React.FC<DurationFieldsProps> = ({ form }) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <FormField
        control={form.control}
        name="minDuration"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Durata minima (mesi)</FormLabel>
            <FormControl>
              <Input 
                type="number" 
                min={0}
                placeholder="Durata minima" 
                {...field}
                onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="maxDuration"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Durata massima (mesi)</FormLabel>
            <FormControl>
              <Select
                value={field.value?.toString() || 'forever'}
                onValueChange={(value) => {
                  if (value === 'forever') {
                    field.onChange(null);
                  } else {
                    field.onChange(parseInt(value));
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleziona durata massima" />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((months) => (
                    <SelectItem key={months} value={months.toString()}>
                      {months} {months === 1 ? 'mese' : 'mesi'}
                    </SelectItem>
                  ))}
                  <SelectItem value="forever">Per sempre</SelectItem>
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
