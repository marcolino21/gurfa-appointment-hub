
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
  workSchedule?: {
    day: string;
    isWorking: boolean;
    startTime?: string;
    endTime?: string;
    breakStart?: string;
    breakEnd?: string;
  }[];
}
