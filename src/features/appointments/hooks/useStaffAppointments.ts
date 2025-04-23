
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
  
  // Contesto e refs
  const { currentSalonId } = useAuth();
  const mounted = useRef(true);
  const lastSalonId = useRef<string | null>(null);
  
  // Funzione per caricare lo staff visibile
  const loadStaff = useCallback(() => {
    if (!mounted.current || !currentSalonId) return;
    
    // Previeni caricamenti ripetuti dello stesso salone
    if (lastSalonId.current === currentSalonId) return;
    
    console.log('Loading staff for salon:', currentSalonId);
    
    // Traccia il salone attuale
    lastSalonId.current = currentSalonId;
    
    // Imposta lo stato di caricamento
    setIsLoading(true);
    
    // Simuliamo il fetch dei dati
    setTimeout(() => {
      if (!mounted.current) return;
      
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
        // Completa il caricamento
        if (mounted.current) {
          setIsLoading(false);
        }
      }
    }, 500); // Tempo sufficiente per la stabilità
  }, [currentSalonId]);
  
  // Effetto per il primo caricamento e quando cambia il salone
  useEffect(() => {
    // Resetta il ref mounted
    mounted.current = true;
    
    // Carica lo staff se abbiamo un salone
    if (currentSalonId) {
      loadStaff();
    } else {
      // Reset se non c'è un salone selezionato
      setVisibleStaff([]);
      lastSalonId.current = null;
    }
    
    // Cleanup quando il componente viene smontato
    return () => {
      mounted.current = false;
    };
  }, [currentSalonId, loadStaff]);
  
  // Funzione manuale per ricaricare lo staff
  const refreshVisibleStaff = useCallback(() => {
    // Reset del lastSalonId per forzare un nuovo caricamento
    lastSalonId.current = null;
    loadStaff();
  }, [loadStaff]);
  
  return {
    visibleStaff,
    isLoading,
    refreshVisibleStaff
  };
};
