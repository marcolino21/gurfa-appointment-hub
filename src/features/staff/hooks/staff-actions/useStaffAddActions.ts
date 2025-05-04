import { StaffMember } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { StaffFormValues } from '../../types';
import { addStaffMember } from '../../utils/staffDataUtils';
import { createStaffMember } from '@/types/staff';

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
      const workSchedule = data.workSchedule.map(day => ({
        day: day.day,
        isWorking: Boolean(day.isWorking),
        startTime: day.startTime || '',
        endTime: day.endTime || '',
        breakStart: day.breakStart || '',
        breakEnd: day.breakEnd || '',
      }));

      const newStaffMember = createStaffMember({
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
        salonId,
        permissions: []
      });

      const savedStaff = await addStaffMember(salonId, newStaffMember);
      
      setStaffMembers(prev => [...prev, savedStaff]);
      
      // Dispatch event to force refresh in all listeners
      const event = new CustomEvent('staffDataUpdated', {
        detail: { salonId, type: 'add' }
      });
      window.dispatchEvent(event);
      
      toast({
        title: 'Membro dello staff aggiunto',
        description: `${newStaffMember.firstName} ${newStaffMember.lastName} è stato aggiunto con successo`,
      });
      
      return savedStaff;
    } catch (error: any) {
      console.error("Error adding staff member:", error);
      
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
