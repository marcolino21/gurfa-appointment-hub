import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SubscriptionFormValues } from '../../types/formTypes';

interface OptionsTabProps {
  form: UseFormReturn<SubscriptionFormValues>;
}

export const OptionsTab: React.FC<OptionsTabProps> = ({ form }) => {
  const watchGeolocationEnabled = form.watch('geolocationEnabled');

  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="price"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Prezzo (€)</FormLabel>
            <FormControl>
              <Input 
                type="number" 
                min={0} 
                step={0.01} 
                placeholder="Inserisci prezzo" 
                {...field}
                onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="discount"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Sconto (%)</FormLabel>
            <FormControl>
              <Input 
                type="number" 
                min={0} 
                max={100} 
                placeholder="Inserisci sconto" 
                {...field}
                onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="recurrenceType"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Tipo di ricorrenza</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Seleziona la ricorrenza" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="monthly">Mensile</SelectItem>
                <SelectItem value="quarterly">Trimestrale</SelectItem>
                <SelectItem value="annually">Annuale</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="cancellableImmediately"
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
                Disdetta immediata
              </FormLabel>
            </div>
          </FormItem>
        )}
      />

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
                <Input 
                  type="number" 
                  min={0}
                  placeholder="Durata massima" 
                  {...field}
                  onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

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

      <FormField
        control={form.control}
        name="startDate"
        render={({ field }) => (
          <FormItem className="flex flex-col">
            <FormLabel>Data di Inizio</FormLabel>
            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
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
                </FormControl>
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
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
