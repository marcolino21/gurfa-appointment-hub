
import { StaffMember } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { StaffFormValues } from '../types';
import { updateStaffData } from '../utils/staffDataUtils';

/**
 * Hook for staff management actions (add, edit, delete, toggle)
 */
export const useStaffActions = (
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

  const deleteStaff = (staffId: string) => {
    if (!salonId) {
      toast({
        title: 'Errore',
        description: 'Impossibile eliminare il membro dello staff: salonId non definito',
        variant: 'destructive',
      });
      return;
    }
    
    const updatedStaff = staffMembers.filter(staff => staff.id !== staffId);
    
    // Update local state
    setStaffMembers(updatedStaff);
    
    // Update global storage
    updateStaffData(salonId, updatedStaff);
    
    toast({
      title: 'Membro dello staff eliminato',
      description: 'Il membro dello staff è stato eliminato con successo',
    });
  };

  const toggleStaffStatus = (staffId: string, isActive: boolean) => {
    if (!salonId) {
      toast({
        title: 'Errore',
        description: 'Impossibile modificare lo stato: salonId non definito',
        variant: 'destructive',
      });
      return;
    }
    
    const updatedStaff = staffMembers.map(staff => 
      staff.id === staffId ? { ...staff, isActive } : staff
    );
    
    // Update local state
    setStaffMembers(updatedStaff);
    
    // Update global storage
    updateStaffData(salonId, updatedStaff);
    
    toast({
      title: isActive ? 'Membro dello staff attivato' : 'Membro dello staff disattivato',
      description: `Il membro dello staff è stato ${isActive ? 'attivato' : 'disattivato'} con successo`,
    });
  };

  const toggleCalendarVisibility = (staffId: string, showInCalendar: boolean) => {
    if (!salonId) {
      toast({
        title: 'Errore',
        description: 'Impossibile modificare la visibilità: salonId non definito',
        variant: 'destructive',
      });
      return;
    }
    
    const updatedStaff = staffMembers.map(staff => 
      staff.id === staffId ? { ...staff, showInCalendar } : staff
    );
    
    // Update local state
    setStaffMembers(updatedStaff);
    
    // Update global storage
    updateStaffData(salonId, updatedStaff);
    
    toast({
      title: showInCalendar ? 'Visibile in agenda' : 'Nascosto dall\'agenda',
      description: `Il membro dello staff sarà ${showInCalendar ? 'visibile' : 'nascosto'} nell'agenda`,
    });
  };

  return {
    addStaff,
    editStaff,
    deleteStaff,
    toggleStaffStatus,
    toggleCalendarVisibility,
  };
};
