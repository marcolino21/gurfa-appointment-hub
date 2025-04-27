
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
    
    // Handle object with value property (like Select component value)
    if (typeof staffId === 'object' && staffId !== null && 'value' in staffId) {
      console.log(`normalizeStaffId: staff ID is object with value ${staffId.value}`);
      return staffId.value === 'undefined' || staffId.value === null || staffId.value === '' 
        ? undefined 
        : String(staffId.value);
    }
    
    // Handle string that contains "undefined" or is empty
    if (typeof staffId === 'string') {
      if (staffId === 'undefined' || staffId === 'null' || staffId.trim() === '') {
        return undefined;
      }
      return staffId.trim();
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
    
    // Default: convert to string if not empty
    console.log(`normalizeStaffId: staff ID converting to string: ${staffId}`);
    const stringValue = String(staffId);
    return stringValue === 'undefined' || stringValue === 'null' || stringValue === '' ? undefined : stringValue;
  }, []);

  return { normalizeStaffId };
};
