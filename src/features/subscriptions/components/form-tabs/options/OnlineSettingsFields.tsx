
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { SubscriptionFormValues } from '../../../types/formTypes';

interface OnlineSettingsFieldsProps {
  form: UseFormReturn<SubscriptionFormValues>;
}

export const OnlineSettingsFields: React.FC<OnlineSettingsFieldsProps> = ({ form }) => {
  const watchGeolocationEnabled = form.watch('geolocationEnabled');

  return (
    <>
      <FormField
        control={form.control}
        name="sellOnline"
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
                Vendi online
              </FormLabel>
            </div>
          </FormItem>
        )}
      />

      <Collapsible className="space-y-2">
        <div className="flex items-center justify-between">
          <FormField
            control={form.control}
            name="geolocationEnabled"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>
                    Abilita geolocalizzazione
                  </FormLabel>
                </div>
              </FormItem>
            )}
          />
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm" disabled={!watchGeolocationEnabled}>
              {watchGeolocationEnabled ? 'Configura' : 'Configurazione disabilitata'}
            </Button>
          </CollapsibleTrigger>
        </div>
        <CollapsibleContent className="space-y-4">
          <FormField
            control={form.control}
            name="geolocationRadius"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Raggio di visibilità (km)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    min={1}
                    disabled={!watchGeolocationEnabled}
                    placeholder="Raggio in km" 
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value) || 10)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </CollapsibleContent>
      </Collapsible>
    </>
  );
};
