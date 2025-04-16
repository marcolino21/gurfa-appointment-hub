import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import ActivityDialog from '@/components/ActivityDialog';

const Users = () => {
  const [isActivityDialogOpen, setIsActivityDialogOpen] = useState(false);
  
  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Utenti</h1>
          <p className="text-muted-foreground">Gestisci gli utenti e le attività.</p>
        </div>
        
        <Button onClick={() => setIsActivityDialogOpen(true)} className="flex items-center gap-2">
          <PlusCircle className="h-4 w-4" />
          <span>Aggiungi attività</span>
        </Button>
      </div>
      
      <div className="bg-white rounded-md shadow p-6">
        <p>Contenuto della pagina utenti...</p>
      </div>
      
      <ActivityDialog 
        open={isActivityDialogOpen} 
        onOpenChange={setIsActivityDialogOpen}
      />
    </div>
  );
};

export default Users;
