
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const paymentSchema = z.object({
  cardType: z.string().min(1, { message: 'Tipo carta obbligatorio' }),
  holderName: z.string().min(2, { message: 'Nome titolare obbligatorio' }),
  cardNumber: z.string()
    .min(16, { message: 'Numero carta non valido' })
    .max(19, { message: 'Numero carta non valido' })
    .refine((val) => /^\d+$/.test(val), { message: 'Solo numeri consentiti' }),
  expiryMonth: z.string()
    .min(1, { message: 'Mese obbligatorio' })
    .max(2, { message: 'Massimo 2 caratteri' })
    .refine((val) => /^\d+$/.test(val), { message: 'Solo numeri consentiti' })
    .refine((val) => parseInt(val) >= 1 && parseInt(val) <= 12, { message: 'Mese non valido' }),
  expiryYear: z.string()
    .min(2, { message: 'Anno obbligatorio' })
    .max(4, { message: 'Massimo 4 caratteri' })
    .refine((val) => /^\d+$/.test(val), { message: 'Solo numeri consentiti' }),
  cvc: z.string()
    .min(3, { message: 'CVC non valido' })
    .max(4, { message: 'CVC non valido' })
    .refine((val) => /^\d+$/.test(val), { message: 'Solo numeri consentiti' })
});

type PaymentFormValues = z.infer<typeof paymentSchema>;

interface FreelancePaymentFormProps {
  freelanceId: string;
  onSuccess?: () => void;
}

const FreelancePaymentForm: React.FC<FreelancePaymentFormProps> = ({ 
  freelanceId,
  onSuccess 
}) => {
  const { toast } = useToast();
  const form = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      cardType: '',
      holderName: '',
      cardNumber: '',
      expiryMonth: '',
      expiryYear: '',
      cvc: ''
    }
  });

  const onSubmit = async (data: PaymentFormValues) => {
    try {
      // Estraiamo le ultime 4 cifre della carta
      const lastFour = data.cardNumber.slice(-4);
      
      // Salviamo i dati della carta nella tabella freelancer_payment_methods
      const { error } = await supabase
        .from('freelancer_payment_methods')
        .insert({
          freelancer_id: freelanceId,
          card_type: data.cardType,
          holder_name: data.holderName,
          last_four: lastFour,
          expiry_month: parseInt(data.expiryMonth),
          expiry_year: parseInt(data.expiryYear),
          is_default: true
        });
        
      if (error) throw error;
      
      toast({
        title: 'Metodo di pagamento salvato',
        description: 'Il metodo di pagamento è stato salvato con successo.'
      });
      
      form.reset();
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Errore nel salvataggio del metodo di pagamento:', error);
      toast({
        variant: 'destructive',
        title: 'Errore',
        description: 'Impossibile salvare il metodo di pagamento.'
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Aggiungi metodo di pagamento</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="cardType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo carta</FormLabel>
                  <FormControl>
                    <Input placeholder="Visa, MasterCard, etc." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="holderName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Titolare carta</FormLabel>
                  <FormControl>
                    <Input placeholder="Nome completo del titolare" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="cardNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Numero carta</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="1234 5678 9012 3456" 
                      {...field} 
                      maxLength={19}
                      onChange={(e) => {
                        // Rimuovi eventuali caratteri non numerici
                        const value = e.target.value.replace(/\D/g, '');
                        field.onChange(value);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="expiryMonth"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mese</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="MM" 
                        {...field} 
                        maxLength={2}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, '');
                          field.onChange(value);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="expiryYear"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Anno</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="AAAA" 
                        {...field} 
                        maxLength={4}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, '');
                          field.onChange(value);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="cvc"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CVC</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="123" 
                        {...field} 
                        maxLength={4}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, '');
                          field.onChange(value);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <Button type="submit" className="w-full">
              Salva metodo di pagamento
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default FreelancePaymentForm;
