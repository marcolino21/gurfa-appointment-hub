
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { MOCK_CLIENTS } from '@/data/mock/clients';
import { Client } from '@/types';
import { ClientFormValues } from '../types';
import { v4 as uuidv4 } from 'uuid';

export const useClientsData = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [filteredClients, setFilteredClients] = useState<Client[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const { currentSalonId } = useAuth();
  const { toast } = useToast();

  // Carica i clienti quando cambia il salone
  useEffect(() => {
    if (currentSalonId) {
      const salonClients = MOCK_CLIENTS[currentSalonId] || [];
      setClients(salonClients);
      setFilteredClients(salonClients);
    }
  }, [currentSalonId]);

  // Filtra i clienti in base al termine di ricerca
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredClients(clients);
      return;
    }

    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    const filtered = clients.filter(client => {
      const fullName = `${client.firstName} ${client.lastName}`.toLowerCase();
      return fullName.includes(lowerCaseSearchTerm) || 
             (client.phone && client.phone.includes(lowerCaseSearchTerm)) ||
             (client.email && client.email.toLowerCase().includes(lowerCaseSearchTerm));
    });
    
    setFilteredClients(filtered);
  }, [clients, searchTerm]);

  const handleAddClient = (data: ClientFormValues) => {
    if (!currentSalonId) return null;
    
    const newClient: Client = {
      id: uuidv4(),
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone,
      email: data.email,
      gender: data.gender as 'M' | 'F' | 'O',
      salonId: currentSalonId,
      address: data.address,
      city: data.city,
      zipCode: data.zipCode,
      dateOfBirth: data.dateOfBirth,
      fiscalCode: data.fiscalCode,
      loyaltyCode: data.loyaltyCode,
      notes: data.notes,
      isPrivate: data.isPrivate,
      companyName: data.companyName,
      vatNumber: data.vatNumber,
      sdiCode: data.sdiCode,
      pecEmail: data.pecEmail
    };
    
    // Aggiorna lo stato locale
    const updatedClients = [...clients, newClient];
    setClients(updatedClients);
    setFilteredClients(updatedClients);
    
    // Aggiorna anche i MOCK_CLIENTS per mantenere la coerenza dei dati
    if (!MOCK_CLIENTS[currentSalonId]) {
      MOCK_CLIENTS[currentSalonId] = [];
    }
    MOCK_CLIENTS[currentSalonId].push(newClient);

    toast({
      title: "Cliente aggiunto",
      description: `${newClient.firstName} ${newClient.lastName} è stato aggiunto con successo.`,
    });
    
    return newClient;
  };

  const handleEditClient = (data: ClientFormValues) => {
    if (!selectedClient || !currentSalonId) return;
    
    const updatedClient: Client = {
      ...selectedClient,
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone,
      email: data.email,
      gender: data.gender as 'M' | 'F' | 'O',
      address: data.address,
      city: data.city,
      zipCode: data.zipCode,
      dateOfBirth: data.dateOfBirth,
      fiscalCode: data.fiscalCode,
      loyaltyCode: data.loyaltyCode,
      notes: data.notes,
      isPrivate: data.isPrivate,
      companyName: data.companyName,
      vatNumber: data.vatNumber,
      sdiCode: data.sdiCode,
      pecEmail: data.pecEmail
    };
    
    // Aggiorna lo stato locale
    const updatedClients = clients.map(client => 
      client.id === selectedClient.id ? updatedClient : client
    );
    setClients(updatedClients);
    setFilteredClients(updatedClients);
    
    // Aggiorna anche i MOCK_CLIENTS per mantenere la coerenza dei dati
    if (MOCK_CLIENTS[currentSalonId]) {
      MOCK_CLIENTS[currentSalonId] = MOCK_CLIENTS[currentSalonId].map(client => 
        client.id === selectedClient.id ? updatedClient : client
      );
    }

    toast({
      title: "Cliente aggiornato",
      description: `Le informazioni di ${updatedClient.firstName} ${updatedClient.lastName} sono state aggiornate.`,
    });
  };

  const handleDeleteClient = (id: string) => {
    if (!currentSalonId) return;
    
    const clientToDelete = clients.find(client => client.id === id);
    if (!clientToDelete) return;
    
    // Aggiorna lo stato locale
    const updatedClients = clients.filter(client => client.id !== id);
    setClients(updatedClients);
    setFilteredClients(updatedClients);
    
    // Aggiorna anche i MOCK_CLIENTS per mantenere la coerenza dei dati
    if (MOCK_CLIENTS[currentSalonId]) {
      MOCK_CLIENTS[currentSalonId] = MOCK_CLIENTS[currentSalonId].filter(client => client.id !== id);
    }

    toast({
      title: "Cliente eliminato",
      description: `${clientToDelete.firstName} ${clientToDelete.lastName} è stato eliminato.`,
      variant: "destructive"
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
    handleDeleteClient
  };
};
