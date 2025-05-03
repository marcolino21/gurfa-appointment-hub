import { useState, useEffect } from 'react';
import { StaffResource } from '../types/appointment';

export const useStaffResources = (businessId: string) => {
  const [resources, setResources] = useState<StaffResource[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchResources = async () => {
      try {
        setIsLoading(true);
        // TODO: Implement API call to fetch staff resources
        const mockResources: StaffResource[] = [
          {
            id: '1',
            title: 'Operatore 1'
          },
          {
            id: '2',
            title: 'Operatore 2'
          }
        ];
        setResources(mockResources);
      } catch (error) {
        console.error('Error fetching staff resources:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchResources();
  }, [businessId]);

  return { resources, isLoading };
}; 