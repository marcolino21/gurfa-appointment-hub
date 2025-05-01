import { useState, useEffect } from 'react';
import { StaffResource } from '../types';
import { useStaffMembers } from '../../staff/hooks/useStaffMembers';

const mockStaffMembers = [
  {
    id: '1',
    name: 'Maria Rossi',
    email: 'maria.rossi@example.com',
    phone: '1234567890',
    color: '#3b82f6',
    isActive: true
  },
  {
    id: '2',
    name: 'Giuseppe Verdi',
    email: 'giuseppe.verdi@example.com',
    phone: '0987654321',
    color: '#f59e0b',
    isActive: true
  }
];

export const useStaffResources = (salonId: string | null) => {
  const [resources, setResources] = useState<StaffResource[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const { staffMembers = mockStaffMembers, isLoading: isLoadingStaff } = useStaffMembers(salonId);

  useEffect(() => {
    if (!isLoadingStaff) {
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
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to format staff resources'));
      } finally {
        setIsLoading(false);
      }
    }
  }, [staffMembers, isLoadingStaff]);

  return { resources, isLoading, error };
}; 