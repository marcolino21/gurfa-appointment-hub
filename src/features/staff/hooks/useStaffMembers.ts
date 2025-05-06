import { useState, useEffect } from 'react';
import { StaffMember, Service } from '@/types';
import { MOCK_SERVICES, MOCK_STAFF } from '@/data/mockData';
import { getSalonStaff } from '../utils/staffDataUtils';
import { useToast } from '@/hooks/use-toast';

/**
 * Hook for managing staff members and services data
 */
export const useStaffMembers = (salonId: string | null) => {
  const { toast } = useToast();
  const safeSalonId = salonId || 'sa1'; // Default a 'sa1' se null
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [services, setServices] = useState<Service[]>(
    safeSalonId ? MOCK_SERVICES[safeSalonId] || [] : []
  );

  // Check if salonId exists and show toast if not
  useEffect(() => {
    if (!safeSalonId) {
      toast({
        title: 'Nessun salone selezionato',
        description: 'Seleziona un salone dall\'header in alto per gestire lo staff',
        variant: 'destructive',
      });
    }
  }, [safeSalonId, toast]);

  // Load staff members when salonId changes
  useEffect(() => {
    const loadStaffMembers = async () => {
      if (safeSalonId) {
        try {
          setIsLoading(true);
          if (!MOCK_STAFF[safeSalonId]) MOCK_STAFF[safeSalonId] = [];
          const data = await getSalonStaff(safeSalonId);
          setStaffMembers(data);
          setServices(MOCK_SERVICES[safeSalonId] || []);
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
  }, [safeSalonId, toast]);

  // Listen for custom staffDataUpdated event
  useEffect(() => {
    const handleStaffDataUpdate = async (event: CustomEvent) => {
      if (safeSalonId && event.detail.salonId === safeSalonId) {
        try {
          const data = await getSalonStaff(safeSalonId);
          setStaffMembers(data);
        } catch (error) {
          console.error("Error refreshing staff data:", error);
        }
      }
    };

    window.addEventListener('staffDataUpdated', handleStaffDataUpdate as unknown as EventListener);
    
    return () => {
      window.removeEventListener('staffDataUpdated', handleStaffDataUpdate as unknown as EventListener);
    };
  }, [safeSalonId]);

  return { 
    staffMembers, 
    setStaffMembers,
    services,
    hasSalon: !!safeSalonId,
    isLoading
  };
};
