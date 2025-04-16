
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { StaffMember } from '@/types';
import { getSalonStaff } from '@/features/staff/utils/staffDataUtils';

export const useStaffAppointments = () => {
  const { currentSalonId } = useAuth();
  const [visibleStaff, setVisibleStaff] = useState<StaffMember[]>([]);
  
  // Initial load and react to currentSalonId changes
  useEffect(() => {
    if (currentSalonId) {
      // Get staff from global data and filter only those visible in calendar
      const allStaff = getSalonStaff(currentSalonId);
      const staffVisibleInCalendar = allStaff.filter(staff => 
        staff.isActive && staff.showInCalendar
      );
      
      console.log("Staff visible in calendar (initial):", staffVisibleInCalendar);
      setVisibleStaff(staffVisibleInCalendar);
    }
  }, [currentSalonId]);
  
  // Listen for staff data updates
  useEffect(() => {
    const handleStaffDataUpdate = (event: CustomEvent) => {
      if (currentSalonId && event.detail.salonId === currentSalonId) {
        const allStaff = getSalonStaff(currentSalonId);
        const staffVisibleInCalendar = allStaff.filter(staff => 
          staff.isActive && staff.showInCalendar
        );
        
        console.log("Staff visible in calendar (updated via event):", staffVisibleInCalendar);
        setVisibleStaff(staffVisibleInCalendar);
      }
    };

    // Add event listener
    window.addEventListener('staffDataUpdated', handleStaffDataUpdate as EventListener);
    
    // Regular polling as a fallback
    const intervalId = setInterval(() => {
      if (currentSalonId) {
        const allStaff = getSalonStaff(currentSalonId);
        const staffVisibleInCalendar = allStaff.filter(staff => 
          staff.isActive && staff.showInCalendar
        );
        
        if (JSON.stringify(staffVisibleInCalendar) !== JSON.stringify(visibleStaff)) {
          console.log("Staff visible in calendar (updated via polling):", staffVisibleInCalendar);
          setVisibleStaff(staffVisibleInCalendar);
        }
      }
    }, 2000);
    
    // Clean up
    return () => {
      window.removeEventListener('staffDataUpdated', handleStaffDataUpdate as EventListener);
      clearInterval(intervalId);
    };
  }, [currentSalonId, visibleStaff]);

  return { 
    visibleStaff
  };
};
