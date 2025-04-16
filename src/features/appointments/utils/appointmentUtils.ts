
import { Appointment } from '@/types';
import { AppointmentState } from '../types/appointmentContext';

// Mock data per lo sviluppo
export const generateMockAppointments = (): Appointment[] => {
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

export const MOCK_APPOINTMENTS = generateMockAppointments();

// Function to filter appointments
export const filterAppointments = (filters: AppointmentState['filters']) => (appointment: Appointment): boolean => {
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
