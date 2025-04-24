
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { StaffMember, Service } from '@/types';
import { getSalonStaff } from '@/features/staff/utils/staffDataUtils';
import { BUSINESS_NAME_CHANGE_EVENT } from '@/utils/businessNameEvents';
import { useToast } from '@/hooks/use-toast';
import { MOCK_SERVICES } from '@/data/mock/services';

export const useStaffAppointments = () => {
  const { currentSalonId } = useAuth();
  const [visibleStaff, setVisibleStaff] = useState<StaffMember[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const { toast } = useToast();
  
  // Function to get visible staff and services
  const fetchVisibleStaff = useCallback(async () => {
    if (currentSalonId) {
      try {
        // Get staff from the database and filter only those visible in calendar
        const allStaff = await getSalonStaff(currentSalonId);
        
        console.log("All staff members:", allStaff);
        
        const staffVisibleInCalendar = allStaff.filter(staff => 
          staff.isActive && staff.showInCalendar
        );
        
        console.log("Staff visible in calendar:", staffVisibleInCalendar);
        
        if (staffVisibleInCalendar.length === 0 && allStaff.length > 0) {
          console.warn("No staff members are set to be visible in calendar");
        }
        
        setVisibleStaff(staffVisibleInCalendar);
        
        // Load services from mock data
        const salonServices = MOCK_SERVICES[currentSalonId] || [];
        console.log("Loaded services for salon:", currentSalonId, salonServices.length);
        setServices(salonServices);
      } catch (error) {
        console.error("Error fetching visible staff:", error);
      }
    } else {
      console.log("No currentSalonId available");
    }
  }, [currentSalonId]);
  
  // Initial load and react to currentSalonId changes
  useEffect(() => {
    console.log("useStaffAppointments - currentSalonId:", currentSalonId);
    fetchVisibleStaff();
  }, [fetchVisibleStaff]);
  
  // Listen for staff data updates
  useEffect(() => {
    const handleStaffDataUpdate = (event: CustomEvent) => {
      console.log("Staff data updated event received:", event.detail);
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
    services,
    refreshVisibleStaff: fetchVisibleStaff
  };
};
