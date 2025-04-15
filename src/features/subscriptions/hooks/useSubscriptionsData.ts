
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { MOCK_CLIENTS, MOCK_SERVICES, MOCK_SUBSCRIPTIONS } from '@/data/mockData';
import { Subscription, Client, Service } from '@/types';
import { SubscriptionFormValues } from '../types';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

export const useSubscriptionsData = () => {
  const { currentSalonId } = useAuth();
  const [subscriptions, setSubscriptions] = useState<Subscription[]>(
    currentSalonId ? MOCK_SUBSCRIPTIONS[currentSalonId] || [] : []
  );
  const [clients, setClients] = useState<Client[]>(
    currentSalonId ? MOCK_CLIENTS[currentSalonId] || [] : []
  );
  const [services, setServices] = useState<Service[]>(
    currentSalonId ? MOCK_SERVICES[currentSalonId] || [] : []
  );
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedSubscription, setSelectedSubscription] = useState<Subscription | null>(null);
  const [activeTab, setActiveTab] = useState('dettagli');
  const { toast } = useToast();

  const filteredSubscriptions = subscriptions.filter(subscription => {
    return subscription.name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const getClientName = (clientId: string) => {
    const client = clients.find(client => client.id === clientId);
    return client ? `${client.firstName} ${client.lastName}` : '';
  };

  const getServiceName = (serviceId: string) => {
    const service = services.find(service => service.id === serviceId);
    return service ? service.name : '';
  };

  const handleAddSubscription = (data: SubscriptionFormValues) => {
    if (!currentSalonId) return;

    const newSubscription: Subscription = {
      id: `sub-${Math.random().toString(36).substr(2, 9)}`,
      name: data.name,
      type: data.type,
      serviceIds: data.serviceIds || [],
      includeAllServices: data.includeAllServices || false,
      entriesPerMonth: data.entriesPerMonth,
      price: data.price,
      discount: data.discount,
      clientId: data.clientId,
      paymentMethod: data.paymentMethod,
      recurrenceType: data.recurrenceType,
      cancellableImmediately: data.cancellableImmediately || false,
      minDuration: data.minDuration,
      maxDuration: data.maxDuration,
      sellOnline: data.sellOnline || false,
      geolocationEnabled: data.geolocationEnabled || false,
      geolocationRadius: data.geolocationRadius,
      startDate: data.startDate,
      endDate: data.endDate,
      status: data.status || 'active',
      salonId: currentSalonId,
      createdAt: format(new Date(), 'yyyy-MM-dd'),
    };

    setSubscriptions([...subscriptions, newSubscription]);
    toast({
      title: 'Abbonamento aggiunto',
      description: `${newSubscription.name} è stato aggiunto con successo`,
    });
    setIsAddDialogOpen(false);
  };

  const handleEditSubscription = (data: SubscriptionFormValues) => {
    if (!selectedSubscription) return;

    const updatedSubscriptions = subscriptions.map(subscription => 
      subscription.id === selectedSubscription.id ? { 
        ...subscription,
        name: data.name,
        type: data.type,
        serviceIds: data.serviceIds || [],
        includeAllServices: data.includeAllServices || false,
        entriesPerMonth: data.entriesPerMonth,
        price: data.price,
        discount: data.discount,
        clientId: data.clientId,
        paymentMethod: data.paymentMethod,
        recurrenceType: data.recurrenceType,
        cancellableImmediately: data.cancellableImmediately || false,
        minDuration: data.minDuration,
        maxDuration: data.maxDuration,
        sellOnline: data.sellOnline || false,
        geolocationEnabled: data.geolocationEnabled || false,
        geolocationRadius: data.geolocationRadius,
        startDate: data.startDate,
        endDate: data.endDate,
        status: data.status || 'active',
      } : subscription
    );

    setSubscriptions(updatedSubscriptions);
    toast({
      title: 'Abbonamento modificato',
      description: `${data.name} è stato modificato con successo`,
    });
    setIsEditDialogOpen(false);
  };

  const handleDeleteSubscription = (subscriptionId: string) => {
    const updatedSubscriptions = subscriptions.filter(subscription => subscription.id !== subscriptionId);
    setSubscriptions(updatedSubscriptions);
    toast({
      title: 'Abbonamento eliminato',
      description: 'L\'abbonamento è stato eliminato con successo',
    });
  };

  return {
    subscriptions,
    clients,
    services,
    filteredSubscriptions,
    searchTerm,
    setSearchTerm,
    isAddDialogOpen,
    setIsAddDialogOpen,
    isEditDialogOpen,
    setIsEditDialogOpen,
    selectedSubscription,
    setSelectedSubscription,
    activeTab,
    setActiveTab,
    getClientName,
    getServiceName,
    handleAddSubscription,
    handleEditSubscription,
    handleDeleteSubscription
  };
};
