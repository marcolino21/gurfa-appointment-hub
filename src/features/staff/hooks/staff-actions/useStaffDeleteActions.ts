
import { StaffMember } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { deleteStaffMember } from '../../utils/staffDataUtils';

export const useStaffDeleteActions = (
  salonId: string | null,
  staffMembers: StaffMember[],
  setStaffMembers: React.Dispatch<React.SetStateAction<StaffMember[]>>
) => {
  const { toast } = useToast();

  const deleteStaff = async (staffId: string) => {
    if (!salonId) {
      toast({
        title: 'Errore',
        description: 'Impossibile eliminare il membro dello staff: salonId non definito',
        variant: 'destructive',
      });
      return;
    }

    try {
      await deleteStaffMember(salonId, staffId);
      
      setStaffMembers(prev => prev.filter(staff => staff.id !== staffId));
      
      toast({
        title: 'Membro dello staff eliminato',
        description: 'Il membro dello staff è stato eliminato con successo',
      });
    } catch (error) {
      console.error("Error deleting staff member:", error);
      toast({
        title: 'Errore',
        description: 'Impossibile eliminare il membro dello staff',
        variant: 'destructive',
      });
    }
  };

  return { deleteStaff };
};
