
export interface Appointment {
  id: string;
  title: string;
  start: Date | string;
  end: Date | string;
  clientName: string;
  clientPhone?: string;
  service?: string;
  notes?: string;
  salonId: string;
  staffId?: string; // Corretto il tipo per essere sicuramente una stringa o undefined
  status: 'confirmed' | 'completed' | 'cancelled' | 'pending';
}
