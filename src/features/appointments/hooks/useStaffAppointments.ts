
import { useState, useEffect, useCallback } from 'react';
import { StaffMember } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { SYSTEM_FEATURES } from '@/features/staff/types/permissions';
import { toast } from '@/components/ui/use-toast';

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

// Funzione di utilità per creare uno staff demo
const createDemoStaff = (salonId: string): StaffMember => ({
  id: `staff-demo-${salonId}`,
  firstName: 'Demo',
  lastName: 'Staff',
  email: 'demo.staff@example.com',
  phone: '+39000000000',
  position: 'stylist',
  salonId: salonId,
  color: '#9333ea',
  permissions: [],
  workSchedule: [],
  assignedServiceIds: [],
  showInCalendar: true,
  isActive: true
});

export const useStaffAppointments = () => {
  // Stati principali
  const [visibleStaff, setVisibleStaff] = useState<StaffMember[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { currentSalonId } = useAuth();
  
  // Funzione per caricare lo staff visibile
  const refreshVisibleStaff = useCallback(() => {
    if (!currentSalonId) {
      console.warn('Cannot refresh staff - no salon selected');
      setVisibleStaff([]);
      return;
    }
    
    console.log('Refreshing staff for salon:', currentSalonId);
    setIsLoading(true);
    
    // Use requestAnimationFrame to ensure we don't block the main thread
    requestAnimationFrame(() => {
      try {
        // Filtra lo staff per il salone corrente
        const salonStaff = mockStaffMembers.filter(
          staff => staff.salonId === currentSalonId && staff.showInCalendar
        );
        
        console.log(`Found ${salonStaff.length} visible staff members`);
        
        // Se non ci sono risultati, usa uno staff demo
        if (salonStaff.length === 0) {
          console.log('No staff found, using demo staff');
          setVisibleStaff([createDemoStaff(currentSalonId)]);
        } else {
          setVisibleStaff(salonStaff);
        }
      } catch (error) {
        console.error('Error loading staff:', error);
        // In caso di errore, mostra uno staff demo comunque
        setVisibleStaff([createDemoStaff(currentSalonId)]);
      } finally {
        setIsLoading(false);
      }
    });
  }, [currentSalonId]);
  
  // Effetto per il primo caricamento e quando cambia il salone
  useEffect(() => {
    let isMounted = true;
    
    if (currentSalonId) {
      console.log('Salon ID changed, loading staff');
      setIsLoading(true);
      
      // Use setTimeout with 0 delay to defer execution to next tick
      const timerId = setTimeout(() => {
        if (!isMounted) return;
        
        try {
          // Filtra lo staff per il salone corrente
          const salonStaff = mockStaffMembers.filter(
            staff => staff.salonId === currentSalonId && staff.showInCalendar
          );
          
          if (salonStaff.length === 0) {
            setVisibleStaff([createDemoStaff(currentSalonId)]);
            
            // Show toast notification for no visible staff
            if (isMounted) {
              toast({
                title: "Nessuno staff visibile",
                description: "Vai alla pagina Staff e seleziona 'Visibile in agenda' per i membri che vuoi visualizzare.",
                variant: "default"
              });
            }
          } else {
            setVisibleStaff(salonStaff);
          }
        } catch (error) {
          console.error('Error loading staff:', error);
          setVisibleStaff([createDemoStaff(currentSalonId)]);
        } finally {
          if (isMounted) {
            setIsLoading(false);
          }
        }
      }, 0);
      
      return () => {
        isMounted = false;
        clearTimeout(timerId);
      };
    } else {
      // Reset se non c'è un salone selezionato
      setVisibleStaff([]);
    }
    
    return () => {
      isMounted = false;
    };
  }, [currentSalonId]);
  
  return {
    visibleStaff,
    isLoading,
    refreshVisibleStaff
  };
};
