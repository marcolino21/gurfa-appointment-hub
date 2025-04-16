
import React from 'react';
import { DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface AppointmentDialogHeaderProps {
  isExistingAppointment: boolean;
}

const AppointmentDialogHeader: React.FC<AppointmentDialogHeaderProps> = ({ 
  isExistingAppointment 
}) => {
  return (
    <DialogHeader>
      <DialogTitle>
        {isExistingAppointment ? 'Modifica Appuntamento' : 'Nuovo Appuntamento'}
      </DialogTitle>
    </DialogHeader>
  );
};

export default AppointmentDialogHeader;
