
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
      console.log("Staff members refreshed:", freshData);
      setStaffMembers(freshData);
      setServices(MOCK_SERVICES[salonId] || []);
    } else {
      setStaffMembers([]);
    }
  }, [salonId]);

  // Add a second effect to check for changes in global data
  useEffect(() => {
    // Only set up the interval if we have a salonId
    if (!salonId) return;

    const checkForUpdates = () => {
      const freshData = getSalonStaff(salonId);
      if (JSON.stringify(freshData) !== JSON.stringify(staffMembers)) {
        setStaffMembers(freshData);
      }
    };

    // Check for updates every second
    const intervalId = setInterval(checkForUpdates, 1000);
    
    // Clean up the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, [salonId, staffMembers]);

  return { 
    staffMembers, 
    setStaffMembers,
    services 
  };
};
