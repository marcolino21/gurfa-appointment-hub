
import { useState, useEffect, useCallback, useRef } from 'react';
import { StaffMember } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { SYSTEM_FEATURES } from '@/features/staff/types/permissions';

// Mock data for staff members
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
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isFirstRender = useRef(true);
  const isUpdatingRef = useRef(false);
  const previousSalonIdRef = useRef<string | null>(null);

  // Funzione per ottenere lo staff visibile in base al salone corrente
  const refreshVisibleStaff = useCallback(() => {
    // Previeni esecuzioni multiple o durante aggiornamenti attivi
    if (isLoading || isUpdatingRef.current) return;
    
    // Evita aggiornamenti se il salonId è lo stesso di prima e abbiamo già staff
    if (currentSalonId === previousSalonIdRef.current && visibleStaff.length > 0) {
      console.log('Skipping staff refresh - same salon and staff exists');
      return;
    }
    
    console.log('Refreshing visible staff for salonId:', currentSalonId);
    setIsLoading(true);
    isUpdatingRef.current = true;
    previousSalonIdRef.current = currentSalonId;
    
    // Pulizia del timeout precedente se esiste
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    try {
      // Simuliamo una chiamata API con un timeout più lungo per stabilità
      timeoutRef.current = setTimeout(() => {
        if (!currentSalonId) {
          console.warn('No salon selected, cannot load staff');
          setVisibleStaff([]);
          setIsLoading(false);
          isUpdatingRef.current = false;
          timeoutRef.current = null;
          return;
        }

        // Filtra lo staff visibile per il salone corrente
        const filteredStaff = mockStaffMembers.filter(
          staff => staff.salonId === currentSalonId && staff.showInCalendar
        );
        
        console.log(`Found ${filteredStaff.length} visible staff members for salon ${currentSalonId}`);
        
        // Aggiorna lo stato in modo sicuro
        setVisibleStaff(prevStaff => {
          // Confronta gli ID per determinare se c'è un cambiamento reale
          const prevIds = new Set(prevStaff.map(s => s.id));
          const newIds = new Set(filteredStaff.map(s => s.id));
          
          const hasChanged = 
            prevStaff.length !== filteredStaff.length || 
            ![...prevIds].every(id => newIds.has(id));
          
          if (hasChanged) {
            // Se non ci sono staff visibili, crea uno staff demo
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
              
              return [demoStaff];
            }
            
            return filteredStaff;
          }
          
          // Se non ci sono cambiamenti, non aggiornare lo stato
          return prevStaff;
        });
        
        // Imposta un timeout differito per completare il caricamento
        setTimeout(() => {
          setIsLoading(false);
          isUpdatingRef.current = false;
          timeoutRef.current = null;
        }, 50);
      }, 300);
    } catch (error) {
      console.error('Error loading staff:', error);
      setIsLoading(false);
      isUpdatingRef.current = false;
      timeoutRef.current = null;
    }
  }, [currentSalonId, isLoading, visibleStaff.length]);

  // Carica lo staff quando cambia il salone selezionato
  useEffect(() => {
    // Aggiornamento solo se c'è un salonId o se non è il primo render
    if (currentSalonId || !isFirstRender.current) {
      const debounceTimeout = setTimeout(() => {
        refreshVisibleStaff();
      }, 100);
      
      return () => {
        clearTimeout(debounceTimeout);
      };
    }
    
    isFirstRender.current = false;
  }, [currentSalonId, refreshVisibleStaff]);

  // Pulizia globale quando il componente viene smontato
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, []);

  return {
    visibleStaff,
    isLoading,
    refreshVisibleStaff
  };
};
