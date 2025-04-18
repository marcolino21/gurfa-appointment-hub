
import { Subscription } from '@/types';
import { z } from 'zod';

export interface SubscriptionFormProps {
  clients: Client[];
  services: Service[];
  selectedSubscription: Subscription | null;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onSubmit: (data: SubscriptionFormValues) => void;
}

export type SubscriptionFormValues = z.infer<typeof subscriptionSchema>;
