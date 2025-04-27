
import { StaffMember, Service } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useState } from 'react';

export const useDefaultResources = (visibleStaff: StaffMember[], services: Service[]) => {
  const { currentSalonId } = useAuth();
  const [displayedStaff, setDisplayedStaff] = useState<StaffMember[]>([]);
  const [displayedServices, setDisplayedServices] = useState<Service[]>([]);

  useEffect(() => {
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
    
  }, [visibleStaff, services, currentSalonId]);

  return {
    displayedStaff,
    displayedServices
  };
};
