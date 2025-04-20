
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import BusinessUserDialog from '@/components/BusinessUserDialog';

const Users = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [businessName, setBusinessName] = useState<string | null>(null);

  React.useEffect(() => {
    const savedBusinessName = localStorage.getItem('salon_business_name');
    if (savedBusinessName) setBusinessName(savedBusinessName);
  }, []);

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Utenti {businessName && `- ${businessName}`}
          </h1>
          <p className="text-muted-foreground">Gestisci gli utenti e le attività.</p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)} className="flex items-center gap-2">
          <PlusCircle className="h-4 w-4" />
          <span>Aggiungi attività</span>
        </Button>
      </div>
      <div className="bg-white rounded-md shadow p-6">
        <p>Contenuto della pagina utenti...</p>
      </div>
      <BusinessUserDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
      />
    </div>
  );
};

export default Users;
