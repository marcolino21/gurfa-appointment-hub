
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
  staffId?: string | null;
  status: 'confirmed' | 'completed' | 'cancelled' | 'pending';
}
