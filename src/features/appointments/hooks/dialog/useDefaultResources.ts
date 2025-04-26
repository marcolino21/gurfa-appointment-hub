
import { StaffMember, Service } from '@/types';
import { useAuth } from '@/contexts/AuthContext';

export const useDefaultResources = (visibleStaff: StaffMember[], services: Service[]) => {
  const { currentSalonId } = useAuth();

  const displayedStaff: StaffMember[] = visibleStaff && visibleStaff.length > 0 ? visibleStaff : [
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

  const displayedServices: Service[] = services && services.length > 0 ? services : [
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

  return {
    displayedStaff,
    displayedServices
  };
};
