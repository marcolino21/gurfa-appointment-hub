
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
}

export interface Service {
  id: string;
  name: string;
  category: string;
  description?: string;
  duration: number;
  price: number;
  color: string;
  salonId: string;
  assignedStaffIds: string[];
}

export interface ServiceCategory {
  id: string;
  name: string;
  color: string;
  salonId: string;
}

export interface StaffMember {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  additionalPhone?: string;
  country?: string;
  birthDate?: string;
  position?: string;
  color?: string;
  salonId: string;
  isActive: boolean;
  showInCalendar: boolean;
  assignedServiceIds: string[];
  avatar?: string;
}

export type SubscriptionType = 'services' | 'entries';
export type PaymentMethod = 'credit_card' | 'paypal';
export type RecurrenceType = 'monthly' | 'quarterly' | 'annually';

export interface Subscription {
  id: string;
  name: string;
  type: SubscriptionType;
  serviceIds: string[];
  includeAllServices: boolean;
  entriesPerMonth?: number;
  price: number;
  discount?: number;
  clientId: string;
  paymentMethod: PaymentMethod;
  recurrenceType: RecurrenceType;
  cancellableImmediately: boolean;
  minDuration?: number; // in months
  maxDuration?: number; // in months
  sellOnline: boolean;
  geolocationRadius?: number; // in km
  geolocationEnabled: boolean;
  startDate: string;
  endDate?: string;
  status: 'active' | 'cancelled' | 'expired';
  salonId: string;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  currentSalonId: string | null;
  salons: Salon[];
  loading: boolean;
  error: string | null;
}
