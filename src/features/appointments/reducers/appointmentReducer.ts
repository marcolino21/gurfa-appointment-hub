
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
      return { ...state, appointments: action.payload };
      
    case 'SET_FILTERED_APPOINTMENTS':
      return { ...state, filteredAppointments: action.payload };
      
    case 'ADD_APPOINTMENT': {
      const newAppointment = action.payload;
      const newAppointments = [...state.appointments, newAppointment];
      
      // Verifichiamo se l'appuntamento passa i filtri correnti
      const shouldAddToFiltered = filterAppointments(state.filters)(newAppointment);
      
      console.log("Aggiunto nuovo appuntamento:", newAppointment);
      console.log("Passa i filtri correnti:", shouldAddToFiltered);
      
      return { 
        ...state, 
        appointments: newAppointments,
        // Aggiungiamo sempre ai filtrati se non ci sono filtri attivi o se passa i filtri
        filteredAppointments: shouldAddToFiltered 
          ? [...state.filteredAppointments, newAppointment]
          : state.filteredAppointments
      };
    }
    
    case 'ADD_TO_FILTERED_APPOINTMENTS':
      // Evita duplicati
      if (state.filteredAppointments.some(app => app.id === action.payload.id)) {
        return state;
      }
      return {
        ...state,
        filteredAppointments: [...state.filteredAppointments, action.payload]
      };
      
    case 'UPDATE_APPOINTMENT': {
      const updatedAppointment = action.payload;
      const updatedAppointments = state.appointments.map(app => 
        app.id === updatedAppointment.id ? updatedAppointment : app
      );
      
      // Aggiorniamo anche gli appuntamenti filtrati
      const updatedFilteredAppointments = state.filteredAppointments.map(app =>
        app.id === updatedAppointment.id ? updatedAppointment : app
      );
      
      // Se l'appuntamento aggiornato non è presente nei filtrati ma passa i filtri attuali, lo aggiungiamo
      const isInFiltered = state.filteredAppointments.some(app => app.id === updatedAppointment.id);
      const shouldBeInFiltered = filterAppointments(state.filters)(updatedAppointment);
      
      if (!isInFiltered && shouldBeInFiltered) {
        updatedFilteredAppointments.push(updatedAppointment);
      }
      
      console.log("Aggiornato appuntamento:", updatedAppointment);
      
      return { 
        ...state, 
        appointments: updatedAppointments,
        filteredAppointments: shouldBeInFiltered 
          ? updatedFilteredAppointments 
          : updatedFilteredAppointments.filter(app => app.id !== updatedAppointment.id)
      };
    }
    
    case 'DELETE_APPOINTMENT':
      return { 
        ...state, 
        appointments: state.appointments.filter(app => app.id !== action.payload),
        filteredAppointments: state.filteredAppointments.filter(app => app.id !== action.payload)
      };
      
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
      
    case 'SET_ERROR':
      return { ...state, error: action.payload };
      
    case 'SET_FILTERS':
      return { 
        ...state, 
        filters: { ...state.filters, ...action.payload }
      };
      
    case 'SET_CURRENT_APPOINTMENT':
      return { ...state, currentAppointment: action.payload };
      
    default:
      return state;
  }
};
