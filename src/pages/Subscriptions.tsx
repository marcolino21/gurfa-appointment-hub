
import React, { useState, useEffect } from 'react';
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
import { useSubscriptionsData } from '@/features/subscriptions/hooks/useSubscriptionsData';
import { SubscriptionsTable } from '@/features/subscriptions/components/SubscriptionsTable';
import { SubscriptionForm } from '@/features/subscriptions/components/SubscriptionForm';

const Subscriptions = () => {
  const [businessName, setBusinessName] = useState<string | null>(null);
  
  useEffect(() => {
    // Get the business name from localStorage
    const savedBusinessName = localStorage.getItem('salon_business_name');
    if (savedBusinessName) {
      setBusinessName(savedBusinessName);
    }
  }, []);
  
  const {
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
    handleAddSubscription,
    handleEditSubscription,
    handleDeleteSubscription
  } = useSubscriptionsData();

  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Abbonamenti {businessName && `- ${businessName}`}</CardTitle>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cerca abbonamento..."
                className="pl-8 w-[250px]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button onClick={() => {
              setSelectedSubscription(null);
              setActiveTab('dettagli');
              setIsAddDialogOpen(true);
            }}>
              <Plus className="h-4 w-4 mr-2" /> Crea abbonamento
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <SubscriptionsTable 
            subscriptions={filteredSubscriptions} 
            getClientName={getClientName}
            onEdit={(subscription) => {
              setSelectedSubscription(subscription);
              setActiveTab('dettagli');
              setIsEditDialogOpen(true);
            }}
            onDelete={handleDeleteSubscription}
          />
        </CardContent>
      </Card>

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Nuovo abbonamento</DialogTitle>
            <DialogDescription>
              Inserisci i dettagli del nuovo abbonamento
            </DialogDescription>
          </DialogHeader>
          <SubscriptionForm
            clients={clients}
            services={services}
            selectedSubscription={null}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            onSubmit={handleAddSubscription}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Modifica abbonamento</DialogTitle>
            <DialogDescription>
              Modifica i dettagli dell'abbonamento
            </DialogDescription>
          </DialogHeader>
          {selectedSubscription && (
            <SubscriptionForm
              clients={clients}
              services={services}
              selectedSubscription={selectedSubscription}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              onSubmit={handleEditSubscription}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Subscriptions;
