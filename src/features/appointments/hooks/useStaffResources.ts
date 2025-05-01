import { useState, useEffect } from 'react';
import { StaffResource } from '../types';

export const useStaffResources = () => {
  const [resources, setResources] = useState<StaffResource[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchStaffResources = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/staff');
        const data = await response.json();

        const transformedResources = data.map((staff: any) => ({
          id: staff.id,
          name: staff.name,
          workingHours: staff.workingHours || {
            start: '09:00',
            end: '18:00',
          },
          daysOff: staff.daysOff || [],
          color: staff.color || '#3b82f6',
        }));

        setResources(transformedResources);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Errore nel caricamento delle risorse staff'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchStaffResources();
  }, []);

  return { resources, isLoading, error };
}; 