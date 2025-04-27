
import { StaffMember, Service } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useState, useCallback } from 'react';

export const useDefaultResources = (visibleStaff: StaffMember[], services: Service[]) => {
  const { currentSalonId } = useAuth();
  const [displayedStaff, setDisplayedStaff] = useState<StaffMember[]>([]);
  const [displayedServices, setDisplayedServices] = useState<Service[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Funzione che aggiorna le risorse visualizzate
  const updateDisplayedResources = useCallback(() => {
    // Crea sempre gli operatori disponibili, privilegiando quelli reali quando disponibili
    const staffToUse = visibleStaff && visibleStaff.length > 0 ? visibleStaff : [
      {
        id: 'default-staff-1',
        firstName: 'Operatore',
        lastName: 'Predefinito',
        email: 'operatore@esempio.it',
        isActive: true,
        showInCalendar: true,
        salonId: currentSalonId || 'default'
      }
    ];
    
    // Crea sempre i servizi disponibili, privilegiando quelli reali quando disponibili
    const servicesToUse = services && services.length > 0 ? services : [
      { 
        id: 'default-service-1',
        name: 'Servizio Generico',
        category: 'default',
        description: 'Servizio predefinito',
        duration: 30,
        tempoDiPosa: 0,
        price: 30,
        color: '#9b87f5',
        salonId: currentSalonId || 'default',
        assignedServiceIds: []
      }
    ];
    
    console.log("Setting up default resources:", {
      staff: staffToUse.length, 
      services: servicesToUse.length
    });

    setDisplayedStaff(staffToUse);
    setDisplayedServices(servicesToUse);
    setIsLoaded(true);
  }, [visibleStaff, services, currentSalonId]);

  // Aggiorna le risorse quando cambiano i dati di input
  useEffect(() => {
    updateDisplayedResources();
  }, [visibleStaff, services, currentSalonId, updateDisplayedResources]);

  // Forza l'aggiornamento delle risorse su richiesta
  const refreshResources = () => {
    updateDisplayedResources();
  };
  
  return {
    displayedStaff,
    displayedServices,
    isLoaded,
    refreshResources
  };
};
