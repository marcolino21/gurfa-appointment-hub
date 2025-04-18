
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Subscription, Client, Service } from '@/types';
import { DetailsTab } from './form-tabs/DetailsTab';
import { PaymentTab } from './form-tabs/PaymentTab';
import { OptionsTab } from './form-tabs/OptionsTab';
import { useSubscriptionFormSubmit } from '../hooks/useSubscriptionFormSubmit';
import { subscriptionSchema } from '../schemas/subscriptionFormSchema';
import { SubscriptionFormProps, SubscriptionFormValues } from '../types/formTypes';

export const SubscriptionForm: React.FC<SubscriptionFormProps> = ({
  clients,
  services,
  selectedSubscription,
  activeTab,
  setActiveTab,
  onSubmit,
}) => {
  const {
    handleCreditCardSubmit,
  } = useSubscriptionFormSubmit();

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

  const handleSubmit = async (data: SubscriptionFormValues) => {
    onSubmit(data);
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
            <DetailsTab form={form} clients={clients} services={services} />
          </TabsContent>

          <TabsContent value="pagamento" className="space-y-4 mt-4">
            <PaymentTab 
              form={form} 
              onCreditCardSubmit={(creditCardData) => handleCreditCardSubmit(creditCardData, form.getValues())} 
            />
          </TabsContent>

          <TabsContent value="opzioni" className="space-y-4 mt-4">
            <OptionsTab form={form} />
          </TabsContent>
        </Tabs>

        <div className="flex justify-end pt-4 space-x-2">
          <Button type="submit">
            {selectedSubscription ? 'Salva modifiche' : 'Crea abbonamento'}
          </Button>
        </div>
      </form>
    </Form>
  );
};
