
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
  firstName: string;
  lastName: string;
  email: string;
  isActive: boolean;
  showInCalendar: boolean;
  salonId: string;
  phone?: string;
  additionalPhone?: string;
  country?: string;
  birthDate?: string;
  position?: string;
  color?: string;
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
