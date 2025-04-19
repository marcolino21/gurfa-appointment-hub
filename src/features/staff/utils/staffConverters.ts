
import { StaffMember } from '@/types';
import { Json } from '@/integrations/supabase/types';
import { SystemFeature } from '../types/permissions';

/**
 * Parse work schedule from database format to application format
 */
export const parseWorkSchedule = (workScheduleData: Json): StaffMember['workSchedule'] => {
  if (!workScheduleData) return [];
  
  if (typeof workScheduleData === 'string') {
    try {
      return JSON.parse(workScheduleData) as StaffMember['workSchedule'];
    } catch (e) {
      console.error("Error parsing work schedule:", e);
      return [];
    }
  }
  
  // Make sure the data is an array before casting
  if (Array.isArray(workScheduleData)) {
    // Validate that each item has the required properties
    const isValidWorkSchedule = workScheduleData.every(item => 
      typeof item === 'object' && 
      item !== null && 
      'day' in item && 
      'isWorking' in item
    );
    
    if (isValidWorkSchedule) {
      // First cast to unknown, then to the target type to satisfy TypeScript
      return workScheduleData as unknown as StaffMember['workSchedule'];
    }
  }
  
  console.warn('Invalid work schedule format, returning empty array', workScheduleData);
  return [];
};

/**
 * Convert database staff record to application StaffMember type
 */
export const mapDbToStaffMember = (staff: any): StaffMember => ({
  id: staff.id,
  firstName: staff.first_name,
  lastName: staff.last_name,
  email: staff.email || '',
  isActive: staff.is_active,
  showInCalendar: staff.show_in_calendar,
  salonId: staff.salon_id,
  phone: staff.phone || '',
  additionalPhone: staff.additional_phone || '',
  country: staff.country || 'Italia',
  birthDate: staff.birth_date || '',
  position: staff.position || '',
  color: staff.color || '#9b87f5',
  assignedServiceIds: staff.assigned_service_ids || [],
  permissions: (staff.permissions || []) as unknown as SystemFeature[],
  workSchedule: parseWorkSchedule(staff.work_schedule)
});

/**
 * Convert application StaffMember type to database format
 */
export const mapStaffMemberToDb = (staffMember: Partial<StaffMember>) => ({
  id: staffMember.id,
  first_name: staffMember.firstName,
  last_name: staffMember.lastName,
  email: staffMember.email,
  is_active: staffMember.isActive,
  show_in_calendar: staffMember.showInCalendar,
  phone: staffMember.phone,
  additional_phone: staffMember.additionalPhone,
  country: staffMember.country,
  birth_date: staffMember.birthDate,
  position: staffMember.position,
  color: staffMember.color,
  assigned_service_ids: staffMember.assignedServiceIds,
  permissions: staffMember.permissions as unknown as string[],
  work_schedule: staffMember.workSchedule as unknown as Json
});
