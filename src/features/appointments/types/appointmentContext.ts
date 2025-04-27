
import { Appointment } from '@/types';

export interface ServiceEntry {
  serviceId?: string;
  staffId?: string;
}

export interface AppointmentState {
  appointments: Appointment[];
  filteredAppointments: Appointment[];
  loading: boolean;
  error: string | null;
  filters: {
    status: string | null;
    dateRange: [Date | null, Date | null];
    staffId: string | null;
    search: string | null;
  };
  currentAppointment: Appointment | null;
  calendarUpdateTimestamp: number; // Aggiunto per forzare aggiornamenti del calendario
}

export type AppointmentAction =
  | { type: 'SET_APPOINTMENTS'; payload: Appointment[] }
  | { type: 'SET_FILTERED_APPOINTMENTS'; payload: Appointment[] }
  | { type: 'ADD_APPOINTMENT'; payload: Appointment }
  | { type: 'ADD_TO_FILTERED_APPOINTMENTS'; payload: Appointment }
  | { type: 'UPDATE_APPOINTMENT'; payload: Appointment }
  | { type: 'DELETE_APPOINTMENT'; payload: string }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_FILTERS'; payload: Partial<AppointmentState['filters']> }
  | { type: 'SET_CURRENT_APPOINTMENT'; payload: Appointment | null }
  | { type: 'FORCE_CALENDAR_UPDATE'; payload: number }; // Nuova azione

export interface AppointmentContextType extends AppointmentState {
  fetchAppointments: (salonId: string) => Promise<void>;
  addAppointment: (appointment: Omit<Appointment, 'id'>) => Promise<Appointment>;
  updateAppointment: (appointment: Appointment) => Promise<Appointment>;
  deleteAppointment: (id: string) => Promise<void>;
  setFilters: (filters: Partial<AppointmentState['filters']>) => void;
  isSlotAvailable: (start: Date, end: Date, salonId: string, excludeAppointmentId?: string) => boolean;
  setCurrentAppointment: (appointment: Appointment | null) => void;
}
