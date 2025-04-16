
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { MOCK_CLIENTS } from '@/data/mockData';
import { Client } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { ClientFormValues } from '../types';

export const useClientsData = () => {
  const { currentSalonId } = useAuth();
  const [clients, setClients] = useState<Client[]>(
    currentSalonId ? MOCK_CLIENTS[currentSalonId] || [] : []
  );
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const { toast } = useToast();

  const filteredClients = clients.filter(client => {
    const fullName = `${client.firstName} ${client.lastName}`.toLowerCase();
    const companyName = client.companyName?.toLowerCase() || '';
    return fullName.includes(searchTerm.toLowerCase()) || companyName.includes(searchTerm.toLowerCase());
  });

  const handleAddClient = (data: ClientFormValues) => {
    if (!currentSalonId) return;

    const newClient: Client = {
      id: `c${Math.random().toString(36).substr(2, 9)}`,
      firstName: data.firstName,
      lastName: data.lastName,
      gender: data.gender,
      isPrivate: data.isPrivate,
      salonId: currentSalonId,
      phone: data.phone,
      email: data.email,
      address: data.address,
      city: data.city,
      zipCode: data.zipCode,
      dateOfBirth: data.dateOfBirth,
      fiscalCode: data.fiscalCode,
      loyaltyCode: data.loyaltyCode,
      notes: data.notes,
      // Business fields
      companyName: data.companyName,
      vatNumber: data.vatNumber,
      sdiCode: data.sdiCode,
      pecEmail: data.pecEmail,
    };

    setClients([...clients, newClient]);
    toast({
      title: 'Cliente aggiunto',
      description: `${data.isPrivate ? `${newClient.firstName} ${newClient.lastName}` : newClient.companyName} è stato aggiunto con successo`,
    });
    
    return newClient;
  };

  const handleEditClient = (data: ClientFormValues) => {
    if (!selectedClient) return;

    const updatedClients = clients.map(client => 
      client.id === selectedClient.id ? { 
        ...client,
        firstName: data.firstName,
        lastName: data.lastName,
        gender: data.gender,
        isPrivate: data.isPrivate,
        phone: data.phone,
        email: data.email,
        address: data.address,
        city: data.city,
        zipCode: data.zipCode,
        dateOfBirth: data.dateOfBirth,
        fiscalCode: data.fiscalCode,
        loyaltyCode: data.loyaltyCode,
        notes: data.notes,
        // Business fields
        companyName: data.companyName,
        vatNumber: data.vatNumber,
        sdiCode: data.sdiCode,
        pecEmail: data.pecEmail,
      } : client
    );

    setClients(updatedClients);
    toast({
      title: 'Cliente modificato',
      description: `${data.isPrivate ? `${data.firstName} ${data.lastName}` : data.companyName} è stato modificato con successo`,
    });
    
    return selectedClient;
  };

  const handleDeleteClient = (clientId: string) => {
    const updatedClients = clients.filter(client => client.id !== clientId);
    setClients(updatedClients);
    toast({
      title: 'Cliente eliminato',
      description: 'Il cliente è stato eliminato con successo',
    });
  };

  return {
    clients,
    filteredClients,
    searchTerm,
    setSearchTerm,
    selectedClient,
    setSelectedClient,
    handleAddClient,
    handleEditClient,
    handleDeleteClient,
  };
};
