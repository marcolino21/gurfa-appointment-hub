
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { ProjectFormValues } from '@/types';

interface ProjectTitleProps {
  form: UseFormReturn<ProjectFormValues>;
}

export const ProjectTitle: React.FC<ProjectTitleProps> = ({ form }) => {
  return (
    <FormField
      control={form.control}
      name="title"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Titolo</FormLabel>
          <FormControl>
            <Input placeholder="Titolo del progetto" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
