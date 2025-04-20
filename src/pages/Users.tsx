
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle, CreditCard } from 'lucide-react';
import BusinessUserDialog from '@/components/BusinessUserDialog';
import PaymentMethodDialog from '@/components/PaymentMethodDialog';

const Users = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [businessName, setBusinessName] = useState<string | null>(null);

  React.useEffect(() => {
    const savedBusinessName = localStorage.getItem('salon_business_name');
    if (savedBusinessName) setBusinessName(savedBusinessName);
  }, []);

  return (
    <div className="container mx-auto py-4 md:py-6 px-4 md:px-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight">
            Utenti {businessName && `- ${businessName}`}
          </h1>
          <p className="text-muted-foreground">Gestisci gli utenti e le attività.</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button onClick={() => setIsDialogOpen(true)} className="flex items-center gap-2 w-full md:w-auto">
            <PlusCircle className="h-4 w-4" />
            <span>Aggiungi attività</span>
          </Button>
          <Button 
            variant="outline" 
            onClick={() => setIsPaymentDialogOpen(true)} 
            className="flex items-center gap-2 w-full md:w-auto"
          >
            <CreditCard className="h-4 w-4" />
            <span>Aggiungi Metodo di Pagamento</span>
          </Button>
        </div>
      </div>
      <div className="bg-white rounded-md shadow p-4 md:p-6">
        <p>Contenuto della pagina utenti...</p>
      </div>
      <BusinessUserDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
      />
      <PaymentMethodDialog
        isOpen={isPaymentDialogOpen}
        onClose={() => setIsPaymentDialogOpen(false)}
        onSubmit={(data) => {
          console.log("Dati carta utente:", data);
        }}
      />
    </div>
  );
};

export default Users;
