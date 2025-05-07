
import React from 'react';
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
import { AlertTriangle, Loader2, Plus, Search } from 'lucide-react';
import { useServicesData } from '@/features/services/hooks/useServicesData';
import { ServicesTable } from '@/features/services/components/ServicesTable';
import { ServiceForm } from '@/features/services/components/service-form';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useAuth } from '@/contexts/AuthContext';

const Services = () => {
  const { currentSalonId } = useAuth();
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
    handleDeleteService,
    isLoading
  } = useServicesData();

  // Render a message if no salon is selected
  if (!currentSalonId) {
    return (
      <div className="container mx-auto py-6">
        <Alert variant="destructive" className="mb-6">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Nessun salone selezionato</AlertTitle>
          <AlertDescription>
            Seleziona un salone dall'intestazione per visualizzare e gestire i servizi.
          </AlertDescription>
        </Alert>
        
        <Card>
          <CardHeader>
            <CardTitle>Servizi</CardTitle>
          </CardHeader>
          <CardContent className="text-center py-12">
            <p>Per gestire i servizi, è necessario prima selezionare un salone.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

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
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2 text-lg">Caricamento servizi...</span>
            </div>
          ) : (
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
          )}
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
            onSubmit={handleAddService}
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
              onSubmit={handleEditService}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Services;
