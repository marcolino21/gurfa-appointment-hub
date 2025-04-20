
import { StaffMember } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { StaffFormValues } from '../../types';
import { addStaffMember } from '../../utils/staffDataUtils';

export const useStaffAddActions = (
  salonId: string | null,
  staffMembers: StaffMember[],
  setStaffMembers: React.Dispatch<React.SetStateAction<StaffMember[]>>
) => {
  const { toast } = useToast();

  const addStaff = async (data: StaffFormValues) => {
    if (!salonId) {
      toast({
        title: 'Errore',
        description: 'Impossibile aggiungere il membro dello staff: salonId non definito',
        variant: 'destructive',
      });
      return;
    }

    try {
      // Ensure workSchedule days and isWorking are properly defined
      const workSchedule = data.workSchedule.map(day => ({
        day: day.day,
        isWorking: Boolean(day.isWorking),
        startTime: day.startTime || '',
        endTime: day.endTime || '',
        breakStart: day.breakStart || '',
        breakEnd: day.breakEnd || '',
      }));

      const newStaffData = {
        firstName: data.firstName,
        lastName: data.lastName || '',
        email: data.email,
        isActive: Boolean(data.isActive),
        showInCalendar: Boolean(data.showInCalendar),
        phone: data.phone || '',
        additionalPhone: data.additionalPhone || '',
        country: data.country || 'Italia',
        birthDate: data.birthDate || '',
        position: data.position || '',
        color: data.color || '#9b87f5',
        assignedServiceIds: Array.isArray(data.assignedServiceIds) ? data.assignedServiceIds : [],
        workSchedule,
        salonId
      };

      const newStaff = await addStaffMember(salonId, newStaffData);
      
      setStaffMembers(prev => [...prev, newStaff]);
      
      toast({
        title: 'Membro dello staff aggiunto',
        description: `${newStaff.firstName} ${newStaff.lastName} è stato aggiunto con successo`,
      });
      
      return newStaff;
    } catch (error: any) {
      console.error("Error adding staff member:", error);
      
      // Fornisci un messaggio di errore più specifico in base al tipo di errore
      if (error.name === 'DuplicateEmailError' || (error.message && error.message.includes('Email già utilizzata'))) {
        toast({
          title: 'Email già in uso',
          description: 'Questa email è già associata a un altro membro dello staff',
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Errore',
          description: 'Impossibile aggiungere il membro dello staff',
          variant: 'destructive',
        });
      }
    }
  };

  return { addStaff };
};
