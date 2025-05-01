import { SystemFeature } from '@/features/staff/types/permissions';

export interface WorkScheduleDay {
  day: string;
  isWorking: boolean;
  startTime?: string;
  endTime?: string;
  breakStart?: string;
  breakEnd?: string;
}

export interface StaffMember {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  color?: string;
  isVisible?: boolean;
  role?: string;
  department?: string;
  workingHours?: {
    start: string;
    end: string;
  }[];
  daysOff?: string[];
  firstName: string;
  lastName: string;
  isActive: boolean;
  showInCalendar: boolean;
  salonId: string;
  additionalPhone?: string;
  country?: string;
  birthDate?: string;
  position?: string;
  assignedServiceIds?: string[];
  permissions?: SystemFeature[];
  workSchedule?: WorkScheduleDay[];
}

// Helper function to get staff member's full name
export function getStaffMemberName(staff: StaffMember): string {
  return staff.firstName && staff.lastName 
    ? `${staff.firstName} ${staff.lastName}`.trim()
    : staff.firstName || staff.lastName || 'Operatore';
}

// Factory function to create a new staff member
export function createStaffMember(data: Omit<StaffMember, 'id'>): StaffMember {
  return {
    ...data,
    id: crypto.randomUUID()
  };
}
