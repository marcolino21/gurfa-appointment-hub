
export interface Client {
  id: string;
  firstName: string;
  lastName: string;
  phone?: string;
  email?: string;
  gender: 'M' | 'F' | 'O';
  salonId: string;
  address?: string;
  city?: string;
  zipCode?: string;
  dateOfBirth?: string;
  height?: number;
  weight?: number;
  fiscalCode?: string;
  loyaltyCode?: string;
  notes?: string;
  isPrivate: boolean;
  appointmentsCount?: number;
  lastAppointment?: string;
  averageSpending?: number;
  visitFrequency?: string;
  // Business fields
  companyName?: string;
  vatNumber?: string;
  sdiCode?: string;
  pecEmail?: string;
}
