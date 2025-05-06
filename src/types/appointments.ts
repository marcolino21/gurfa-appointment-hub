
export interface Appointment {
  id: string;
  client_id: string;
  service_id: string;
  staff_id: string;
  start_time: string;  // ISO string
  end_time: string;    // ISO string
  status: 'confirmed' | 'completed' | 'cancelled' | 'pending';
  notes?: string;
  price: number;
  payment_status: 'paid' | 'pending' | 'refunded';
  created_at: string;  // ISO string
  
  // Derived properties populated during fetch
  title?: string;
  clientName?: string;
  serviceName?: string;
  staffName?: string;
  start?: Date;        // For React Big Calendar
  end?: Date;          // For React Big Calendar
}

export interface AppointmentFormData {
  client_id: string;
  service_id: string;
  staff_id: string;
  start_time: string;  // ISO string
  end_time: string;    // ISO string
  notes?: string;
  status?: 'confirmed' | 'completed' | 'cancelled' | 'pending';
  title?: string;
  client_name?: string;
  service?: string;
}
