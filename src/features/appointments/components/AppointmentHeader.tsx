
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { CalendarPlus, PlusCircle } from 'lucide-react';
import { Appointment } from '@/types';
import ActivityDialog from '@/components/ActivityDialog';

interface AppointmentHeaderProps {
  handleAddAppointment: () => void;
}

const AppointmentHeader: React.FC<AppointmentHeaderProps> = ({
  handleAddAppointment,
}) => {
  const [isActivityDialogOpen, setIsActivityDialogOpen] = useState(false);
  const [businessName, setBusinessName] = useState<string | null>(null);
  
  useEffect(() => {
    // Get the business name from localStorage
    const savedBusinessName = localStorage.getItem('salon_business_name');
    if (savedBusinessName) {
      setBusinessName(savedBusinessName);
    }
    
    // Set up a listener for storage changes to update business name
    const handleStorageChange = () => {
      const updatedBusinessName = localStorage.getItem('salon_business_name');
      setBusinessName(updatedBusinessName);
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);
  
  return (
    <>
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Appuntamenti {businessName && `- ${businessName}`}</h1>
          <p className="text-muted-foreground">
            Gestisci tutti i tuoi appuntamenti
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setIsActivityDialogOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4" /> Aggiungi attività
          </Button>
          
          <Button onClick={handleAddAppointment}>
            <CalendarPlus className="mr-2 h-4 w-4" /> Nuovo Appuntamento
          </Button>
        </div>
      </div>
      
      <ActivityDialog 
        open={isActivityDialogOpen} 
        onOpenChange={setIsActivityDialogOpen} 
      />
    </>
  );
};

export default AppointmentHeader;
