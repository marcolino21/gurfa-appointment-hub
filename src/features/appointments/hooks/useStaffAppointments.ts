
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { StaffMember } from '@/types';
import { getSalonStaff } from '@/features/staff/utils/staffDataUtils';
import { BUSINESS_NAME_CHANGE_EVENT } from '@/utils/businessNameEvents';

export const useStaffAppointments = () => {
  const { currentSalonId } = useAuth();
  const [visibleStaff, setVisibleStaff] = useState<StaffMember[]>([]);
  
  // Function to get visible staff
  const fetchVisibleStaff = useCallback(() => {
    if (currentSalonId) {
      // Get staff from global data and filter only those visible in calendar
      const allStaff = getSalonStaff(currentSalonId);
      const staffVisibleInCalendar = allStaff.filter(staff => 
        staff.isActive && staff.showInCalendar
      );
      
      console.log("Staff visible in calendar:", staffVisibleInCalendar);
      setVisibleStaff(staffVisibleInCalendar);
    }
  }, [currentSalonId]);
  
  // Initial load and react to currentSalonId changes
  useEffect(() => {
    fetchVisibleStaff();
  }, [fetchVisibleStaff]);
  
  // Listen for staff data updates
  useEffect(() => {
    const handleStaffDataUpdate = (event: CustomEvent) => {
      if (currentSalonId && event.detail.salonId === currentSalonId) {
        fetchVisibleStaff();
      }
    };

    // Listen to any staff changes
    window.addEventListener('staffDataUpdated', handleStaffDataUpdate as EventListener);
    
    // Also listen to business name changes as a trigger to recheck staff
    window.addEventListener(BUSINESS_NAME_CHANGE_EVENT, fetchVisibleStaff as EventListener);
    
    // Clean up
    return () => {
      window.removeEventListener('staffDataUpdated', handleStaffDataUpdate as EventListener);
      window.removeEventListener(BUSINESS_NAME_CHANGE_EVENT, fetchVisibleStaff as EventListener);
    };
  }, [currentSalonId, fetchVisibleStaff]);

  return { 
    visibleStaff,
    refreshVisibleStaff: fetchVisibleStaff
  };
};
