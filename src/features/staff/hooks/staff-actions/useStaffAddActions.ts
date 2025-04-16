
import { StaffMember } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { StaffFormValues } from '../../types';
import { updateStaffData } from '../../utils/staffDataUtils';

/**
 * Hook for adding staff members
 */
export const useStaffAddActions = (
  salonId: string | null,
  staffMembers: StaffMember[],
  setStaffMembers: React.Dispatch<React.SetStateAction<StaffMember[]>>
) => {
  const { toast } = useToast();

  const addStaff = (data: StaffFormValues) => {
    // Verify salonId or use a temporary one
    const effectiveSalonId = salonId || 'temp_salon_id';
    
    console.log("Adding staff with data:", data);
    console.log("Current salonId:", effectiveSalonId);

    // Ensure workSchedule days and isWorking are properly defined
    const workSchedule = data.workSchedule.map(day => ({
      day: day.day,
      isWorking: Boolean(day.isWorking),
      startTime: day.startTime || '',
      endTime: day.endTime || '',
      breakStart: day.breakStart || '',
      breakEnd: day.breakEnd || '',
    }));

    // Create staff with required fields explicitly defined
    const newStaff: StaffMember = {
      id: `staff${Date.now().toString(36)}${Math.random().toString(36).substr(2, 5)}`,
      firstName: data.firstName,
      lastName: data.lastName || '',
      email: data.email,
      isActive: Boolean(data.isActive),
      showInCalendar: Boolean(data.showInCalendar), 
      salonId: effectiveSalonId,
      // Optional fields
      phone: data.phone || '',
      additionalPhone: data.additionalPhone || '',
      country: data.country || 'Italia',
      birthDate: data.birthDate || '',
      position: data.position || '', 
      color: data.color || '#9b87f5',
      assignedServiceIds: Array.isArray(data.assignedServiceIds) ? data.assignedServiceIds : [],
      workSchedule,
    };

    console.log("New staff object:", newStaff);

    // Update local state 
    const updatedStaff = [...staffMembers, newStaff];
    setStaffMembers(updatedStaff);
    
    // Update global storage
    updateStaffData(effectiveSalonId, updatedStaff);
    
    toast({
      title: 'Membro dello staff aggiunto',
      description: `${newStaff.firstName} ${newStaff.lastName} è stato aggiunto con successo`,
    });
    
    return newStaff;
  };

  return { addStaff };
};
