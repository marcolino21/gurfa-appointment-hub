
import { useStaffMembers } from './useStaffMembers';
import { useStaffActions } from './useStaffActions';

export const useStaffData = (salonId: string | null) => {
  const { staffMembers, setStaffMembers, services } = useStaffMembers(salonId);
  
  const {
    addStaff,
    editStaff, 
    deleteStaff,
    toggleStaffStatus,
    toggleCalendarVisibility
  } = useStaffActions(salonId, staffMembers, setStaffMembers);

  return {
    staffMembers,
    services,
    addStaff,
    editStaff,
    deleteStaff,
    toggleStaffStatus,
    toggleCalendarVisibility,
  };
};
