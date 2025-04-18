
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Subscription, Client, Service } from '@/types';
import { subscriptionSchema, SubscriptionFormValues } from '../types';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { it } from 'date-fns/locale';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { CreditCardForm } from './CreditCardForm';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface SubscriptionFormProps {
  clients: Client[];
  services: Service[];
  selectedSubscription: Subscription | null;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onSubmit: (data: SubscriptionFormValues) => void;
}

export const SubscriptionForm: React.FC<SubscriptionFormProps> = ({
  clients,
  services,
  selectedSubscription,
  activeTab,
  setActiveTab,
  onSubmit,
}) => {
  const [isCreditCardDialogOpen, setIsCreditCardDialogOpen] = useState(true);

  const form = useForm<SubscriptionFormValues>({
    resolver: zodResolver(subscriptionSchema),
    defaultValues: {
      name: selectedSubscription?.name || '',
      type: selectedSubscription?.type || 'services',
      serviceIds: selectedSubscription?.serviceIds || [],
      includeAllServices: selectedSubscription?.includeAllServices || false,
      entriesPerMonth: selectedSubscription?.entriesPerMonth || 1,
      price: selectedSubscription?.price || 0,
      discount: selectedSubscription?.discount || 0,
      clientId: selectedSubscription?.clientId || '',
      paymentMethod: 'credit_card',
      recurrenceType: selectedSubscription?.recurrenceType || 'monthly',
      cancellableImmediately: selectedSubscription?.cancellableImmediately || false,
      minDuration: selectedSubscription?.minDuration || 3,
      maxDuration: selectedSubscription?.maxDuration || 12,
      sellOnline: selectedSubscription?.sellOnline || false,
      geolocationEnabled: selectedSubscription?.geolocationEnabled || false,
      geolocationRadius: selectedSubscription?.geolocationRadius || 10,
      startDate: selectedSubscription?.startDate || format(new Date(), 'yyyy-MM-dd'),
      endDate: selectedSubscription?.endDate || '',
      status: selectedSubscription?.status || 'active',
    },
  });

  const watchSubscriptionType = form.watch('type');
  const watchIncludeAllServices = form.watch('includeAllServices');
  const watchGeolocationEnabled = form.watch('geolocationEnabled');

  const handleSubmit = async (data: SubscriptionFormValues) => {
    onSubmit(data);
  };

  const handleCreditCardSubmit = async (creditCardData: any) => {
    try {
      const formValues = form.getValues();
      
      const subscriptionData = {
        name: formValues.name,
        type: formValues.type,
        service_ids: formValues.serviceIds,
        include_all_services: formValues.includeAllServices,
        entries_per_month: formValues.entriesPerMonth,
        price: formValues.price,
        discount: formValues.discount,
        client_id: formValues.clientId,
        payment_method: formValues.paymentMethod,
        recurrence_type: formValues.recurrenceType,
        cancellable_immediately: formValues.cancellableImmediately,
        min_duration: formValues.minDuration,
        max_duration: formValues.maxDuration,
        sell_online: formValues.sellOnline,
        geolocation_enabled: formValues.geolocationEnabled,
        geolocation_radius: formValues.geolocationRadius,
        start_date: formValues.startDate,
        end_date: formValues.endDate || null,
        status: formValues.status,
        salon_id: 'salon-01'
      };

      const { data: newSubscription, error: subscriptionError } = await supabase
        .from('subscriptions')
        .insert(subscriptionData)
        .select('id')
        .single();

      if (subscriptionError) throw subscriptionError;

      // Since subscription_payment_methods is not recognized in the TypeScript types,
      // we'll use a more generic approach to insert into the table
      const { error: paymentMethodError } = await supabase
        .from('payment_methods')
        .insert({
          subscription_id: newSubscription.id,
          salon_id: 'salon-01',
          holder_name: creditCardData.holderName,
          card_type: 'credit_card',
          last_four: creditCardData.cardNumber.slice(-4),
          expiry_month: parseInt(creditCardData.expiryMonth),
          expiry_year: parseInt(creditCardData.expiryYear)
        });

      if (paymentMethodError) throw paymentMethodError;

      toast.success('Abbonamento e metodo di pagamento salvati con successo');
      setIsCreditCardDialogOpen(false);
      
    } catch (error) {
      console.error('Error saving subscription and payment method:', error);
      toast.error('Errore nel salvataggio dell\'abbonamento o del metodo di pagamento');
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="dettagli">Dettagli</TabsTrigger>
            <TabsTrigger value="pagamento">Pagamento</TabsTrigger>
            <TabsTrigger value="opzioni">Opzioni Avanzate</TabsTrigger>
          </TabsList>

          <TabsContent value="dettagli" className="space-y-4 mt-4">
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

                {!watchIncludeAllServices && (
                  <FormField
                    control={form.control}
                    name="serviceIds"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Seleziona servizi disponibili per gli ingressi</FormLabel>
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
              </>
            )}

            {watchSubscriptionType === 'services' && (
              <>
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
                          Includere tutti i servizi
                        </FormLabel>
                      </div>
                    </FormItem>
                  )}
                />

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
              </>
            )}

            <FormField
              control={form.control}
              name="clientId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cliente</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
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
          </TabsContent>

          <TabsContent value="pagamento" className="space-y-4 mt-4">
            <div className="text-sm text-muted-foreground mb-4">
              Inserire i dettagli della carta di credito per l'abbonamento
            </div>
            
            <CreditCardForm 
              onSubmit={handleCreditCardSubmit}
            />
          </TabsContent>

          <TabsContent value="opzioni" className="space-y-4 mt-4">
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
          </TabsContent>
        </Tabs>

        <div className="flex justify-end pt-4 space-x-2">
          <Button type="submit">{selectedSubscription ? 'Salva modifiche' : 'Crea abbonamento'}</Button>
        </div>
      </form>
    </Form>
  );
};
