
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { useClientsData } from '@/features/clients/hooks/useClientsData';
import { clientSchema, ClientFormValues } from '@/features/clients/types';
import ClientsContent from '@/features/clients/components/ClientsContent';
import AddClientDialog from '@/features/clients/components/AddClientDialog';
import EditClientDialog from '@/features/clients/components/EditClientDialog';

const Clients = () => {
  const navigate = useNavigate();
  const {
    filteredClients,
    searchTerm,
    setSearchTerm,
    selectedClient,
    setSelectedClient,
    handleAddClient,
    handleEditClient,
    handleDeleteClient,
  } = useClientsData();

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('dati-personali');

  const clientForm = useForm<ClientFormValues>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      phone: '',
      email: '',
      gender: 'F',
      address: '',
      city: '',
      zipCode: '',
      dateOfBirth: '',
      fiscalCode: '',
      loyaltyCode: '',
      notes: '',
      isPrivate: true,
      companyName: '',
      vatNumber: '',
      sdiCode: '',
      pecEmail: '',
    }
  });

  const openAddDialog = () => {
    setSelectedClient(null);
    clientForm.reset({
      firstName: '',
      lastName: '',
      phone: '',
      email: '',
      gender: 'F',
      address: '',
      city: '',
      zipCode: '',
      dateOfBirth: '',
      fiscalCode: '',
      loyaltyCode: '',
      notes: '',
      isPrivate: true,
      companyName: '',
      vatNumber: '',
      sdiCode: '',
      pecEmail: '',
    });
    setActiveTab('dati-personali');
    setIsAddDialogOpen(true);
  };

  const openEditDialog = (client: any) => {
    setSelectedClient(client);
    clientForm.reset({
      firstName: client.firstName,
      lastName: client.lastName,
      phone: client.phone || '',
      email: client.email || '',
      gender: client.gender,
      address: client.address || '',
      city: client.city || '',
      zipCode: client.zipCode || '',
      dateOfBirth: client.dateOfBirth || '',
      fiscalCode: client.fiscalCode || '',
      loyaltyCode: client.loyaltyCode || '',
      notes: client.notes || '',
      isPrivate: client.isPrivate,
      companyName: client.companyName || '',
      vatNumber: client.vatNumber || '',
      sdiCode: client.sdiCode || '',
      pecEmail: client.pecEmail || '',
    });
    setActiveTab('dati-personali');
    setIsEditDialogOpen(true);
  };
  
  const handleAddClientSubmit = (data: ClientFormValues, createProject?: boolean) => {
    const newClient = handleAddClient(data);
    setIsAddDialogOpen(false);
    clientForm.reset();
    
    if (createProject && newClient) {
      navigate(`/progetti/nuovo?clientId=${newClient.id}`);
    }
  };

  return (
    <div className="container mx-auto py-6">
      <ClientsContent
        filteredClients={filteredClients}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        openAddDialog={openAddDialog}
        onEditClient={openEditDialog}
        onDeleteClient={handleDeleteClient}
      />

      <AddClientDialog
        isOpen={isAddDialogOpen}
        setIsOpen={setIsAddDialogOpen}
        clientForm={clientForm}
        onSubmit={handleAddClientSubmit}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      <EditClientDialog
        isOpen={isEditDialogOpen}
        setIsOpen={setIsEditDialogOpen}
        clientForm={clientForm}
        onSubmit={(data) => {
          handleEditClient(data);
          setIsEditDialogOpen(false);
        }}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        selectedClient={selectedClient}
      />
    </div>
  );
};

export default Clients;
