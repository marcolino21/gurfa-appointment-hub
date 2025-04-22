
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
  
  // Add a computed name property
  readonly name: string;
}

// Add a utility function to compute name if needed
export function getStaffMemberName(staffMember: StaffMember): string {
  return staffMember.firstName && staffMember.lastName 
    ? `${staffMember.firstName} ${staffMember.lastName}` 
    : staffMember.firstName || staffMember.lastName || 'Operatore';
}
