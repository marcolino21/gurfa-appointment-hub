
import { StaffMember } from '@/types';
import { MOCK_STAFF } from '@/data/mock/staff';

/**
 * Get all staff members for a salon
 */
export const getSalonStaff = (salonId: string): StaffMember[] => {
  // Try to get from localStorage first
  const storedStaff = localStorage.getItem(`staff_${salonId}`);
  
  if (storedStaff) {
    try {
      const parsedStaff = JSON.parse(storedStaff);
      console.log("Retrieved staff from localStorage:", parsedStaff);
      return parsedStaff;
    } catch (error) {
      console.error("Error parsing staff from localStorage:", error);
    }
  }
  
  // Fallback to mock data
  const staffData = MOCK_STAFF[salonId] || [];
  console.log("Using mock staff data:", staffData);
  
  // Store in localStorage for future use
  localStorage.setItem(`staff_${salonId}`, JSON.stringify(staffData));
  
  return staffData;
};

/**
 * Update staff data for a salon
 */
export const updateStaffData = (salonId: string, staffData: StaffMember[]): void => {
  localStorage.setItem(`staff_${salonId}`, JSON.stringify(staffData));
  console.log("Staff data updated for salon:", salonId, staffData);
  
  // Dispatch an event to notify other components that staff data has changed
  const event = new CustomEvent('staffDataUpdated', {
    detail: { 
      salonId,
      type: 'fullUpdate'
    }
  });
  window.dispatchEvent(event);
};

/**
 * Get a single staff member by ID
 */
export const getStaffMember = (salonId: string, staffId: string): StaffMember | null => {
  const staffMembers = getSalonStaff(salonId);
  return staffMembers.find(staff => staff.id === staffId) || null;
};
