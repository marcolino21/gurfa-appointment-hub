
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { CreditCardForm } from '../CreditCardForm';
import { SubscriptionFormValues } from '../../types/formTypes';

interface PaymentTabProps {
  form: UseFormReturn<SubscriptionFormValues>;
  onCreditCardSubmit: (data: any) => void;
}

export const PaymentTab: React.FC<PaymentTabProps> = ({ form, onCreditCardSubmit }) => {
  return (
    <div className="space-y-4">
      <div className="text-sm text-muted-foreground mb-4">
        Inserire i dettagli della carta di credito per l'abbonamento
      </div>
      
      <CreditCardForm 
        onSubmit={onCreditCardSubmit}
      />
    </div>
  );
};
