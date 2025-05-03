import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { CalendarEvent, PaymentDetails } from '../types/appointment';
import { loadStripe } from '@stripe/stripe-js';

interface AppointmentCheckoutProps {
  appointment: CalendarEvent;
  isOpen: boolean;
  onClose: () => void;
  onComplete: (paymentDetails: PaymentDetails) => void;
}

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export const AppointmentCheckout: React.FC<AppointmentCheckoutProps> = ({
  appointment,
  isOpen,
  onClose,
  onComplete,
}) => {
  const { toast } = useToast();
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'stripe'>('cash');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleStripePayment = async () => {
    try {
      setIsProcessing(true);
      const stripe = await stripePromise;
      
      // Create payment intent
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: appointment.price * 100, // Convert to cents
          currency: 'eur',
          appointmentId: appointment.id,
        }),
      });

      const { clientSecret } = await response.json();

      // Confirm payment
      const result = await stripe?.confirmCardPayment(clientSecret);
      
      if (result?.error) {
        throw new Error(result.error.message);
      }

      const paymentDetails: PaymentDetails = {
        amount: appointment.price,
        currency: 'eur',
        paymentMethod: 'stripe',
        stripePaymentIntentId: result?.paymentIntent?.id,
        paymentStatus: 'completed',
        paymentDate: new Date(),
      };

      onComplete(paymentDetails);
      toast({
        title: 'Pagamento completato',
        description: 'Il pagamento è stato effettuato con successo.',
      });
    } catch (error) {
      toast({
        title: 'Errore',
        description: 'Si è verificato un errore durante il pagamento.',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCashPayment = () => {
    const paymentDetails: PaymentDetails = {
      amount: appointment.price,
      currency: 'eur',
      paymentMethod: 'cash',
      paymentStatus: 'completed',
      paymentDate: new Date(),
    };

    onComplete(paymentDetails);
    toast({
      title: 'Pagamento registrato',
      description: 'Il pagamento in contanti è stato registrato con successo.',
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Checkout Appuntamento</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="service" className="text-right">
              Servizio
            </Label>
            <div className="col-span-3">{appointment.serviceName}</div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="price" className="text-right">
              Prezzo
            </Label>
            <div className="col-span-3">€{appointment.price.toFixed(2)}</div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="payment" className="text-right">
              Metodo di pagamento
            </Label>
            <Select
              value={paymentMethod}
              onValueChange={(value: 'cash' | 'card' | 'stripe') => setPaymentMethod(value)}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Seleziona metodo di pagamento" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cash">Contanti</SelectItem>
                <SelectItem value="stripe">Carta di credito</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Annulla
          </Button>
          <Button
            onClick={paymentMethod === 'stripe' ? handleStripePayment : handleCashPayment}
            disabled={isProcessing}
          >
            {isProcessing ? 'Elaborazione...' : 'Completa pagamento'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}; 