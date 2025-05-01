import { useState, useEffect } from 'react';
import { StaffMember } from '../../staff/types';
import { useStaffMembers } from '../../staff/hooks/useStaffMembers';

interface StaffResource {
  id: string;
  name: string;
  color?: string;
  isVisible?: boolean;
  workingHours?: {
    start: string;
    end: string;
  };
  daysOff?: string[];
}

export const useStaffResources = () => {
  const [resources, setResources] = useState<StaffResource[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { staffMembers, isLoading: isLoadingStaff } = useStaffMembers('current');

  useEffect(() => {
    if (!isLoadingStaff) {
      try {
        const transformedResources = staffMembers
          .filter(member => member.isActive)
          .map(member => ({
            id: member.id,
            name: member.name,
            color: member.color,
            isVisible: member.isActive,
            workingHours: member.workingHours?.[0] || undefined,
            daysOff: member.daysOff
          }));
        
        setResources(transformedResources);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Errore nella trasformazione delle risorse'));
      } finally {
        setIsLoading(false);
      }
    }
  }, [staffMembers, isLoadingStaff]);

  return { resources, isLoading, error };
}; 