
import { StaffMember } from '@/types';
import { MOCK_STAFF } from '@/data/mockData';

// Initialize global staff data if not already set
if (!window.globalStaffData) {
  window.globalStaffData = { ...MOCK_STAFF };
}

/**
 * Gets staff members for a specific salon
 */
export const getSalonStaff = (salonId: string | null): StaffMember[] => {
  if (!salonId) return [];
  return window.globalStaffData[salonId] || [];
};

/**
 * Updates staff data in both global state and MOCK_STAFF for compatibility
 */
export const updateStaffData = (salonId: string | null, updatedStaff: StaffMember[]): void => {
  if (!salonId) return;
  
  // Update global variable
  window.globalStaffData[salonId] = updatedStaff;
  
  // Also update MOCK_STAFF for compatibility
  MOCK_STAFF[salonId] = updatedStaff;
};
