
import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, Search } from 'lucide-react';

import ClientsTable from '@/features/clients/components/ClientsTable';
import ClientForm from '@/features/clients/components/ClientForm';
import { useClientsData } from '@/features/clients/hooks/useClientsData';
import { clientSchema, ClientFormValues } from '@/features/clients/types';

const Clients = () => {
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
      // Business fields
      companyName: '',
      vatNumber: '',
      sdiCode: '',
      pecEmail: '',
    }
  });

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
      // Business fields
      companyName: client.companyName || '',
      vatNumber: client.vatNumber || '',
      sdiCode: client.sdiCode || '',
      pecEmail: client.pecEmail || '',
    });
    setActiveTab('dati-personali');
    setIsEditDialogOpen(true);
  };

  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Rubrica Clienti</CardTitle>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cerca cliente..."
                className="pl-8 w-[250px]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button onClick={() => {
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
                // Business fields
                companyName: '',
                vatNumber: '',
                sdiCode: '',
                pecEmail: '',
              });
              setActiveTab('dati-personali');
              setIsAddDialogOpen(true);
            }}>
              <Plus className="h-4 w-4 mr-2" /> Aggiungi cliente
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <ClientsTable 
            clients={filteredClients}
            onEdit={openEditDialog}
            onDelete={handleDeleteClient}
          />
        </CardContent>
      </Card>

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Aggiungi nuovo cliente</DialogTitle>
            <DialogDescription>
              Inserisci i dati del nuovo cliente
            </DialogDescription>
          </DialogHeader>
          <ClientForm
            clientForm={clientForm}
            onSubmit={(data) => {
              handleAddClient(data);
              setIsAddDialogOpen(false);
              clientForm.reset();
            }}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            selectedClient={null}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Modifica cliente</DialogTitle>
            <DialogDescription>
              Modifica i dati del cliente
            </DialogDescription>
          </DialogHeader>
          <ClientForm
            clientForm={clientForm}
            onSubmit={(data) => {
              handleEditClient(data);
              setIsEditDialogOpen(false);
            }}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            selectedClient={selectedClient}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Clients;
