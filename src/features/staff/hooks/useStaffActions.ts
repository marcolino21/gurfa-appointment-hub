
import { StaffMember } from '@/types';
import { StaffFormValues } from '../types';
import { 
  useStaffAddActions, 
  useStaffEditActions,
  useStaffDeleteActions,
  useStaffToggleActions 
} from './staff-actions';

/**
 * Combined hook for all staff management actions
 */
export const useStaffActions = (
  salonId: string | null,
  staffMembers: StaffMember[],
  setStaffMembers: React.Dispatch<React.SetStateAction<StaffMember[]>>
) => {
  // Use the individual action hooks
  const { addStaff } = useStaffAddActions(salonId, staffMembers, setStaffMembers);
  const { editStaff } = useStaffEditActions(salonId, staffMembers, setStaffMembers);
  const { deleteStaff } = useStaffDeleteActions(salonId, staffMembers, setStaffMembers);
  const { toggleStaffStatus, toggleCalendarVisibility } = useStaffToggleActions(
    salonId, 
    staffMembers, 
    setStaffMembers
  );

  // Return all actions in a single object
  return {
    addStaff,
    editStaff,
    deleteStaff,
    toggleStaffStatus,
    toggleCalendarVisibility,
  };
};
