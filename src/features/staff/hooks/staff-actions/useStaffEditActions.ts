
import { StaffMember } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { StaffFormValues } from '../../types';
import { updateStaffData } from '../../utils/staffDataUtils';

/**
 * Hook for editing staff members
 */
export const useStaffEditActions = (
  salonId: string | null,
  staffMembers: StaffMember[],
  setStaffMembers: React.Dispatch<React.SetStateAction<StaffMember[]>>
) => {
  const { toast } = useToast();

  const editStaff = (staffId: string, data: StaffFormValues) => {
    if (!salonId) {
      toast({
        title: 'Errore',
        description: 'Impossibile modificare il membro dello staff: salonId non definito',
        variant: 'destructive',
      });
      return;
    }

    // Ensure workSchedule days and isWorking are properly defined
    const workSchedule = data.workSchedule.map(day => ({
      day: day.day,
      isWorking: Boolean(day.isWorking),
      startTime: day.startTime || '',
      endTime: day.endTime || '',
      breakStart: day.breakStart || '',
      breakEnd: day.breakEnd || '',
    }));

    const updatedStaff = staffMembers.map(staff => 
      staff.id === staffId ? {
        ...staff,
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
      } : staff
    );

    // Update local state
    setStaffMembers(updatedStaff);
    
    // Update global storage
    updateStaffData(salonId, updatedStaff);
    
    toast({
      title: 'Membro dello staff modificato',
      description: `${data.firstName} ${data.lastName} è stato modificato con successo`,
    });
  };

  return { editStaff };
};
