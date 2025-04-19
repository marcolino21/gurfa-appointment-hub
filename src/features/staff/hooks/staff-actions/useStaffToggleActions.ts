
import { StaffMember } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { updateStaffData } from '../../utils/staffDataUtils';

/**
 * Hook for toggling staff properties
 */
export const useStaffToggleActions = (
  salonId: string | null,
  staffMembers: StaffMember[],
  setStaffMembers: React.Dispatch<React.SetStateAction<StaffMember[]>>
) => {
  const { toast } = useToast();

  // Toggle staff active status
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
      staff.id === staffId ? { ...staff, isActive: !isActive } : staff
    );
    
    setStaffMembers(updatedStaff);
    updateStaffData(salonId, updatedStaff);

    toast({
      title: isActive ? 'Staff disattivato' : 'Staff attivato',
      description: `Lo staff è stato ${isActive ? 'disattivato' : 'attivato'} con successo.`
    });
    
    // Dispatch a custom event to notify other components about the staff change
    const event = new CustomEvent('staffDataUpdated', {
      detail: { 
        salonId,
        staffId,
        type: 'status',
        value: !isActive
      }
    });
    window.dispatchEvent(event);
  };

  // Toggle staff calendar visibility
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
      staff.id === staffId ? { ...staff, showInCalendar: !showInCalendar } : staff
    );
    
    setStaffMembers(updatedStaff);
    updateStaffData(salonId, updatedStaff);

    toast({
      title: showInCalendar ? 'Staff nascosto in agenda' : 'Staff visibile in agenda',
      description: `Lo staff è ora ${showInCalendar ? 'nascosto' : 'visibile'} in agenda.`
    });
    
    // Dispatch a custom event to notify other components about the staff change
    const event = new CustomEvent('staffDataUpdated', {
      detail: { 
        salonId,
        staffId,
        type: 'calendarVisibility',
        value: !showInCalendar
      }
    });
    window.dispatchEvent(event);
  };

  return { toggleStaffStatus, toggleCalendarVisibility };
};
