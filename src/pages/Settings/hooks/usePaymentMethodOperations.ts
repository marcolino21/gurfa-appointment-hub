
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

export interface PaymentMethod {
  id?: string;
  card_type: string;
  last_four: string;
  holder_name: string;
  expiry_month: number;
  expiry_year: number;
}

export const usePaymentMethodOperations = () => {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { currentSalonId } = useAuth();

  const fetchPaymentMethods = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('payment_methods')
        .select('*')
        .eq('salon_id', currentSalonId || '');

      if (error) throw error;

      setPaymentMethods(data || []);
    } catch (error) {
      console.error('Error fetching payment methods:', error);
      toast({
        variant: 'destructive',
        title: 'Errore',
        description: 'Impossibile caricare i metodi di pagamento.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addPaymentMethod = async (paymentMethod: Omit<PaymentMethod, 'id'>) => {
    if (!currentSalonId) return;

    try {
      const { data, error } = await supabase
        .from('payment_methods')
        .insert({
          ...paymentMethod,
          salon_id: currentSalonId
        })
        .select()
        .single();

      if (error) throw error;

      setPaymentMethods(prev => [...prev, data]);
      toast({
        title: 'Metodo di pagamento aggiunto',
        description: 'Il metodo di pagamento è stato salvato con successo.',
      });
    } catch (error) {
      console.error('Error adding payment method:', error);
      toast({
        variant: 'destructive',
        title: 'Errore',
        description: 'Impossibile aggiungere il metodo di pagamento.',
      });
    }
  };

  const removePaymentMethod = async (paymentMethodId: string) => {
    try {
      const { error } = await supabase
        .from('payment_methods')
        .delete()
        .eq('id', paymentMethodId);

      if (error) throw error;

      setPaymentMethods(prev => prev.filter(method => method.id !== paymentMethodId));
      toast({
        title: 'Metodo di pagamento rimosso',
        description: 'Il metodo di pagamento è stato eliminato con successo.',
      });
    } catch (error) {
      console.error('Error removing payment method:', error);
      toast({
        variant: 'destructive',
        title: 'Errore',
        description: 'Impossibile rimuovere il metodo di pagamento.',
      });
    }
  };

  return {
    paymentMethods,
    isLoading,
    fetchPaymentMethods,
    addPaymentMethod,
    removePaymentMethod
  };
};
