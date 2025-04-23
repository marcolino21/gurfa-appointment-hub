
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ProjectFormValues } from '@/types';

interface ProjectStatusProps {
  form: UseFormReturn<ProjectFormValues>;
}

export const ProjectStatus: React.FC<ProjectStatusProps> = ({ form }) => {
  return (
    <FormField
      control={form.control}
      name="status"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Stato</FormLabel>
          <Select
            value={field.value}
            onValueChange={field.onChange}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Seleziona stato" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectItem value="planning">In Pianificazione</SelectItem>
              <SelectItem value="in_progress">In Corso</SelectItem>
              <SelectItem value="completed">Completato</SelectItem>
              <SelectItem value="cancelled">Annullato</SelectItem>
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
