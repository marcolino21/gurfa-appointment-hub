
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
