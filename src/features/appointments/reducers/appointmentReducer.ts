import { Appointment } from '@/types';
import { AppointmentState, AppointmentAction } from '../types/appointmentContext';
import { filterAppointments } from '../utils/appointmentUtils';

// Aggiunto calendarUpdateTimestamp a initialState
export const initialState: AppointmentState = {
  appointments: [],
  filteredAppointments: [],
  loading: false,
  error: null,
  filters: {
    status: null,
    dateRange: [null, null],
    staffId: null,
    search: null
  },
  currentAppointment: null,
  calendarUpdateTimestamp: Date.now() // Nuovo campo per forzare aggiornamenti
};

export const appointmentReducer = (state: AppointmentState, action: AppointmentAction): AppointmentState => {
  switch (action.type) {
    case 'SET_APPOINTMENTS':
      return {
        ...state,
        appointments: action.payload,
        calendarUpdateTimestamp: Date.now()
      };
    case 'SET_FILTERED_APPOINTMENTS':
      return {
        ...state,
        filteredAppointments: action.payload,
        calendarUpdateTimestamp: Date.now()
      };
    
    case 'ADD_APPOINTMENT': {
      const updatedAppointments = [...state.appointments, action.payload];
      return {
        ...state,
        appointments: updatedAppointments,
        calendarUpdateTimestamp: Date.now() // Forza aggiornamento del calendario
      };
    }
    
    case 'ADD_TO_FILTERED_APPOINTMENTS': {
      // Verifica che l'appuntamento non sia già nella lista filtrata
      if (!state.filteredAppointments.some(app => app.id === action.payload.id)) {
        return {
          ...state,
          filteredAppointments: [...state.filteredAppointments, action.payload],
          calendarUpdateTimestamp: Date.now() // Forza aggiornamento del calendario
        };
      }
      return state;
    }
    
    case 'UPDATE_APPOINTMENT': {
      const updatedAppointments = state.appointments.map(appointment => 
        appointment.id === action.payload.id ? action.payload : appointment
      );
      
      // Aggiorna anche l'elenco filtrato
      const updatedFiltered = state.filteredAppointments.map(appointment => 
        appointment.id === action.payload.id ? action.payload : appointment
      );
      
      return {
        ...state,
        appointments: updatedAppointments,
        filteredAppointments: updatedFiltered,
        calendarUpdateTimestamp: Date.now() // Forza aggiornamento del calendario
      };
    }
    
    case 'DELETE_APPOINTMENT': {
      return {
        ...state,
        appointments: state.appointments.filter(appointment => appointment.id !== action.payload),
        filteredAppointments: state.filteredAppointments.filter(appointment => appointment.id !== action.payload),
        calendarUpdateTimestamp: Date.now() // Forza aggiornamento del calendario
      };
    }
    
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'SET_FILTERS': {
      return {
        ...state,
        filters: { ...state.filters, ...action.payload },
        calendarUpdateTimestamp: Date.now()
      };
    }
    case 'SET_CURRENT_APPOINTMENT':
      return { ...state, currentAppointment: action.payload };
    
    // Aggiungi questo nuovo case per forzare l'aggiornamento del calendario
    case 'FORCE_CALENDAR_UPDATE':
      console.log("Forcing calendar update...");
      return {
        ...state,
        calendarUpdateTimestamp: action.payload || Date.now()
      };
      
    default:
      return state;
  }
};
