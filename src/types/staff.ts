
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
  // Aggiungiamo questi campi per compatibilità con il database
  permissions?: string[];
  work_schedule?: any;
}
