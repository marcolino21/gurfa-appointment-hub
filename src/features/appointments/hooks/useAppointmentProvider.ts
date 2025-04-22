import { useReducer, useEffect, useCallback } from 'react';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Appointment } from '@/types';
import { AppointmentState, AppointmentContextType } from '../types/appointmentContext';
import { appointmentReducer, initialState } from '../reducers/appointmentReducer';
import { filterAppointments, MOCK_APPOINTMENTS } from '../utils/appointmentUtils';

export const useAppointmentProvider = (): AppointmentContextType => {
  const [state, dispatch] = useReducer(appointmentReducer, initialState);
  const { currentSalonId, user } = useAuth();
  const { toast } = useToast();

  const fetchAppointments = useCallback((salonId: string) => {
    console.log("Fetching appointments for salon:", salonId);
    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      // Simula una richiesta API
      setTimeout(() => {
        // Filtra gli appuntamenti in base al salonId
        let filteredApps = [];
        
        // Se l'utente è super_admin, può vedere tutti gli appuntamenti
        if (user?.role === 'super_admin') {
          filteredApps = MOCK_APPOINTMENTS;
        } else {
          filteredApps = MOCK_APPOINTMENTS.filter(app => app.salonId === salonId);
        }
        
        console.log("Appointments fetched:", filteredApps.length);
        dispatch({ type: 'SET_APPOINTMENTS', payload: filteredApps });
        dispatch({ type: 'SET_FILTERED_APPOINTMENTS', payload: filteredApps });
        dispatch({ type: 'SET_LOADING', payload: false });
      }, 500);
    } catch (error: any) {
      console.error("Error fetching appointments:", error);
      dispatch({ type: 'SET_ERROR', payload: error.message });
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [user]);

  useEffect(() => {
    if (currentSalonId) {
      console.log("Fetching appointments on mount with salonId:", currentSalonId);
      fetchAppointments(currentSalonId);
    }
  }, [currentSalonId, fetchAppointments]);

  const addAppointment = async (appointment: Omit<Appointment, 'id'>): Promise<Appointment> => {
    console.log("Adding appointment:", appointment);
    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      // Simula una richiesta API
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newAppointment: Appointment = {
        ...appointment,
        id: `app_${Date.now()}`
      };
      
      if (!isSlotAvailable(
        new Date(appointment.start), 
        new Date(appointment.end), 
        appointment.salonId
      )) {
        throw new Error('Lo slot orario selezionato è già occupato');
      }
      
      dispatch({ type: 'ADD_APPOINTMENT', payload: newAppointment });
      console.log("Appointment added successfully:", newAppointment);
      
      toast({
        title: 'Appuntamento creato',
        description: `Appuntamento con ${newAppointment.clientName} aggiunto per il ${format(new Date(newAppointment.start), 'PPP', { locale: it })}`
      });
      
      dispatch({ type: 'SET_LOADING', payload: false });
      return newAppointment;
    } catch (error: any) {
      console.error("Error adding appointment:", error);
      dispatch({ type: 'SET_ERROR', payload: error.message });
      dispatch({ type: 'SET_LOADING', payload: false });
      toast({
        variant: 'destructive',
        title: 'Errore',
        description: error.message
      });
      throw error;
    }
  };

  const updateAppointment = async (appointment: Appointment): Promise<Appointment> => {
    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      // Simula una richiesta API
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (!isSlotAvailable(
        new Date(appointment.start), 
        new Date(appointment.end), 
        appointment.salonId, 
        appointment.id
      )) {
        throw new Error('Lo slot orario selezionato è già occupato');
      }
      
      dispatch({ type: 'UPDATE_APPOINTMENT', payload: appointment });
      
      toast({
        title: 'Appuntamento aggiornato',
        description: `Appuntamento con ${appointment.clientName} aggiornato per il ${format(new Date(appointment.start), 'PPP', { locale: it })}`
      });
      
      dispatch({ type: 'SET_LOADING', payload: false });
      return appointment;
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      dispatch({ type: 'SET_LOADING', payload: false });
      toast({
        variant: 'destructive',
        title: 'Errore',
        description: error.message
      });
      throw error;
    }
  };

  const deleteAppointment = async (id: string): Promise<void> => {
    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      // Simula una richiesta API
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Trova l'appuntamento da eliminare per il messaggio toast
      const appointmentToDelete = state.appointments.find(app => app.id === id);
      
      dispatch({ type: 'DELETE_APPOINTMENT', payload: id });
      
      if (appointmentToDelete) {
        toast({
          title: 'Appuntamento eliminato',
          description: `Appuntamento con ${appointmentToDelete.clientName} del ${format(new Date(appointmentToDelete.start), 'PPP', { locale: it })} eliminato`
        });
      }
      
      dispatch({ type: 'SET_LOADING', payload: false });
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      dispatch({ type: 'SET_LOADING', payload: false });
      toast({
        variant: 'destructive',
        title: 'Errore',
        description: error.message
      });
      throw error;
    }
  };

  const setFilters = (filters: Partial<AppointmentState['filters']>) => {
    console.log("Setting filters:", filters);
    dispatch({ type: 'SET_FILTERS', payload: filters });
    
    // Aggiorna gli appuntamenti filtrati
    const updatedFilters = { ...state.filters, ...filters };
    const filtered = state.appointments.filter(filterAppointments(updatedFilters));
    console.log("Filtered appointments after filter update:", filtered.length);
    dispatch({ type: 'SET_FILTERED_APPOINTMENTS', payload: filtered });
  };

  const isSlotAvailable = (start: Date, end: Date, salonId: string, excludeAppointmentId?: string): boolean => {
    // Controllo se ci sono appuntamenti che si sovrappongono
    return !state.appointments.some(app => 
      // Escludi l'appuntamento corrente quando si modifica
      app.id !== excludeAppointmentId && 
      app.salonId === salonId && 
      // Controlla sovrapposizione
      ((new Date(app.start) < end && new Date(app.end) > start))
    );
  };

  const setCurrentAppointment = (appointment: Appointment | null) => {
    console.log("Setting current appointment:", appointment);
    dispatch({ type: 'SET_CURRENT_APPOINTMENT', payload: appointment });
  };

  return {
    ...state,
    fetchAppointments,
    addAppointment,
    updateAppointment,
    deleteAppointment,
    setFilters,
    isSlotAvailable,
    setCurrentAppointment
  };
};
