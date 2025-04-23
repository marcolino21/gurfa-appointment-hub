
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { ProjectFormValues } from '@/types';

interface ProjectObjectivesProps {
  form: UseFormReturn<ProjectFormValues>;
}

export const ProjectObjectives: React.FC<ProjectObjectivesProps> = ({ form }) => {
  const addObjective = () => {
    const objectives = form.getValues('objectives') || [];
    form.setValue('objectives', [...objectives, { description: '', isCompleted: false }]);
  };

  const removeObjective = (index: number) => {
    const objectives = form.getValues('objectives');
    form.setValue('objectives', objectives.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-2">
      <FormLabel>Obiettivi</FormLabel>
      {form.watch('objectives')?.map((_, index) => (
        <div key={index} className="flex gap-2 items-start">
          <FormField
            control={form.control}
            name={`objectives.${index}.isCompleted`}
            render={({ field }) => (
              <FormItem className="flex items-center space-x-2 space-y-0 mt-2">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name={`objectives.${index}.description`}
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormControl>
                  <Input placeholder="Descrizione obiettivo" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => removeObjective(index)}
            disabled={form.watch('objectives').length <= 1}
          >
            ✕
          </Button>
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={addObjective}
      >
        Aggiungi obiettivo
      </Button>
    </div>
  );
};
