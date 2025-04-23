
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { ProjectFormValues } from '@/types';

interface ProjectDescriptionProps {
  form: UseFormReturn<ProjectFormValues>;
}

export const ProjectDescription: React.FC<ProjectDescriptionProps> = ({ form }) => {
  return (
    <FormField
      control={form.control}
      name="description"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Descrizione</FormLabel>
          <FormControl>
            <Textarea
              placeholder="Descrizione del progetto"
              {...field}
              rows={4}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
