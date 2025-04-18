
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { SubscriptionFormValues } from '../../types/formTypes';
import { PriceFields } from './options/PriceFields';
import { RecurrenceFields } from './options/RecurrenceFields';
import { DurationFields } from './options/DurationFields';
import { OnlineSettingsFields } from './options/OnlineSettingsFields';

interface OptionsTabProps {
  form: UseFormReturn<SubscriptionFormValues>;
}

export const OptionsTab: React.FC<OptionsTabProps> = ({ form }) => {
  return (
    <div className="space-y-4">
      <PriceFields form={form} />
      <RecurrenceFields form={form} />
      <DurationFields form={form} />
      <OnlineSettingsFields form={form} />

      <FormField
        control={form.control}
        name="startDate"
        render={({ field }) => (
          <FormItem className="flex flex-col">
            <FormLabel>Data di Inizio</FormLabel>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full pl-3 text-left font-normal",
                    !field.value && "text-muted-foreground"
                  )}
                >
                  {field.value ? (
                    format(new Date(field.value), "dd/MM/yyyy")
                  ) : (
                    <span>Seleziona una data</span>
                  )}
                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={field.value ? new Date(field.value) : undefined}
                  onSelect={(date) => field.onChange(date ? format(date, 'yyyy-MM-dd') : '')}
                  locale={it}
                />
              </PopoverContent>
            </Popover>
          </FormItem>
        )}
      />
    </div>
  );
};
