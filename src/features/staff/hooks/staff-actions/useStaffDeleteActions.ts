
import { StaffMember } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { updateStaffData } from '../../utils/staffDataUtils';

/**
 * Hook for deleting staff members
 */
export const useStaffDeleteActions = (
  salonId: string | null,
  staffMembers: StaffMember[],
  setStaffMembers: React.Dispatch<React.SetStateAction<StaffMember[]>>
) => {
  const { toast } = useToast();

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

  return { deleteStaff };
};
