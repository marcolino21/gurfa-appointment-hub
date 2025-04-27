
import { useEffect, useCallback } from 'react';
import { format } from 'date-fns';
import { Appointment } from '@/types';
import { useAppointmentFormState } from './useAppointmentFormState';
import { useStaffIdNormalization } from './useStaffIdNormalization';

export const useAppointmentForm = (currentAppointment: Appointment | null) => {
  const formState = useAppointmentFormState();
  const { normalizeStaffId } = useStaffIdNormalization();
  
  const initializeFormFromAppointment = useCallback(() => {
    if (currentAppointment) {
      try {
        // Assicurati che le date siano oggetti Date validi
        const startDate = new Date(currentAppointment.start);
        const endDate = new Date(currentAppointment.end);
        
        // Normalizza l'ID dello staff per garantire la coerenza del formato
        const normalizedStaffId = normalizeStaffId(currentAppointment.staffId);
        console.log("Setting up form with appointment:", currentAppointment);
        console.log("Normalized staffId:", normalizedStaffId);
        
        // Preparazione serviceEntries - importante per il corretto funzionamento della selezione dei servizi
        let serviceEntries = currentAppointment.serviceEntries || [];
        
        // Se non ci sono serviceEntries ma abbiamo uno staffId e un servizio, creiamo una entry predefinita
        if (serviceEntries.length === 0 && normalizedStaffId && currentAppointment.service) {
          serviceEntries = [{ 
            staffId: normalizedStaffId, 
            serviceId: currentAppointment.service
          }];
          console.log("Created default service entry from staffId:", serviceEntries);
        }
        
        // Se ancora non abbiamo serviceEntries, creiamo un elemento vuoto
        if (serviceEntries.length === 0) {
          serviceEntries = [{ staffId: normalizedStaffId || '', serviceId: '' }];
          console.log("Created empty service entry", serviceEntries);
        }
        
        // Aggiorna lo stato del form con tutti i dati dell'appuntamento
        formState.setFormData({
          ...currentAppointment,
          staffId: normalizedStaffId,
          serviceEntries
        });
        
        // Imposta le date e calcola la durata
        formState.setDate(startDate);
        formState.setStartTime(format(startDate, 'HH:mm'));
        formState.setEndTime(format(endDate, 'HH:mm'));
        
        const diffMs = endDate.getTime() - startDate.getTime();
        const diffMins = Math.round(diffMs / 60000);
        formState.setDuration(diffMins);
      } catch (error) {
        console.error("Error initializing form from appointment:", error);
      }
    } else {
      // Nel caso di un nuovo appuntamento, inizializza con valori predefiniti
      const now = new Date();
      formState.setDate(now);
      formState.setStartTime(format(now, 'HH:mm'));
      
      // Durata predefinita di 30 minuti
      formState.setDuration(30);
      
      // Assicurati che ci sia almeno una serviceEntry vuota
      formState.setFormData(prev => ({
        ...prev,
        serviceEntries: [{ serviceId: '', staffId: '' }]
      }));
    }
  }, [currentAppointment, formState, normalizeStaffId]);
  
  // Inizializza il form quando cambia l'appuntamento corrente
  useEffect(() => {
    initializeFormFromAppointment();
  }, [currentAppointment, initializeFormFromAppointment]);

  return {
    ...formState,
    resetForm: initializeFormFromAppointment
  };
};
