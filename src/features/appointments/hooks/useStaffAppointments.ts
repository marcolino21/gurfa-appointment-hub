
import { useState, useEffect, useCallback } from 'react';
import { StaffMember } from '@/types';
import { useAuth } from '@/contexts/AuthContext';

// Nota: questo è un mock per simulare il caricamento dello staff da un'API
const mockStaffMembers: StaffMember[] = [
  {
    id: 'staff-1',
    firstName: 'Marco',
    lastName: 'Rossi',
    email: 'marco.rossi@example.com',
    phone: '+39123456789',
    role: 'stylist',
    salonId: 'salon-1',
    color: '#3b82f6',
    permissions: {},
    schedule: {},
    services: [],
    isVisibleInCalendar: true,
  },
  {
    id: 'staff-2',
    firstName: 'Martina',
    lastName: 'Bianchi',
    email: 'martina.bianchi@example.com',
    phone: '+39987654321',
    role: 'colorist',
    salonId: 'salon-1',
    color: '#ef4444',
    permissions: {},
    schedule: {},
    services: [],
    isVisibleInCalendar: true,
  },
  // Staff per altri saloni
  {
    id: 'staff-3',
    firstName: 'Luca',
    lastName: 'Verdi',
    email: 'luca.verdi@example.com',
    phone: '+39123123123',
    role: 'barber',
    salonId: 'salon-2',
    color: '#10b981',
    permissions: {},
    schedule: {},
    services: [],
    isVisibleInCalendar: true,
  },
];

export const useStaffAppointments = () => {
  const [visibleStaff, setVisibleStaff] = useState<StaffMember[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { currentSalonId } = useAuth();

  // Funzione per ottenere lo staff visibile in base al salone corrente
  const refreshVisibleStaff = useCallback(() => {
    console.log('Refreshing visible staff for salonId:', currentSalonId);
    setIsLoading(true);
    
    try {
      // Simuliamo una chiamata API
      setTimeout(() => {
        if (!currentSalonId) {
          console.warn('No salon selected, cannot load staff');
          setVisibleStaff([]);
          setIsLoading(false);
          return;
        }

        // Filtra lo staff visibile per il salone corrente
        const filteredStaff = mockStaffMembers.filter(
          staff => staff.salonId === currentSalonId && staff.isVisibleInCalendar
        );
        
        console.log(`Found ${filteredStaff.length} visible staff members for salon ${currentSalonId}`);
        setVisibleStaff(filteredStaff);
        
        // Se non ci sono staff visibili per questo salone, creiamone uno per evitare pagina vuota
        if (filteredStaff.length === 0) {
          console.log('No visible staff found, creating demo staff');
          const demoStaff: StaffMember = {
            id: `staff-demo-${currentSalonId}`,
            firstName: 'Demo',
            lastName: 'Staff',
            email: 'demo.staff@example.com',
            phone: '+39000000000',
            role: 'stylist',
            salonId: currentSalonId,
            color: '#9333ea',
            permissions: {},
            schedule: {},
            services: [],
            isVisibleInCalendar: true,
          };
          
          setVisibleStaff([demoStaff]);
        }
        
        setIsLoading(false);
      }, 500);
    } catch (error) {
      console.error('Error loading staff:', error);
      setIsLoading(false);
    }
  }, [currentSalonId]);

  // Carica lo staff quando cambia il salone selezionato
  useEffect(() => {
    if (currentSalonId) {
      refreshVisibleStaff();
    }
  }, [currentSalonId, refreshVisibleStaff]);

  return {
    visibleStaff,
    isLoading,
    refreshVisibleStaff
  };
};
