
import { StaffMember } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { updateStaffData } from '../../utils/staffDataUtils';

export const useStaffToggleActions = (
  salonId: string | null,
  staffMembers: StaffMember[],
  setStaffMembers: React.Dispatch<React.SetStateAction<StaffMember[]>>
) => {
  const { toast } = useToast();

  const toggleStaffStatus = async (staffId: string, isActive: boolean) => {
    if (!salonId) {
      toast({
        title: 'Errore',
        description: 'Impossibile modificare lo stato: salonId non definito',
        variant: 'destructive',
      });
      return;
    }

    try {
      const staffMember = staffMembers.find(s => s.id === staffId);
      if (!staffMember) return;

      await updateStaffData(salonId, {
        id: staffId,
        isActive: !isActive
      });
      
      setStaffMembers(prev => prev.map(staff => 
        staff.id === staffId ? { ...staff, isActive: !isActive } : staff
      ));

      toast({
        title: isActive ? 'Staff disattivato' : 'Staff attivato',
        description: `Lo staff è stato ${isActive ? 'disattivato' : 'attivato'} con successo.`
      });
    } catch (error) {
      console.error("Error toggling staff status:", error);
      toast({
        title: 'Errore',
        description: 'Impossibile modificare lo stato dello staff',
        variant: 'destructive',
      });
    }
  };

  const toggleCalendarVisibility = async (staffId: string, showInCalendar: boolean) => {
    if (!salonId) {
      toast({
        title: 'Errore',
        description: 'Impossibile modificare la visibilità: salonId non definito',
        variant: 'destructive',
      });
      return;
    }

    try {
      const staffMember = staffMembers.find(s => s.id === staffId);
      if (!staffMember) return;

      await updateStaffData(salonId, {
        id: staffId,
        showInCalendar: !showInCalendar
      });
      
      setStaffMembers(prev => prev.map(staff => 
        staff.id === staffId ? { ...staff, showInCalendar: !showInCalendar } : staff
      ));

      toast({
        title: showInCalendar ? 'Staff nascosto in agenda' : 'Staff visibile in agenda',
        description: `Lo staff è ora ${showInCalendar ? 'nascosto' : 'visibile'} in agenda.`
      });
    } catch (error) {
      console.error("Error toggling calendar visibility:", error);
      toast({
        title: 'Errore',
        description: 'Impossibile modificare la visibilità dello staff',
        variant: 'destructive',
      });
    }
  };

  return { toggleStaffStatus, toggleCalendarVisibility };
};
