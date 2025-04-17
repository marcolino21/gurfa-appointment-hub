
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CreditCard } from "lucide-react";

interface PaymentMethodSelectorProps {
  onSelect: (method: 'credit-card' | 'paypal' | 'apple-pay') => void;
}

const PaymentMethodSelector = ({ onSelect }: PaymentMethodSelectorProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className="cursor-pointer hover:border-primary transition-colors" onClick={() => onSelect('credit-card')}>
        <CardContent className="flex flex-col items-center justify-center p-6">
          <CreditCard className="h-12 w-12 mb-4 text-primary" />
          <h3 className="text-lg font-medium">Carta di Credito</h3>
          <p className="text-sm text-muted-foreground">Aggiungi una nuova carta</p>
        </CardContent>
      </Card>

      <Card className="cursor-pointer hover:border-primary transition-colors" onClick={() => onSelect('apple-pay')}>
        <CardContent className="flex flex-col items-center justify-center p-6">
          <img 
            src="/lovable-uploads/f347c32f-9a84-4f00-9cdc-4ebb9ea968e8.png" 
            alt="Apple Pay" 
            className="h-12 w-auto mb-4"
          />
          <h3 className="text-lg font-medium">Apple Pay</h3>
          <p className="text-sm text-muted-foreground">Paga con Apple Pay</p>
        </CardContent>
      </Card>

      <Card className="cursor-pointer hover:border-primary transition-colors" onClick={() => onSelect('paypal')}>
        <CardContent className="flex flex-col items-center justify-center p-6">
          <img 
            src="/lovable-uploads/d7cbd579-3a83-4b2c-9db8-76e025b56650.png" 
            alt="PayPal" 
            className="h-12 w-auto mb-4"
          />
          <h3 className="text-lg font-medium">PayPal</h3>
          <p className="text-sm text-muted-foreground">Collega il tuo account PayPal</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentMethodSelector;

