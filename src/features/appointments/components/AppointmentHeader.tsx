
import React from 'react';
import { Button } from '@/components/ui/button';
import { CalendarPlus } from 'lucide-react';
import { Appointment } from '@/types';

interface AppointmentHeaderProps {
  handleAddAppointment: () => void;
}

const AppointmentHeader: React.FC<AppointmentHeaderProps> = ({
  handleAddAppointment,
}) => {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Appuntamenti</h1>
        <p className="text-muted-foreground">
          Gestisci tutti i tuoi appuntamenti
        </p>
      </div>
      
      <Button onClick={handleAddAppointment}>
        <CalendarPlus className="mr-2 h-4 w-4" /> Nuovo Appuntamento
      </Button>
    </div>
  );
};

export default AppointmentHeader;
