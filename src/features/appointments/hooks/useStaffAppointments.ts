
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { StaffMember } from '@/types';
import { getSalonStaff } from '@/features/staff/utils/staffDataUtils';

export const useStaffAppointments = () => {
  const { currentSalonId } = useAuth();
  const [visibleStaff, setVisibleStaff] = useState<StaffMember[]>([]);
  
  useEffect(() => {
    if (currentSalonId) {
      // Get staff from global data and filter only those visible in calendar
      const allStaff = getSalonStaff(currentSalonId);
      const staffVisibleInCalendar = allStaff.filter(staff => 
        staff.isActive && staff.showInCalendar
      );
      
      console.log("Staff visibile in agenda:", staffVisibleInCalendar);
      setVisibleStaff(staffVisibleInCalendar);
    }
  }, [currentSalonId, window.globalStaffData[currentSalonId || '']]);

  return { 
    visibleStaff
  };
};
