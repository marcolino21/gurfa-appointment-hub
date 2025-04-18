
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { SubscriptionFormValues } from '../types/formTypes';

export const useSubscriptionFormSubmit = () => {
  const [isCreditCardDialogOpen, setIsCreditCardDialogOpen] = useState(true);

  const handleCreditCardSubmit = async (creditCardData: any, formValues: SubscriptionFormValues) => {
    try {
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

  return {
    isCreditCardDialogOpen,
    setIsCreditCardDialogOpen,
    handleCreditCardSubmit
  };
};
