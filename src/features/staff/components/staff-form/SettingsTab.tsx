
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { StaffFormValues } from '../../types';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';

interface SettingsTabProps {
  staffForm: UseFormReturn<StaffFormValues>;
}

const SettingsTab: React.FC<SettingsTabProps> = ({ staffForm }) => {
  return (
    <div className="space-y-4 mt-4">
      <FormField
        control={staffForm.control}
        name="position"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Posizione lavorativa</FormLabel>
            <FormControl>
              <Input {...field} placeholder="Es. Parrucchiere, Estetista..." />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={staffForm.control}
        name="color"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Colore calendario</FormLabel>
            <FormControl>
              <div className="flex gap-2">
                <Input 
                  {...field} 
                  type="color" 
                  className="w-12 h-10 p-1" 
                />
                <Input 
                  {...field} 
                  className="flex-1" 
                />
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={staffForm.control}
        name="isActive"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <FormLabel className="text-base">Profilo attivo</FormLabel>
              <p className="text-sm text-muted-foreground">
                {field.value 
                  ? "Il membro dello staff è attivo e può accedere al sistema" 
                  : "Il membro dello staff è disattivato e non può accedere al sistema"}
              </p>
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
        control={staffForm.control}
        name="showInCalendar"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <FormLabel className="text-base">Visibile in agenda</FormLabel>
              <p className="text-sm text-muted-foreground">
                {field.value 
                  ? "Il membro dello staff è visibile nella vista agenda" 
                  : "Il membro dello staff è nascosto nella vista agenda"}
              </p>
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
    </div>
  );
};

export default SettingsTab;
