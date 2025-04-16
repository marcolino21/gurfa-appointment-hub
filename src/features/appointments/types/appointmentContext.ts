
import { Appointment } from '@/types';

export interface AppointmentState {
  appointments: Appointment[];
  filteredAppointments: Appointment[];
  currentAppointment: Appointment | null;
  loading: boolean;
  error: string | null;
  filters: {
    date: Date | null;
    staffId: string | null;
    status: string | null;
    clientName: string | null;
  };
}

export interface AppointmentContextType extends AppointmentState {
  fetchAppointments: (salonId: string) => void;
  addAppointment: (appointment: Omit<Appointment, 'id'>) => Promise<Appointment>;
  updateAppointment: (appointment: Appointment) => Promise<Appointment>;
  deleteAppointment: (id: string) => Promise<void>;
  setFilters: (filters: Partial<AppointmentState['filters']>) => void;
  isSlotAvailable: (start: Date, end: Date, salonId: string, excludeAppointmentId?: string) => boolean;
  setCurrentAppointment: (appointment: Appointment | null) => void;
}
