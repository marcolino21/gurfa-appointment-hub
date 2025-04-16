
export type SubscriptionType = 'services' | 'entries';
export type PaymentMethod = 'credit_card' | 'paypal';
export type RecurrenceType = 'monthly' | 'quarterly' | 'annually';

export interface Subscription {
  id: string;
  name: string;
  type: SubscriptionType;
  serviceIds: string[];
  includeAllServices: boolean;
  entriesPerMonth?: number;
  price: number;
  discount?: number;
  clientId: string;
  paymentMethod: PaymentMethod;
  recurrenceType: RecurrenceType;
  cancellableImmediately: boolean;
  minDuration?: number; // in months
  maxDuration?: number; // in months
  sellOnline: boolean;
  geolocationRadius?: number; // in km
  geolocationEnabled: boolean;
  startDate: string;
  endDate?: string;
  status: 'active' | 'cancelled' | 'expired';
  salonId: string;
  createdAt: string;
}
