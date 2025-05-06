
import { create } from 'zustand';
import { Appointment } from '@/types/appointments';

export type CalendarView = 'day' | 'week' | 'month' | 'staff';

interface AppointmentStore {
  appointments: Appointment[];
  selectedAppointment: Appointment | null;
  selectedDate: Date;
  view: CalendarView;
  isModalOpen: boolean;
  selectedSlot: {
    start: Date;
    end: Date;
    resource?: any;
  } | null;
  
  // Actions
  setAppointments: (appointments: Appointment[]) => void;
  setSelectedAppointment: (appointment: Appointment | null) => void;
  setSelectedDate: (date: Date) => void;
  setView: (view: CalendarView) => void;
  openModal: (slot?: { start: Date; end: Date; resource?: any }) => void;
  closeModal: () => void;
}

export const useAppointmentStore = create<AppointmentStore>((set) => ({
  appointments: [],
  selectedAppointment: null,
  selectedDate: new Date(),
  view: 'week',
  isModalOpen: false,
  selectedSlot: null,
  
  // Actions
  setAppointments: (appointments) => set({ appointments }),
  setSelectedAppointment: (appointment) => set({ selectedAppointment: appointment }),
  setSelectedDate: (date) => set({ selectedDate: date }),
  setView: (view) => set({ view }),
  openModal: (slot = null) => set({ 
    isModalOpen: true, 
    selectedSlot: slot,
    selectedAppointment: null 
  }),
  closeModal: () => set({ isModalOpen: false, selectedSlot: null }),
}));
