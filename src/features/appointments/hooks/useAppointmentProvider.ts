
import { useReducer, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Appointment } from '@/types';
import { AppointmentState, AppointmentContextType } from '../types/appointmentContext';
import { appointmentReducer, initialState } from '../reducers/appointmentReducer';
import { filterAppointments } from '../utils/appointmentUtils';
import { useFetchAppointments } from './appointment-actions/useFetchAppointments';
import { useAddAppointment } from './appointment-actions/useAddAppointment';
import { useUpdateAppointment } from './appointment-actions/useUpdateAppointment';

export const useAppointmentProvider = (): AppointmentContextType => {
  const [state, dispatch] = useReducer(appointmentReducer, initialState);
  const { currentSalonId } = useAuth();
  
  const fetchAppointments = useFetchAppointments(dispatch);
  
  useEffect(() => {
    if (currentSalonId) {
      console.log("Fetching appointments on mount with salonId:", currentSalonId);
      fetchAppointments(currentSalonId);
    }
  }, [currentSalonId, fetchAppointments]);

  const isSlotAvailable = (start: Date, end: Date, salonId: string, excludeAppointmentId?: string): boolean => {
    return !state.appointments.some(app => 
      app.id !== excludeAppointmentId && 
      app.salonId === salonId && 
      ((new Date(app.start) < end && new Date(app.end) > start))
    );
  };

  // Modifichiamo questa funzione per aggiornare anche la lista filtrata
  const addAppointment = useAddAppointment(dispatch, isSlotAvailable);
  
  // Modifichiamo questa funzione per aggiornare anche la lista filtrata
  const updateAppointment = useUpdateAppointment(dispatch, isSlotAvailable);

  const deleteAppointment = async (id: string): Promise<void> => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      dispatch({ type: 'DELETE_APPOINTMENT', payload: id });
      
      // Aggiorniamo anche gli appuntamenti filtrati
      const updatedFiltered = state.appointments.filter(app => app.id !== id)
        .filter(filterAppointments(state.filters));
      dispatch({ type: 'SET_FILTERED_APPOINTMENTS', payload: updatedFiltered });
      
      dispatch({ type: 'SET_LOADING', payload: false });
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      dispatch({ type: 'SET_LOADING', payload: false });
      throw error;
    }
  };

  const setFilters = (filters: Partial<AppointmentState['filters']>) => {
    console.log("Setting filters:", filters);
    dispatch({ type: 'SET_FILTERS', payload: filters });
    
    const updatedFilters = { ...state.filters, ...filters };
    const filtered = state.appointments.filter(filterAppointments(updatedFilters));
    console.log("Filtered appointments after filter update:", filtered.length);
    dispatch({ type: 'SET_FILTERED_APPOINTMENTS', payload: filtered });
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
