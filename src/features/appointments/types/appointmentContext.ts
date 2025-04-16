
import { Appointment } from '@/types';

export interface AppointmentState {
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

export type AppointmentAction =
  | { type: 'SET_APPOINTMENTS'; payload: Appointment[] }
  | { type: 'SET_FILTERED_APPOINTMENTS'; payload: Appointment[] }
  | { type: 'ADD_APPOINTMENT'; payload: Appointment }
  | { type: 'UPDATE_APPOINTMENT'; payload: Appointment }
  | { type: 'DELETE_APPOINTMENT'; payload: string }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_FILTERS'; payload: Partial<AppointmentState['filters']> }
  | { type: 'SET_CURRENT_APPOINTMENT'; payload: Appointment | null };

export interface AppointmentContextType extends AppointmentState {
  fetchAppointments: (salonId: string) => void;
  addAppointment: (appointment: Omit<Appointment, 'id'>) => Promise<Appointment>;
  updateAppointment: (appointment: Appointment) => Promise<Appointment>;
  deleteAppointment: (id: string) => Promise<void>;
  setFilters: (filters: Partial<AppointmentState['filters']>) => void;
  isSlotAvailable: (start: Date, end: Date, salonId: string, excludeAppointmentId?: string) => boolean;
  setCurrentAppointment: (appointment: Appointment | null) => void;
}
