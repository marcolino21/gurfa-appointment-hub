
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { StaffMember } from '@/types';

// Use the global staff data if available
declare global {
  interface Window {
    globalStaffData?: Record<string, StaffMember[]>;
  }
}

export const useStaffAppointments = () => {
  const { currentSalonId } = useAuth();
  const [visibleStaff, setVisibleStaff] = useState<StaffMember[]>([]);
  
  useEffect(() => {
    if (currentSalonId) {
      // Recupera lo staff dal global data o dal MOCK_STAFF e filtra solo quelli visibili in agenda
      const globalStaffData = window.globalStaffData || {};
      const allStaff = globalStaffData[currentSalonId] || [];
      const staffVisibleInCalendar = allStaff.filter(staff => 
        staff.isActive && staff.showInCalendar
      );
      
      console.log("Staff visibile in agenda:", staffVisibleInCalendar);
      setVisibleStaff(staffVisibleInCalendar);
    }
  }, [currentSalonId]); // La dipendenza sarà ricalcolata automaticamente quando lo staff cambia

  return { 
    visibleStaff
  };
};
