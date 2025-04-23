
import { useState, useEffect, useCallback } from 'react';
import { StaffMember } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { SYSTEM_FEATURES } from '@/features/staff/types/permissions';

// Nota: questo è un mock per simulare il caricamento dello staff da un'API
const mockStaffMembers: StaffMember[] = [
  {
    id: 'staff-1',
    firstName: 'Marco',
    lastName: 'Rossi',
    email: 'marco.rossi@example.com',
    phone: '+39123456789',
    position: 'stylist',
    salonId: 'salon-1',
    color: '#3b82f6',
    permissions: [],
    workSchedule: [],
    assignedServiceIds: [],
    showInCalendar: true,
    isActive: true
  },
  {
    id: 'staff-2',
    firstName: 'Martina',
    lastName: 'Bianchi',
    email: 'martina.bianchi@example.com',
    phone: '+39987654321',
    position: 'colorist',
    salonId: 'salon-1',
    color: '#ef4444',
    permissions: [],
    workSchedule: [],
    assignedServiceIds: [],
    showInCalendar: true,
    isActive: true
  },
  // Staff per altri saloni
  {
    id: 'staff-3',
    firstName: 'Luca',
    lastName: 'Verdi',
    email: 'luca.verdi@example.com',
    phone: '+39123123123',
    position: 'barber',
    salonId: 'salon-2',
    color: '#10b981',
    permissions: [],
    workSchedule: [],
    assignedServiceIds: [],
    showInCalendar: true,
    isActive: true
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
          staff => staff.salonId === currentSalonId && staff.showInCalendar
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
            position: 'stylist',
            salonId: currentSalonId,
            color: '#9333ea',
            permissions: [],
            workSchedule: [],
            assignedServiceIds: [],
            showInCalendar: true,
            isActive: true
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
