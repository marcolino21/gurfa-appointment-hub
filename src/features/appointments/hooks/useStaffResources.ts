import { useState, useEffect } from 'react';
import { StaffResource } from '../types';
import { useStaffMembers } from '../../staff/hooks/useStaffMembers';

export const useStaffResources = () => {
  const [resources, setResources] = useState<StaffResource[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const { staffMembers, isLoading: isLoadingStaff, error: staffError } = useStaffMembers();

  useEffect(() => {
    if (!isLoadingStaff && !staffError) {
      try {
        const formattedResources = staffMembers
          .filter(member => member.isActive)
          .map(member => ({
            id: member.id,
            name: member.name,
            color: member.color || '#3b82f6',
            workingHours: {
              start: '09:00',
              end: '18:00'
            },
            daysOff: []
          }));

        setResources(formattedResources);
        setIsLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to format staff resources'));
        setIsLoading(false);
      }
    } else if (staffError) {
      setError(staffError);
      setIsLoading(false);
    }
  }, [staffMembers, isLoadingStaff, staffError]);

  return { resources, isLoading, error };
}; 