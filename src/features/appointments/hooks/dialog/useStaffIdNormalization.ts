
export const useStaffIdNormalization = () => {
  const normalizeStaffId = (rawStaffId: any): string | undefined => {
    if (rawStaffId === null || rawStaffId === undefined) {
      return undefined;
    }
    
    if (typeof rawStaffId === 'object' && rawStaffId !== null && 'value' in rawStaffId) {
      return rawStaffId.value === 'undefined' ? undefined : String(rawStaffId.value);
    }
    
    return String(rawStaffId);
  };

  return { normalizeStaffId };
};
