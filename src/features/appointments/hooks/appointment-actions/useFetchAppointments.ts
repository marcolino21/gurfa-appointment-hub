
import { useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Appointment } from '@/types';
import { MOCK_APPOINTMENTS } from '../utils/appointmentUtils';

export const useFetchAppointments = (dispatch: React.Dispatch<any>) => {
  const { user } = useAuth();

  return useCallback((salonId: string) => {
    console.log("Fetching appointments for salon:", salonId);
    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      // Simula una richiesta API
      setTimeout(() => {
        let filteredApps = [];
        
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
};
