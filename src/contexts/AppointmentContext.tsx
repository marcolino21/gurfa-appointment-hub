
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { Appointment } from '../types';
import { useAuth } from './AuthContext';
import { useToast } from '../hooks/use-toast';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';

// Mock data per lo sviluppo
const generateMockAppointments = (): Appointment[] => {
  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);

  const appointments: Appointment[] = [
    {
      id: '1',
      title: 'Taglio e piega',
      start: new Date(today.setHours(10, 0, 0, 0)).toISOString(),
      end: new Date(today.setHours(11, 0, 0, 0)).toISOString(),
      clientName: 'Mario Rossi',
      clientPhone: '3331234567',
      service: 'Taglio e piega',
      notes: 'Cliente abituale',
      salonId: 'a1',
      status: 'confirmed'
    },
    {
      id: '2',
      title: 'Colore',
      start: new Date(today.setHours(11, 30, 0, 0)).toISOString(),
      end: new Date(today.setHours(13, 0, 0, 0)).toISOString(),
      clientName: 'Giulia Bianchi',
      clientPhone: '3387654321',
      service: 'Colore',
      salonId: 'a1',
      status: 'confirmed'
    },
    {
      id: '3',
      title: 'Manicure',
      start: new Date(today.setHours(14, 0, 0, 0)).toISOString(),
      end: new Date(today.setHours(15, 0, 0, 0)).toISOString(),
      clientName: 'Laura Verdi',
      service: 'Manicure',
      salonId: 'a1',
      status: 'completed'
    },
    {
      id: '4',
      title: 'Massaggio',
      start: new Date(today.setHours(9, 0, 0, 0)).toISOString(),
      end: new Date(today.setHours(10, 0, 0, 0)).toISOString(),
      clientName: 'Franco Neri',
      clientPhone: '3391234567',
      service: 'Massaggio',
      salonId: 'a2',
      status: 'confirmed'
    },
    {
      id: '5', 
      title: 'Taglio barba',
      start: new Date(tomorrow.setHours(11, 0, 0, 0)).toISOString(),
      end: new Date(tomorrow.setHours(11, 30, 0, 0)).toISOString(),
      clientName: 'Andrea Gialli',
      service: 'Taglio barba',
      notes: 'Prima volta',
      salonId: 'a2',
      status: 'pending'
    },
    {
      id: '6',
      title: 'Trattamento viso',
      start: new Date(today.setHours(16, 0, 0, 0)).toISOString(),
      end: new Date(today.setHours(17, 0, 0, 0)).toISOString(),
      clientName: 'Roberta Blu',
      service: 'Trattamento viso',
      salonId: 'f1',
      status: 'confirmed'
    },
    {
      id: '7',
      title: 'Taglio uomo',
      start: new Date(tomorrow.setHours(14, 0, 0, 0)).toISOString(),
      end: new Date(tomorrow.setHours(14, 30, 0, 0)).toISOString(),
      clientName: 'Marco Rosa',
      clientPhone: '3351234567',
      service: 'Taglio uomo',
      salonId: 'f1',
      status: 'confirmed'
    }
  ];

  return appointments;
};

const MOCK_APPOINTMENTS = generateMockAppointments();

interface AppointmentState {
  appointments: Appointment[];
  filteredAppointments: Appointment[];
  loading: boolean;
  error: string | null;
  filters: {
    status: string | null;
    dateRange: [Date | null, Date | null];
    search: string;
  };
  currentAppointment: Appointment | null;
}

type AppointmentAction =
  | { type: 'SET_APPOINTMENTS'; payload: Appointment[] }
  | { type: 'SET_FILTERED_APPOINTMENTS'; payload: Appointment[] }
  | { type: 'ADD_APPOINTMENT'; payload: Appointment }
  | { type: 'UPDATE_APPOINTMENT'; payload: Appointment }
  | { type: 'DELETE_APPOINTMENT'; payload: string }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_FILTERS'; payload: Partial<AppointmentState['filters']> }
  | { type: 'SET_CURRENT_APPOINTMENT'; payload: Appointment | null };

const appointmentReducer = (state: AppointmentState, action: AppointmentAction): AppointmentState => {
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

// Funzione helper per filtrare gli appuntamenti
const filterAppointments = (filters: AppointmentState['filters']) => (appointment: Appointment): boolean => {
  // Filtra per stato
  if (filters.status && filters.status !== 'all' && appointment.status !== filters.status) {
    return false;
  }

  // Filtra per intervallo di date
  const [startDate, endDate] = filters.dateRange;
  const appointmentDate = new Date(appointment.start);

  if (startDate && appointmentDate < startDate) {
    return false;
  }

  if (endDate) {
    // Imposta endDate a fine giornata per inclusività
    const endOfDay = new Date(endDate);
    endOfDay.setHours(23, 59, 59, 999);
    if (appointmentDate > endOfDay) {
      return false;
    }
  }

  // Filtra per testo di ricerca
  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    return (
      appointment.clientName.toLowerCase().includes(searchLower) ||
      (appointment.service && appointment.service.toLowerCase().includes(searchLower)) ||
      (appointment.notes && appointment.notes.toLowerCase().includes(searchLower))
    );
  }

  return true;
};

const initialState: AppointmentState = {
  appointments: [],
  filteredAppointments: [],
  loading: false,
  error: null,
  filters: {
    status: null,
    dateRange: [null, null],
    search: ''
  },
  currentAppointment: null
};

interface AppointmentContextType extends AppointmentState {
  fetchAppointments: (salonId: string) => void;
  addAppointment: (appointment: Omit<Appointment, 'id'>) => Promise<Appointment>;
  updateAppointment: (appointment: Appointment) => Promise<Appointment>;
  deleteAppointment: (id: string) => Promise<void>;
  setFilters: (filters: Partial<AppointmentState['filters']>) => void;
  isSlotAvailable: (start: Date, end: Date, salonId: string, excludeAppointmentId?: string) => boolean;
  setCurrentAppointment: (appointment: Appointment | null) => void;
}

const AppointmentContext = createContext<AppointmentContextType | undefined>(undefined);

export const AppointmentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appointmentReducer, initialState);
  const { currentSalonId, user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (currentSalonId) {
      fetchAppointments(currentSalonId);
    }
  }, [currentSalonId]);

  const fetchAppointments = (salonId: string) => {
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
        
        dispatch({ type: 'SET_APPOINTMENTS', payload: filteredApps });
        dispatch({ type: 'SET_FILTERED_APPOINTMENTS', payload: filteredApps });
        dispatch({ type: 'SET_LOADING', payload: false });
      }, 500);
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const addAppointment = async (appointment: Omit<Appointment, 'id'>): Promise<Appointment> => {
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
      
      toast({
        title: 'Appuntamento creato',
        description: `Appuntamento con ${newAppointment.clientName} aggiunto per il ${format(new Date(newAppointment.start), 'PPP', { locale: it })}`
      });
      
      dispatch({ type: 'SET_LOADING', payload: false });
      return newAppointment;
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
    dispatch({ type: 'SET_FILTERS', payload: filters });
    
    // Aggiorna gli appuntamenti filtrati
    const updatedFilters = { ...state.filters, ...filters };
    const filtered = state.appointments.filter(filterAppointments(updatedFilters));
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
    dispatch({ type: 'SET_CURRENT_APPOINTMENT', payload: appointment });
  };

  return (
    <AppointmentContext.Provider value={{
      ...state,
      fetchAppointments,
      addAppointment,
      updateAppointment,
      deleteAppointment,
      setFilters,
      isSlotAvailable,
      setCurrentAppointment
    }}>
      {children}
    </AppointmentContext.Provider>
  );
};

export const useAppointments = () => {
  const context = useContext(AppointmentContext);
  if (context === undefined) {
    throw new Error('useAppointments deve essere usato all\'interno di un AppointmentProvider');
  }
  return context;
};
