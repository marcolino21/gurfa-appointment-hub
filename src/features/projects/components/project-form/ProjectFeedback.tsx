
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { ProjectFormValues } from '@/types';

interface ProjectFeedbackProps {
  form: UseFormReturn<ProjectFormValues>;
}

export const ProjectFeedback: React.FC<ProjectFeedbackProps> = ({ form }) => {
  return (
    <FormField
      control={form.control}
      name="feedback"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Feedback / Risultati</FormLabel>
          <FormControl>
            <Textarea
              placeholder="Feedback del cliente o risultati del progetto"
              {...field}
              rows={3}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
