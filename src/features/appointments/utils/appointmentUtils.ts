import { AppointmentState } from '../types/appointmentContext';
import { Appointment } from '@/types';

export const MOCK_APPOINTMENTS: Appointment[] = [
  {
    id: '1',
    title: 'Appuntamento con Mario Rossi',
    start: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString(),
    end: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString(),
    clientName: 'Mario Rossi',
    clientPhone: '3334445566',
    service: 'Taglio Uomo',
    notes: 'Note aggiuntive...',
    salonId: '1',
    staffId: '1',
    status: 'confirmed',
  },
  {
    id: '2',
    title: 'Appuntamento con Luca Verdi',
    start: new Date(new Date().setDate(new Date().getDate() + 2)).toISOString(),
    end: new Date(new Date().setDate(new Date().getDate() + 2)).toISOString(),
    clientName: 'Luca Verdi',
    clientPhone: '3334445566',
    service: 'Barba',
    notes: 'Note aggiuntive...',
    salonId: '1',
    staffId: '2',
    status: 'pending',
  },
  {
    id: '3',
    title: 'Appuntamento con Cliente 3',
    start: new Date(new Date().setDate(new Date().getDate() + 3)).toISOString(),
    end: new Date(new Date().setDate(new Date().getDate() + 3)).toISOString(),
    clientName: 'Cliente 3',
    clientPhone: '3334445566',
    service: 'Piega',
    notes: 'Note aggiuntive...',
    salonId: '1',
    staffId: '1',
    status: 'completed',
  },
  {
    id: '4',
    title: 'Appuntamento con Cliente 4',
    start: new Date(new Date().setDate(new Date().getDate() + 4)).toISOString(),
    end: new Date(new Date().setDate(new Date().getDate() + 4)).toISOString(),
    clientName: 'Cliente 4',
    clientPhone: '3334445566',
    service: 'Colore',
    notes: 'Note aggiuntive...',
    salonId: '1',
    staffId: '2',
    status: 'cancelled',
  },
  {
    id: '5',
    title: 'Appuntamento con Cliente 5',
    start: new Date(new Date().setDate(new Date().getDate() + 5)).toISOString(),
    end: new Date(new Date().setDate(new Date().getDate() + 5)).toISOString(),
    clientName: 'Cliente 5',
    clientPhone: '3334445566',
    service: 'Manicure',
    notes: 'Note aggiuntive...',
    salonId: '2',
    staffId: '3',
    status: 'confirmed',
  },
  {
    id: '6',
    title: 'Appuntamento con Cliente 6',
    start: new Date(new Date().setDate(new Date().getDate() + 6)).toISOString(),
    end: new Date(new Date().setDate(new Date().getDate() + 6)).toISOString(),
    clientName: 'Cliente 6',
    clientPhone: '3334445566',
    service: 'Pedicure',
    notes: 'Note aggiuntive...',
    salonId: '2',
    staffId: '4',
    status: 'pending',
  },
  {
    id: '7',
    title: 'Appuntamento con Cliente 7',
    start: new Date(new Date().setDate(new Date().getDate() + 7)).toISOString(),
    end: new Date(new Date().setDate(new Date().getDate() + 7)).toISOString(),
    clientName: 'Cliente 7',
    clientPhone: '3334445566',
    service: 'Massaggio',
    notes: 'Note aggiuntive...',
    salonId: '2',
    staffId: '3',
    status: 'completed',
  },
  {
    id: '8',
    title: 'Appuntamento con Cliente 8',
    start: new Date(new Date().setDate(new Date().getDate() + 8)).toISOString(),
    end: new Date(new Date().setDate(new Date().getDate() + 8)).toISOString(),
    clientName: 'Cliente 8',
    clientPhone: '3334445566',
    service: 'Pulizia viso',
    notes: 'Note aggiuntive...',
    salonId: '2',
    staffId: '4',
    status: 'cancelled',
  },
  {
    id: '9',
    title: 'Appuntamento con Cliente 9',
    start: new Date(new Date().setDate(new Date().getDate() + 9)).toISOString(),
    end: new Date(new Date().setDate(new Date().getDate() + 9)).toISOString(),
    clientName: 'Cliente 9',
    clientPhone: '3334445566',
    service: 'Trattamento capelli',
    notes: 'Note aggiuntive...',
    salonId: '3',
    staffId: '5',
    status: 'confirmed',
  },
  {
    id: '10',
    title: 'Appuntamento con Cliente 10',
    start: new Date(new Date().setDate(new Date().getDate() + 10)).toISOString(),
    end: new Date(new Date().setDate(new Date().getDate() + 10)).toISOString(),
    clientName: 'Cliente 10',
    clientPhone: '3334445566',
    service: 'Extension ciglia',
    notes: 'Note aggiuntive...',
    salonId: '3',
    staffId: '6',
    status: 'pending',
  },
  {
    id: '11',
    title: 'Appuntamento con Cliente 11',
    start: new Date(new Date().setDate(new Date().getDate() + 11)).toISOString(),
    end: new Date(new Date().setDate(new Date().getDate() + 11)).toISOString(),
    clientName: 'Cliente 11',
    clientPhone: '3334445566',
    service: 'Trucco',
    notes: 'Note aggiuntive...',
    salonId: '3',
    staffId: '5',
    status: 'completed',
  },
  {
    id: '12',
    title: 'Appuntamento con Cliente 12',
    start: new Date(new Date().setDate(new Date().getDate() + 12)).toISOString(),
    end: new Date(new Date().setDate(new Date().getDate() + 12)).toISOString(),
    clientName: 'Cliente 12',
    clientPhone: '3334445566',
    service: 'Ceretta',
    notes: 'Note aggiuntive...',
    salonId: '3',
    staffId: '6',
    status: 'cancelled',
  },
];

// Versione migliorata della funzione di filtro per gli appuntamenti
export const filterAppointments = (filters: AppointmentState['filters']) => (appointment: Appointment) => {
  // Filtro per stato
  if (filters.status && appointment.status !== filters.status) {
    return false;
  }

  // Filtro per intervallo di date
  if (filters.dateRange && (filters.dateRange[0] || filters.dateRange[1])) {
    const appointmentDate = new Date(appointment.start);
    
    if (filters.dateRange[0] && appointmentDate < filters.dateRange[0]) {
      return false;
    }
    
    if (filters.dateRange[1] && appointmentDate > filters.dateRange[1]) {
      return false;
    }
  }

  // Filtro per operatore
  if (filters.staffId) {
    // Gestione dello staffId che potrebbe essere stringa o oggetto
    let appointmentStaffId;
    
    if (typeof appointment.staffId === 'string') {
      appointmentStaffId = appointment.staffId;
    } else if (appointment.staffId && typeof appointment.staffId === 'object' && 'value' in appointment.staffId) {
      appointmentStaffId = appointment.staffId.value;
    }
    
    if (appointmentStaffId !== filters.staffId) {
      return false;
    }
  }

  // Filtro per ricerca testuale
  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    const clientNameLower = appointment.clientName.toLowerCase();
    const serviceLower = appointment.service?.toLowerCase() || '';
    const notesLower = appointment.notes?.toLowerCase() || '';
    
    const hasMatch = 
      clientNameLower.includes(searchLower) || 
      serviceLower.includes(searchLower) || 
      notesLower.includes(searchLower);
      
    if (!hasMatch) {
      return false;
    }
  }

  // Se tutti i filtri sono superati, l'appuntamento è incluso
  return true;
};
