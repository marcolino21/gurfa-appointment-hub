
import { useState, useEffect } from 'react';
import { StaffMember, Service } from '@/types';
import { MOCK_SERVICES } from '@/data/mockData';
import { getSalonStaff } from '../utils/staffDataUtils';
import { useToast } from '@/hooks/use-toast';

/**
 * Hook for managing staff members and services data
 */
export const useStaffMembers = (salonId: string | null) => {
  const { toast } = useToast();
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [services, setServices] = useState<Service[]>(
    salonId ? MOCK_SERVICES[salonId] || [] : []
  );

  // Check if salonId exists and show toast if not
  useEffect(() => {
    if (!salonId) {
      toast({
        title: 'Nessun salone selezionato',
        description: 'Seleziona un salone dall\'header in alto per gestire lo staff',
        variant: 'destructive',
      });
    }
  }, [salonId, toast]);

  // Load staff members when salonId changes
  useEffect(() => {
    const loadStaffMembers = async () => {
      if (salonId) {
        try {
          setIsLoading(true);
          const data = await getSalonStaff(salonId);
          setStaffMembers(data);
          setServices(MOCK_SERVICES[salonId] || []);
        } catch (error) {
          console.error("Error loading staff members:", error);
          toast({
            title: 'Errore',
            description: 'Impossibile caricare i membri dello staff',
            variant: 'destructive',
          });
        } finally {
          setIsLoading(false);
        }
      } else {
        setStaffMembers([]);
        setIsLoading(false);
      }
    };

    loadStaffMembers();
  }, [salonId, toast]);

  // Listen for custom staffDataUpdated event
  useEffect(() => {
    const handleStaffDataUpdate = async (event: CustomEvent) => {
      if (salonId && event.detail.salonId === salonId) {
        try {
          const data = await getSalonStaff(salonId);
          setStaffMembers(data);
        } catch (error) {
          console.error("Error refreshing staff data:", error);
        }
      }
    };

    window.addEventListener('staffDataUpdated', handleStaffDataUpdate as EventListener);
    
    return () => {
      window.removeEventListener('staffDataUpdated', handleStaffDataUpdate as EventListener);
    };
  }, [salonId]);

  return { 
    staffMembers, 
    setStaffMembers,
    services,
    hasSalon: !!salonId,
    isLoading
  };
};
