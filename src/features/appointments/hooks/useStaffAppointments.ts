
import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { StaffMember, Service } from '@/types';
import { getSalonStaff } from '@/features/staff/utils/staffDataUtils';
import { BUSINESS_NAME_CHANGE_EVENT } from '@/utils/businessNameEvents';
import { useToast } from '@/hooks/use-toast';
import { MOCK_SERVICES } from '@/data/mock/services';

export const useStaffAppointments = () => {
  const { currentSalonId } = useAuth();
  const [visibleStaff, setVisibleStaff] = useState<StaffMember[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toast } = useToast();
  
  // Refs to control updates
  const isUpdatingRef = useRef<boolean>(false);
  const previousSalonIdRef = useRef<string | null>(null);
  const mountedRef = useRef<boolean>(true);
  
  // Function to get visible staff and services
  const fetchVisibleStaff = useCallback(async () => {
    // Prevent multiple calls or if salon hasn't changed
    if (isUpdatingRef.current || currentSalonId === previousSalonIdRef.current) {
      return;
    }
    
    // Update ref to indicate update in progress
    isUpdatingRef.current = true;
    setIsLoading(true);
    
    if (currentSalonId) {
      try {
        console.log("Fetching staff for salon:", currentSalonId);
        previousSalonIdRef.current = currentSalonId;
        
        // Get staff from the database
        const allStaff = await getSalonStaff(currentSalonId);
        
        // Verify component is still mounted
        if (!mountedRef.current) return;
        
        // Only active staff members set as visible in calendar
        const staffVisibleInCalendar = allStaff.filter(staff => 
          staff.isActive && (staff.showInCalendar !== false)
        );
        
        if (staffVisibleInCalendar.length === 0 && allStaff.length > 0) {
          console.warn("No staff members are set to be visible in calendar");
          
          // Show toast only if there are staff members but none visible
          if (mountedRef.current) {
            toast({
              title: "Nessun operatore visibile nel calendario",
              description: "Vai alla pagina Staff e seleziona 'Visibile in agenda' per gli operatori",
            });
          }
        }
        
        if (mountedRef.current) {
          setVisibleStaff(staffVisibleInCalendar);
          
          // Load services from mock data
          const salonServices = MOCK_SERVICES[currentSalonId] || [];
          setServices(salonServices);
        }
      } catch (error) {
        console.error("Error fetching visible staff:", error);
        if (mountedRef.current) {
          toast({
            title: "Errore",
            description: "Impossibile caricare gli operatori",
            variant: "destructive",
          });
        }
      } finally {
        // Cleanup state only if component is still mounted
        if (mountedRef.current) {
          setIsLoading(false);
        }
        
        // Wait briefly before allowing further updates
        setTimeout(() => {
          isUpdatingRef.current = false;
        }, 100);
      }
    } else {
      // No salon ID
      if (mountedRef.current) {
        setVisibleStaff([]);
        setServices([]);
        setIsLoading(false);
      }
      isUpdatingRef.current = false;
    }
  }, [currentSalonId, toast]);
  
  // Initial load
  useEffect(() => {
    mountedRef.current = true;
    
    const timerId = setTimeout(() => {
      if (mountedRef.current) {
        fetchVisibleStaff();
      }
    }, 50);
    
    return () => {
      mountedRef.current = false;
      clearTimeout(timerId);
    };
  }, [fetchVisibleStaff]);
  
  // Single listener for all events requiring update
  useEffect(() => {
    const handleUpdate = (event: Event | CustomEvent) => {
      if (!isUpdatingRef.current && mountedRef.current) {
        // For CustomEvent with detail
        if ('detail' in event && event.detail && currentSalonId) {
          if (event.detail.salonId !== currentSalonId) {
            return; // Ignore events from other salons
          }
        }
        
        // Debounce to prevent too frequent updates
        setTimeout(() => {
          if (mountedRef.current) {
            fetchVisibleStaff();
          }
        }, 100);
      }
    };
    
    // Register listeners
    window.addEventListener('staffDataUpdated', handleUpdate);
    window.addEventListener(BUSINESS_NAME_CHANGE_EVENT, handleUpdate);
    
    return () => {
      window.removeEventListener('staffDataUpdated', handleUpdate);
      window.removeEventListener(BUSINESS_NAME_CHANGE_EVENT, handleUpdate);
    };
  }, [currentSalonId, fetchVisibleStaff]);
  
  return { 
    visibleStaff,
    services,
    isLoading,
    refreshVisibleStaff: fetchVisibleStaff
  };
};
