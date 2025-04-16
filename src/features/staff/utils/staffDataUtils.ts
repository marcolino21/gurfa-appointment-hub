
import { StaffMember } from '@/types';
import { MOCK_STAFF } from '@/data/mockData';

// Initialize global staff data if not already set
if (!window.globalStaffData) {
  window.globalStaffData = { ...MOCK_STAFF };
  // Store in localStorage as well for persistence
  try {
    const savedData = localStorage.getItem('staffData');
    if (savedData) {
      window.globalStaffData = JSON.parse(savedData);
    } else {
      localStorage.setItem('staffData', JSON.stringify(MOCK_STAFF));
    }
  } catch (error) {
    console.error("Error accessing localStorage:", error);
  }
}

/**
 * Gets staff members for a specific salon
 */
export const getSalonStaff = (salonId: string | null): StaffMember[] => {
  if (!salonId) return [];
  
  // First check in window.globalStaffData
  if (window.globalStaffData && window.globalStaffData[salonId]) {
    return window.globalStaffData[salonId];
  }
  
  // Fallback to localStorage
  try {
    const savedData = localStorage.getItem('staffData');
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      if (parsedData[salonId]) {
        // Update global data
        window.globalStaffData = parsedData;
        return parsedData[salonId];
      }
    }
  } catch (error) {
    console.error("Error accessing localStorage:", error);
  }
  
  // Final fallback to mock data
  return MOCK_STAFF[salonId] || [];
};

/**
 * Updates staff data in both global state and localStorage for persistence
 */
export const updateStaffData = (salonId: string | null, updatedStaff: StaffMember[]): void => {
  if (!salonId) return;
  
  // Update global variable
  if (!window.globalStaffData) {
    window.globalStaffData = {};
  }
  window.globalStaffData[salonId] = updatedStaff;
  
  // Also update localStorage for persistence
  try {
    let savedData = {};
    const existingData = localStorage.getItem('staffData');
    if (existingData) {
      savedData = JSON.parse(existingData);
    }
    
    const updatedData = {
      ...savedData,
      [salonId]: updatedStaff
    };
    
    localStorage.setItem('staffData', JSON.stringify(updatedData));
    console.log("Staff data saved to localStorage:", updatedData);
  } catch (error) {
    console.error("Error saving to localStorage:", error);
  }
  
  // Also update MOCK_STAFF for compatibility
  MOCK_STAFF[salonId] = updatedStaff;
};
