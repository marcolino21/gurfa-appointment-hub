
import { useState, useEffect } from 'react';
import { StaffMember, Service } from '@/types';
import { MOCK_SERVICES } from '@/data/mockData';
import { getSalonStaff } from '../utils/staffDataUtils';

/**
 * Hook for managing staff members and services data
 */
export const useStaffMembers = (salonId: string | null) => {
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>(
    salonId ? getSalonStaff(salonId) : []
  );
  
  const [services, setServices] = useState<Service[]>(
    salonId ? MOCK_SERVICES[salonId] || [] : []
  );

  // Update staff members when salonId changes
  useEffect(() => {
    if (salonId) {
      const freshData = getSalonStaff(salonId);
      console.log("Staff members refreshed on salonId change:", freshData);
      setStaffMembers(freshData);
      setServices(MOCK_SERVICES[salonId] || []);
    } else {
      setStaffMembers([]);
    }
  }, [salonId]);

  // Listen for custom staffDataUpdated event
  useEffect(() => {
    const handleStaffDataUpdate = (event: CustomEvent) => {
      if (salonId && event.detail.salonId === salonId) {
        const freshData = getSalonStaff(salonId);
        console.log("Staff data updated via event:", freshData);
        setStaffMembers(freshData);
      }
    };

    // Add event listener
    window.addEventListener('staffDataUpdated', handleStaffDataUpdate as EventListener);
    
    // Regular polling as a fallback
    const intervalId = setInterval(() => {
      if (salonId) {
        const freshData = getSalonStaff(salonId);
        if (JSON.stringify(freshData) !== JSON.stringify(staffMembers)) {
          console.log("Staff data updated via polling:", freshData);
          setStaffMembers(freshData);
        }
      }
    }, 2000);
    
    // Clean up
    return () => {
      window.removeEventListener('staffDataUpdated', handleStaffDataUpdate as EventListener);
      clearInterval(intervalId);
    };
  }, [salonId, staffMembers]);

  return { 
    staffMembers, 
    setStaffMembers,
    services 
  };
};
