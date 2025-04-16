
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
    case 'ADD_APPOINTMENT':
      return { 
        ...state, 
        appointments: [...state.appointments, action.payload],
        filteredAppointments: [...state.appointments, action.payload].filter(filterAppointments(state.filters))
      };
    case 'UPDATE_APPOINTMENT':
      return { 
        ...state, 
        appointments: state.appointments.map(app => 
          app.id === action.payload.id ? action.payload : app
        ),
        filteredAppointments: state.appointments
          .map(app => app.id === action.payload.id ? action.payload : app)
          .filter(filterAppointments(state.filters))
      };
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
