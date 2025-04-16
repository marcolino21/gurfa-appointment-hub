
import { useState, useEffect } from 'react';
import { StaffMember, Service } from '@/types';
import { MOCK_SERVICES } from '@/data/mockData';
import { getSalonStaff } from '../utils/staffDataUtils';

/**
 * Hook for managing staff members and services data
 */
export const useStaffMembers = (salonId: string | null) => {
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>(
    getSalonStaff(salonId)
  );
  
  const [services, setServices] = useState<Service[]>(
    salonId ? MOCK_SERVICES[salonId] || [] : []
  );

  // Update staff members when salonId changes
  useEffect(() => {
    if (salonId) {
      setStaffMembers(getSalonStaff(salonId));
      setServices(MOCK_SERVICES[salonId] || []);
    }
  }, [salonId]);

  return { 
    staffMembers, 
    setStaffMembers,
    services 
  };
};
