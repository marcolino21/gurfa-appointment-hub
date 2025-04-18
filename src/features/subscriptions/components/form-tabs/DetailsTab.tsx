
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Client, Service } from '@/types';
import { SubscriptionFormValues } from '../../types/formTypes';

interface DetailsTabProps {
  form: UseFormReturn<SubscriptionFormValues>;
  clients: Client[];
  services: Service[];
}

export const DetailsTab: React.FC<DetailsTabProps> = ({ form, clients, services }) => {
  const watchSubscriptionType = form.watch('type');
  const watchIncludeAllServices = form.watch('includeAllServices');

  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Nome Abbonamento</FormLabel>
            <FormControl>
              <Input placeholder="Inserisci nome abbonamento" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="type"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Tipo di abbonamento</FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                className="flex flex-col space-y-1"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="services" id="services" />
                  <FormLabel htmlFor="services" className="cursor-pointer">Abbonamento a Servizi</FormLabel>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="entries" id="entries" />
                  <FormLabel htmlFor="entries" className="cursor-pointer">Abbonamento a Ingressi</FormLabel>
                </div>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {watchSubscriptionType === 'entries' && (
        <>
          <FormField
            control={form.control}
            name="entriesPerMonth"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ingressi mensili</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    min={1} 
                    placeholder="Numero di ingressi mensili" 
                    {...field} 
                    onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="includeAllServices"
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
                    Accesso a tutti i servizi
                  </FormLabel>
                </div>
              </FormItem>
            )}
          />
        </>
      )}

      {!watchIncludeAllServices && (
        <FormField
          control={form.control}
          name="serviceIds"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Seleziona servizi</FormLabel>
              <div className="max-h-60 overflow-y-auto border rounded-md p-2">
                {services.map(service => (
                  <div key={service.id} className="flex items-center space-x-2 mb-2">
                    <Checkbox
                      id={`service-${service.id}`}
                      checked={field.value.includes(service.id)}
                      onCheckedChange={(checked) => {
                        return checked
                          ? field.onChange([...field.value, service.id])
                          : field.onChange(field.value.filter(id => id !== service.id));
                      }}
                    />
                    <label htmlFor={`service-${service.id}`} className="text-sm">
                      {service.name} - € {service.price.toFixed(2)}
                    </label>
                  </div>
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
      )}

      <FormField
        control={form.control}
        name="clientId"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Cliente</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Seleziona un cliente" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {clients.map(client => (
                  <SelectItem key={client.id} value={client.id}>
                    {client.firstName} {client.lastName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
