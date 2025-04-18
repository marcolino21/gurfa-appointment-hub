
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { CreditCard } from "lucide-react";

interface PaymentMethodSelectorProps {
  onSelect: (method: 'credit-card') => void;
}

const PaymentMethodSelector = ({ onSelect }: PaymentMethodSelectorProps) => {
  return (
    <div className="grid grid-cols-1 gap-4">
      <Card className="cursor-pointer hover:border-primary transition-colors" onClick={() => onSelect('credit-card')}>
        <CardContent className="flex flex-col items-center justify-center p-6">
          <CreditCard className="h-12 w-12 mb-4 text-primary" />
          <h3 className="text-lg font-medium">Carta di Credito</h3>
          <p className="text-sm text-muted-foreground">Aggiungi una nuova carta</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentMethodSelector;
