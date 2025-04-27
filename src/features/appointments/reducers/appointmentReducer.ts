
import { Appointment } from '@/types';
import { AppointmentState, AppointmentAction } from '../types/appointmentContext';
import { filterAppointments } from '../utils/appointmentUtils';

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
  currentAppointment: null
};

export const appointmentReducer = (state: AppointmentState, action: AppointmentAction): AppointmentState => {
  switch (action.type) {
    case 'SET_APPOINTMENTS':
      return {
        ...state,
        appointments: action.payload,
        filteredAppointments: action.payload
      };
      
    case 'SET_FILTERED_APPOINTMENTS':
      return {
        ...state,
        filteredAppointments: action.payload
      };
      
    case 'ADD_APPOINTMENT': {
      const updatedAppointments = [...state.appointments, action.payload];
      
      // Aggiungi sempre il nuovo appuntamento anche alla lista filtrata
      // Questo assicura che venga visualizzato immediatamente
      const updatedFiltered = [...state.filteredAppointments, action.payload];
      
      console.log(`Added appointment ${action.payload.id} with staffId ${action.payload.staffId}`);
      console.log("Updated appointments count:", updatedAppointments.length);
      console.log("Updated filtered appointments count:", updatedFiltered.length);
      
      return {
        ...state,
        appointments: updatedAppointments,
        filteredAppointments: updatedFiltered
      };
    }
    
    case 'ADD_TO_FILTERED_APPOINTMENTS':
      return {
        ...state,
        filteredAppointments: [...state.filteredAppointments, action.payload]
      };
      
    case 'UPDATE_APPOINTMENT': {
      const updatedAppointments = state.appointments.map(appointment => 
        appointment.id === action.payload.id ? action.payload : appointment
      );
      
      // Aggiorna anche l'elenco filtrato
      const updatedFiltered = state.filteredAppointments.map(appointment => 
        appointment.id === action.payload.id ? action.payload : appointment
      );
      
      console.log(`Updated appointment ${action.payload.id} with staffId ${action.payload.staffId}`);
      
      return {
        ...state,
        appointments: updatedAppointments,
        filteredAppointments: updatedFiltered
      };
    }
    
    case 'DELETE_APPOINTMENT':
      return {
        ...state,
        appointments: state.appointments.filter(appointment => appointment.id !== action.payload),
        filteredAppointments: state.filteredAppointments.filter(appointment => appointment.id !== action.payload)
      };
      
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload
      };
      
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload
      };
      
    case 'SET_FILTERS': {
      const updatedFilters = { ...state.filters, ...action.payload };
      return {
        ...state,
        filters: updatedFilters
      };
    }
    
    case 'SET_CURRENT_APPOINTMENT':
      return {
        ...state,
        currentAppointment: action.payload
      };
      
    default:
      return state;
  }
};
