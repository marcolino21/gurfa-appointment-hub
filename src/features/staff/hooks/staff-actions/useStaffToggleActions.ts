
import { StaffMember } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { updateStaffData } from '../../utils/staffDataUtils';

/**
 * Hook for toggling staff status and visibility
 */
export const useStaffToggleActions = (
  salonId: string | null,
  staffMembers: StaffMember[],
  setStaffMembers: React.Dispatch<React.SetStateAction<StaffMember[]>>
) => {
  const { toast } = useToast();

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
    toggleStaffStatus,
    toggleCalendarVisibility,
  };
};
