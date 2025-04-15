
export type UserRole = 'super_admin' | 'azienda' | 'freelance';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  isActive: boolean;
}

export interface Salon {
  id: string;
  name: string;
  ownerId: string;
  address?: string;
  phone?: string;
}

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
  staffId?: string;
  status: 'confirmed' | 'completed' | 'cancelled' | 'pending';
}

export interface AuthState {
  user: User | null;
  token: string | null;
  currentSalonId: string | null;
  salons: Salon[];
  loading: boolean;
  error: string | null;
}
