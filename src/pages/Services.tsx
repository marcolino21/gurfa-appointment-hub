
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
import { Plus, Search } from 'lucide-react';
import { useServicesData } from '@/features/services/hooks/useServicesData';
import { ServicesTable } from '@/features/services/components/ServicesTable';
import { ServiceForm } from '@/features/services/components/service-form';
import { useToast } from '@/hooks/use-toast';

const Services = () => {
  const {
    filteredServices,
    categories,
    staffMembers,
    searchTerm,
    setSearchTerm,
    isAddDialogOpen,
    setIsAddDialogOpen,
    isEditDialogOpen,
    setIsEditDialogOpen,
    selectedService,
    setSelectedService,
    activeTab,
    setActiveTab,
    getCategoryName,
    handleAddService,
    handleEditService,
    handleDeleteService
  } = useServicesData();

  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Servizi</CardTitle>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cerca servizio..."
                className="pl-8 w-[250px]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button onClick={() => {
              setSelectedService(null);
              setActiveTab('dettagli');
              setIsAddDialogOpen(true);
            }}>
              <Plus className="h-4 w-4 mr-2" /> Aggiungi servizio
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <ServicesTable 
            services={filteredServices} 
            getCategoryName={getCategoryName}
            onEdit={(service) => {
              setSelectedService(service);
              setActiveTab('dettagli');
              setIsEditDialogOpen(true);
            }}
            onDelete={handleDeleteService}
          />
        </CardContent>
      </Card>

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Nuovo servizio</DialogTitle>
            <DialogDescription>
              Inserisci i dettagli del nuovo servizio
            </DialogDescription>
          </DialogHeader>
          <ServiceForm
            categories={categories}
            staffMembers={staffMembers}
            selectedService={null}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            onSubmit={(data) => {
              try {
                console.log('Dati form invio:', data);
                handleAddService(data);
              } catch (error) {
                console.error('Errore durante l\'aggiunta del servizio:', error);
                toast({
                  title: 'Errore',
                  description: 'Si è verificato un problema durante l\'aggiunta del servizio',
                  variant: 'destructive',
                });
              }
            }}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Modifica servizio</DialogTitle>
            <DialogDescription>
              Modifica i dettagli del servizio
            </DialogDescription>
          </DialogHeader>
          {selectedService && (
            <ServiceForm
              categories={categories}
              staffMembers={staffMembers}
              selectedService={selectedService}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              onSubmit={(data) => {
                try {
                  handleEditService(data);
                } catch (error) {
                  console.error('Errore durante la modifica del servizio:', error);
                  toast({
                    title: 'Errore',
                    description: 'Si è verificato un problema durante la modifica del servizio',
                    variant: 'destructive',
                  });
                }
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Services;
