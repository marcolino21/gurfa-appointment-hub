export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'staff' | 'client';
  salon_id: string;
  currentSalonId?: string;
} 