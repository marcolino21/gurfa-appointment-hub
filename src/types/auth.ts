
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

export interface AuthState {
  user: User | null;
  token: string | null;
  currentSalonId: string | null;
  salons: Salon[];
  loading: boolean;
  error: string | null;
}
