
export type PaymentMethodType = 'credit-card' | 'paypal' | 'apple-pay';

export interface PaymentMethod {
  id?: string;
  type: PaymentMethodType;
  card_type?: string;
  last_four?: string;
  holder_name?: string;
  expiry_month?: number;
  expiry_year?: number;
}

export interface CreditCardFormData {
  holder_name: string;
  card_number: string;
  cvc: string;
  expiry_month: string;
  expiry_year: string;
}
