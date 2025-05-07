
export interface Appointment {
  id: string;
  salon_id: string;
  client_name: string;
  client_phone?: string;
  service_id?: string;
  staff_id?: string;
  start_time: string;  // ISO string
  end_time: string;    // ISO string
  status: 'confirmed' | 'completed' | 'cancelled' | 'pending';
  notes?: string;
  created_at: string;  // ISO string
  updated_at: string;  // ISO string
  
  // Derived properties populated during fetch
  title?: string;
  service?: string;
  start?: Date;        // For React Big Calendar
  end?: Date;          // For React Big Calendar
  staff_name?: string; // Derived from staff relation
}

export interface AppointmentFormData {
  salon_id: string;
  client_name: string;
  client_phone?: string;
  service_id?: string;
  staff_id?: string;
  start_time: string;  // ISO string
  end_time: string;    // ISO string
  notes?: string;
  status?: 'confirmed' | 'completed' | 'cancelled' | 'pending';
  title?: string;
}
