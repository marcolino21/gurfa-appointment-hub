
import { useCallback } from 'react';

export const useStaffIdNormalization = () => {
  /**
   * Normalizes staffId to ensure it's always a proper string or undefined
   */
  const normalizeStaffId = useCallback((staffId: any): string | undefined => {
    // Handle null/undefined
    if (staffId === null || staffId === undefined) {
      console.log("normalizeStaffId: staff ID is null/undefined");
      return undefined;
    }
    
    // Handle object with value property
    if (typeof staffId === 'object' && staffId !== null && 'value' in staffId) {
      console.log(`normalizeStaffId: staff ID is object with value ${staffId.value}`);
      return staffId.value === 'undefined' ? undefined : String(staffId.value);
    }
    
    // Handle array of service entries (take first staffId)
    if (Array.isArray(staffId) && staffId.length > 0) {
      if (staffId[0] && typeof staffId[0] === 'object' && 'staffId' in staffId[0]) {
        const firstStaffId = staffId[0].staffId;
        console.log(`normalizeStaffId: staff ID from array entry: ${firstStaffId}`);
        return firstStaffId ? String(firstStaffId) : undefined;
      }
      return undefined;
    }
    
    // Default: convert to string
    console.log(`normalizeStaffId: staff ID converting to string: ${staffId}`);
    return String(staffId);
  }, []);

  return { normalizeStaffId };
};
