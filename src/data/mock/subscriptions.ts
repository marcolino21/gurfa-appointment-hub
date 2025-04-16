
import { Subscription } from '@/types';

export const MOCK_SUBSCRIPTIONS: Record<string, Subscription[]> = {
  'salon-01': [
    {
      id: 'sub-01',
      name: 'Premium Mensile',
      type: 'services',
      serviceIds: ['service-01', 'service-02'],
      includeAllServices: false,
      price: 59.99,
      discount: 10,
      clientId: 'client-01',
      paymentMethod: 'credit_card',
      recurrenceType: 'monthly',
      cancellableImmediately: true,
      minDuration: 3,
      sellOnline: true,
      geolocationEnabled: true,
      geolocationRadius: 10,
      startDate: '2025-04-01',
      status: 'active',
      salonId: 'salon-01',
      createdAt: '2025-03-25'
    },
    {
      id: 'sub-02',
      name: 'Ingressi Standard',
      type: 'entries',
      serviceIds: [],
      includeAllServices: true,
      entriesPerMonth: 2,
      price: 39.99,
      clientId: 'client-02',
      paymentMethod: 'paypal',
      recurrenceType: 'monthly',
      cancellableImmediately: false,
      minDuration: 6,
      maxDuration: 12,
      sellOnline: false,
      geolocationEnabled: false,
      startDate: '2025-02-15',
      status: 'active',
      salonId: 'salon-01',
      createdAt: '2025-02-10'
    }
  ]
};
