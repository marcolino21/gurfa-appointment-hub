
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormDescription } from '@/components/ui/form';
import { Switch } from '@/components/ui/switch';
import { UseFormReturn } from 'react-hook-form';
import { StaffFormValues } from '../../types';

interface SettingsTabProps {
  form: UseFormReturn<StaffFormValues>;
}

const SettingsTab: React.FC<SettingsTabProps> = ({ form }) => {
  return (
    <div className="grid gap-4">
      <FormField
        control={form.control}
        name="isActive"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between">
            <div className="space-y-0.5">
              <FormLabel>Stato</FormLabel>
              <FormDescription>
                Indica se il membro dello staff è attivo
              </FormDescription>
            </div>
            <FormControl>
              <Switch
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="showInCalendar"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between">
            <div className="space-y-0.5">
              <FormLabel>Mostra in agenda</FormLabel>
              <FormDescription>
                Visualizza questo membro dello staff nell'agenda degli appuntamenti
              </FormDescription>
            </div>
            <FormControl>
              <Switch
                checked={field.value}
                onCheckedChange={(checked) => {
                  console.log("Switch showInCalendar changed to:", checked);
                  field.onChange(checked);
                }}
              />
            </FormControl>
          </FormItem>
        )}
      />
    </div>
  );
};

export default SettingsTab;
