
import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';

const creditCardSchema = z.object({
  holderName: z.string().min(2, { message: "Nome del titolare è obbligatorio" }),
  cardNumber: z.string()
    .refine(val => /^\d{16}$/.test(val.replace(/\s/g, '')), { 
      message: "Numero di carta non valido" 
    }),
  expiryMonth: z.string()
    .refine(val => /^\d{2}$/.test(val) && parseInt(val) >= 1 && parseInt(val) <= 12, {
      message: "Mese di scadenza non valido"
    }),
  expiryYear: z.string()
    .refine(val => /^\d{4}$/.test(val) && parseInt(val) >= new Date().getFullYear(), {
      message: "Anno di scadenza non valido"
    }),
  cvv: z.string()
    .refine(val => /^\d{3,4}$/.test(val), { 
      message: "CVV non valido" 
    })
});

type CreditCardFormValues = z.infer<typeof creditCardSchema>;

interface CreditCardFormProps {
  onSubmit: (data: CreditCardFormValues) => void;
  onCancel?: () => void;
}

export const CreditCardForm: React.FC<CreditCardFormProps> = ({ onSubmit, onCancel }) => {
  const form = useForm<CreditCardFormValues>({
    resolver: zodResolver(creditCardSchema),
    defaultValues: {
      holderName: '',
      cardNumber: '',
      expiryMonth: '',
      expiryYear: '',
      cvv: ''
    }
  });

  const handleSubmit = (data: CreditCardFormValues) => {
    onSubmit(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="holderName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome del Titolare</FormLabel>
              <FormControl>
                <Input placeholder="Nome e Cognome" {...field} />
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
              <FormLabel>Numero Carta</FormLabel>
              <FormControl>
                <Input placeholder="1234 5678 9012 3456" {...field} />
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
                <FormLabel>Mese Scadenza</FormLabel>
                <FormControl>
                  <Input placeholder="MM" maxLength={2} {...field} />
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
                <FormLabel>Anno Scadenza</FormLabel>
                <FormControl>
                  <Input placeholder="AAAA" maxLength={4} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="cvv"
            render={({ field }) => (
              <FormItem>
                <FormLabel>CVV</FormLabel>
                <FormControl>
                  <Input placeholder="123" maxLength={4} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end space-x-2">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Annulla
            </Button>
          )}
          <Button type="submit">Salva Carta</Button>
        </div>
      </form>
    </Form>
  );
};
