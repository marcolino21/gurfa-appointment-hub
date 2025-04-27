
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
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { toast } = useToast();
  
  // Refs per controllare gli aggiornamenti
  const isUpdatingRef = useRef<boolean>(false);
  const previousSalonIdRef = useRef<string | null>(null);
  const mountedRef = useRef<boolean>(true);
  const initialized = useRef<boolean>(false);
  
  // Funzione per ottenere staff e servizi visibili
  const fetchVisibleStaff = useCallback(async (forceRefresh: boolean = false) => {
    // Previene chiamate multiple o se il salone non è cambiato e non è forzato l'aggiornamento
    if (isUpdatingRef.current || (!forceRefresh && currentSalonId === previousSalonIdRef.current && initialized.current)) {
      return;
    }
    
    // Aggiorna il ref per indicare che è in corso un aggiornamento
    isUpdatingRef.current = true;
    setIsLoading(true);
    
    if (currentSalonId) {
      try {
        console.log("Fetching staff for salon:", currentSalonId);
        previousSalonIdRef.current = currentSalonId;
        initialized.current = true;
        
        // Ottieni staff dal database
        const allStaff = await getSalonStaff(currentSalonId);
        
        // Verifica che il componente sia ancora montato
        if (!mountedRef.current) return;
        
        // Solo i membri dello staff attivi e impostati come visibili nel calendario
        const staffVisibleInCalendar = allStaff.filter(staff => 
          staff.isActive && (staff.showInCalendar !== false)
        );
        
        if (staffVisibleInCalendar.length === 0 && allStaff.length > 0) {
          console.warn("No staff members are set to be visible in calendar");
          
          // Mostra toast solo se ci sono membri dello staff ma nessuno visibile
          if (mountedRef.current) {
            toast({
              title: "Nessun operatore visibile nel calendario",
              description: "Vai alla pagina Staff e seleziona 'Visibile in agenda' per gli operatori",
            });
          }
        }
        
        if (mountedRef.current) {
          setVisibleStaff(staffVisibleInCalendar);
          
          // Carica servizi dai dati simulati
          const salonServices = MOCK_SERVICES[currentSalonId] || [];
          setServices(salonServices);
          
          console.log("Loaded staff:", staffVisibleInCalendar.length);
          console.log("Loaded services:", salonServices.length);
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
        // Pulisce lo stato solo se il componente è ancora montato
        if (mountedRef.current) {
          setIsLoading(false);
        }
        
        // Attendi brevemente prima di consentire ulteriori aggiornamenti
        setTimeout(() => {
          isUpdatingRef.current = false;
        }, 100);
      }
    } else {
      // Nessun ID salone
      if (mountedRef.current) {
        setVisibleStaff([]);
        setServices([]);
        setIsLoading(false);
      }
      isUpdatingRef.current = false;
    }
  }, [currentSalonId, toast]);
  
  // Caricamento iniziale
  useEffect(() => {
    mountedRef.current = true;
    
    const timerId = setTimeout(() => {
      if (mountedRef.current) {
        fetchVisibleStaff(true);
      }
    }, 50);
    
    return () => {
      mountedRef.current = false;
      clearTimeout(timerId);
    };
  }, [fetchVisibleStaff]);
  
  // Listener unico per tutti gli eventi che richiedono aggiornamento
  useEffect(() => {
    const handleUpdate = (event: Event | CustomEvent) => {
      if (!isUpdatingRef.current && mountedRef.current) {
        // Per CustomEvent con detail
        if ('detail' in event && event.detail && currentSalonId) {
          if (event.detail.salonId !== currentSalonId) {
            return; // Ignora eventi da altri saloni
          }
        }
        
        // Debounce per prevenire aggiornamenti troppo frequenti
        setTimeout(() => {
          if (mountedRef.current) {
            fetchVisibleStaff(true);
          }
        }, 100);
      }
    };
    
    // Registra listeners
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
    refreshVisibleStaff: () => fetchVisibleStaff(true)
  };
};
