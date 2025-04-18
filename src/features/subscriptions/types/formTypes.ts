
import { Subscription, Client, Service } from '@/types';
import { z } from 'zod';
import { subscriptionSchema } from '../schemas/subscriptionFormSchema';

export interface SubscriptionFormProps {
  clients: Client[];
  services: Service[];
  selectedSubscription: Subscription | null;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onSubmit: (data: SubscriptionFormValues) => void;
}

export type SubscriptionFormValues = z.infer<typeof subscriptionSchema>;
