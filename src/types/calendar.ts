export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  created_at: string;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  duration: number;
  price: number;
  category: string;
  created_at: string;
}

export interface Staff {
  id: string;
  user_id: string;
  name: string;
  role: 'admin' | 'manager' | 'receptionist' | 'stylist' | 'therapist' | 'collaborator';
  availability: Record<string, any>;
  color_code: string;
  created_at: string;
}

export interface Appointment {
  id: string;
  client_id: string;
  service_id: string;
  staff_id: string;
  start_time: string;
  end_time: string;
  status: 'confirmed' | 'completed' | 'cancelled' | 'pending';
  notes: string;
  price: number;
  payment_status: 'paid' | 'pending' | 'refunded';
  created_at: string;
  clients: Client;
  services: Service;
  staff: Staff;
} 