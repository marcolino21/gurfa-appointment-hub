
import React from 'react';
import { StaffMember, Service } from '@/types';
import { StaffFormValues } from '@/features/staff/types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import StaffForm from '@/features/staff/components/StaffForm';

interface StaffDialogsProps {
  isAddDialogOpen: boolean;
  setIsAddDialogOpen: (open: boolean) => void;
  isEditDialogOpen: boolean;
  setIsEditDialogOpen: (open: boolean) => void;
  selectedStaff: StaffMember | null;
  services: Service[];
  onAddStaff: (data: StaffFormValues) => void;
  onEditStaff: (data: StaffFormValues) => void;
}

const StaffDialogs: React.FC<StaffDialogsProps> = ({
  isAddDialogOpen,
  setIsAddDialogOpen,
  isEditDialogOpen,
  setIsEditDialogOpen,
  selectedStaff,
  services,
  onAddStaff,
  onEditStaff
}) => {
  // Inizializza un workSchedule di default per nuovi membri dello staff
  const defaultWorkSchedule = [
    { day: 'Lunedì', isWorking: false, startTime: '09:00', endTime: '18:00', breakStart: '13:00', breakEnd: '14:00' },
    { day: 'Martedì', isWorking: false, startTime: '09:00', endTime: '18:00', breakStart: '13:00', breakEnd: '14:00' },
    { day: 'Mercoledì', isWorking: false, startTime: '09:00', endTime: '18:00', breakStart: '13:00', breakEnd: '14:00' },
    { day: 'Giovedì', isWorking: false, startTime: '09:00', endTime: '18:00', breakStart: '13:00', breakEnd: '14:00' },
    { day: 'Venerdì', isWorking: false, startTime: '09:00', endTime: '18:00', breakStart: '13:00', breakEnd: '14:00' },
    { day: 'Sabato', isWorking: false, startTime: '09:00', endTime: '18:00', breakStart: '13:00', breakEnd: '14:00' },
    { day: 'Domenica', isWorking: false, startTime: '09:00', endTime: '18:00', breakStart: '13:00', breakEnd: '14:00' },
  ];
  
  return (
    <>
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Aggiungi membro del team</DialogTitle>
            <DialogDescription>
              Inserisci i dati del nuovo membro del team
            </DialogDescription>
          </DialogHeader>
          <StaffForm 
            services={services}
            onSubmit={onAddStaff}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Modifica membro del team</DialogTitle>
            <DialogDescription>
              Modifica i dati del membro del team
            </DialogDescription>
          </DialogHeader>
          {selectedStaff && (
            <StaffForm 
              defaultValues={{
                firstName: selectedStaff.firstName,
                lastName: selectedStaff.lastName,
                email: selectedStaff.email,
                phone: selectedStaff.phone || '',
                additionalPhone: selectedStaff.additionalPhone || '',
                country: selectedStaff.country || 'Italia',
                birthDate: selectedStaff.birthDate || '',
                position: selectedStaff.position || '',
                color: selectedStaff.color || '#9b87f5',
                isActive: selectedStaff.isActive,
                showInCalendar: selectedStaff.showInCalendar,
                assignedServiceIds: selectedStaff.assignedServiceIds || [],
                workSchedule: selectedStaff.workSchedule || defaultWorkSchedule,
              }}
              services={services}
              onSubmit={onEditStaff}
              isEdit
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default StaffDialogs;
