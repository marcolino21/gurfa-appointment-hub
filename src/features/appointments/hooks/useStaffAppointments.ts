
import { useState, useEffect, useCallback } from 'react';
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
  const { toast } = useToast();
  
  // Function to get visible staff and services
  const fetchVisibleStaff = useCallback(async () => {
    if (currentSalonId) {
      try {
        // Get staff from the database
        const allStaff = await getSalonStaff(currentSalonId);
        
        console.log("All staff members:", allStaff);
        
        // Solo membri dello staff attivi e impostati come visibili in agenda
        // CORREZIONE: Ora mostriamo tutti gli staff attivi per default
        const staffVisibleInCalendar = allStaff.filter(staff => 
          staff.isActive && (staff.showInCalendar !== false)
        );
        
        console.log("Staff visible in calendar:", staffVisibleInCalendar);
        
        if (staffVisibleInCalendar.length === 0 && allStaff.length > 0) {
          console.warn("No staff members are set to be visible in calendar");
          
          // Mostriamo un toast solo se ci sono membri dello staff ma nessuno è visibile
          if (allStaff.length > 0) {
            toast({
              title: "Nessun operatore visibile nel calendario",
              description: "Vai alla pagina Staff e seleziona 'Visibile in agenda' per gli operatori",
            });
          }
        }
        
        setVisibleStaff(staffVisibleInCalendar);
        
        // Load services from mock data
        const salonServices = MOCK_SERVICES[currentSalonId] || [];
        console.log("Loaded services for salon:", currentSalonId, salonServices);
        setServices(salonServices);
      } catch (error) {
        console.error("Error fetching visible staff:", error);
        toast({
          title: "Errore",
          description: "Impossibile caricare gli operatori",
          variant: "destructive",
        });
      }
    } else {
      console.log("No currentSalonId available");
      setVisibleStaff([]);
      setServices([]);
    }
  }, [currentSalonId, toast]);
  
  // Initial load and react to currentSalonId changes
  useEffect(() => {
    console.log("useStaffAppointments - currentSalonId:", currentSalonId);
    fetchVisibleStaff();
  }, [fetchVisibleStaff, currentSalonId]);
  
  // Listen for staff data updates
  useEffect(() => {
    const handleStaffDataUpdate = (event: CustomEvent) => {
      console.log("Staff data updated event received:", event.detail);
      if (currentSalonId && event.detail.salonId === currentSalonId) {
        fetchVisibleStaff();
      }
    };

    // Listen to any staff changes
    window.addEventListener('staffDataUpdated', handleStaffDataUpdate as EventListener);
    
    // Also listen to business name changes as a trigger to recheck staff
    window.addEventListener(BUSINESS_NAME_CHANGE_EVENT, fetchVisibleStaff as EventListener);
    
    // Clean up
    return () => {
      window.removeEventListener('staffDataUpdated', handleStaffDataUpdate as EventListener);
      window.removeEventListener(BUSINESS_NAME_CHANGE_EVENT, fetchVisibleStaff as EventListener);
    };
  }, [currentSalonId, fetchVisibleStaff]);

  return { 
    visibleStaff,
    services,
    refreshVisibleStaff: fetchVisibleStaff
  };
};
