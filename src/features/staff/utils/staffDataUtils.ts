
import { StaffMember } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { Json } from '@/integrations/supabase/types';
import { SystemFeature } from '../types/permissions';

/**
 * Get all staff members for a salon
 */
export const getSalonStaff = async (salonId: string): Promise<StaffMember[]> => {
  const { data: staffData, error } = await supabase
    .from('staff')
    .select('*')
    .eq('salon_id', salonId)
    .order('created_at', { ascending: true });

  if (error) {
    console.error("Error fetching staff:", error);
    throw error;
  }

  // Convert database snake_case to camelCase for our app
  return (staffData || []).map(staff => ({
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
    // Explicitly cast permissions from string[] to SystemFeature[]
    permissions: (staff.permissions || []) as SystemFeature[],
    // Parse JSON string or object to WorkScheduleDay[] if needed
    workSchedule: parseWorkSchedule(staff.work_schedule)
  }));
};

// Helper function to parse work schedule from database
const parseWorkSchedule = (workScheduleData: Json): StaffMember['workSchedule'] => {
  if (!workScheduleData) return [];
  
  if (typeof workScheduleData === 'string') {
    try {
      return JSON.parse(workScheduleData);
    } catch (e) {
      console.error("Error parsing work schedule:", e);
      return [];
    }
  }
  
  return workScheduleData as StaffMember['workSchedule'];
};

/**
 * Update staff data for a salon
 */
export const updateStaffData = async (salonId: string, staffMember: Partial<StaffMember>): Promise<void> => {
  // Convert our camelCase properties to snake_case for the database
  // Also make sure to properly handle type conversions for work_schedule and permissions
  const dbStaffMember = {
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
    // Cast SystemFeature[] to string[] for database storage
    permissions: staffMember.permissions as unknown as string[],
    // Stringify work schedule for storage if needed
    work_schedule: staffMember.workSchedule as unknown as Json
  };

  const { error } = await supabase
    .from('staff')
    .update(dbStaffMember)
    .eq('salon_id', salonId)
    .eq('id', staffMember.id);

  if (error) {
    console.error("Error updating staff:", error);
    throw error;
  }

  // Dispatch an event to notify other components that staff data has changed
  const event = new CustomEvent('staffDataUpdated', {
    detail: { 
      salonId,
      type: 'fullUpdate'
    }
  });
  window.dispatchEvent(event);
};

/**
 * Add a new staff member
 */
export const addStaffMember = async (salonId: string, staffMember: Omit<StaffMember, 'id'>): Promise<StaffMember> => {
  // Convert our camelCase properties to snake_case for the database
  const dbStaffMember = {
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
    // Cast SystemFeature[] to string[] for database storage
    permissions: staffMember.permissions as unknown as string[],
    // Stringify work schedule for storage if needed
    work_schedule: staffMember.workSchedule as unknown as Json,
    salon_id: salonId
  };

  const { data, error } = await supabase
    .from('staff')
    .insert(dbStaffMember)
    .select()
    .single();

  if (error) {
    console.error("Error adding staff:", error);
    throw error;
  }

  // Convert database snake_case to camelCase for our app
  return {
    id: data.id,
    firstName: data.first_name,
    lastName: data.last_name,
    email: data.email || '',
    isActive: data.is_active,
    showInCalendar: data.show_in_calendar,
    salonId: data.salon_id,
    phone: data.phone || '',
    additionalPhone: data.additional_phone || '',
    country: data.country || 'Italia',
    birthDate: data.birth_date || '',
    position: data.position || '',
    color: data.color || '#9b87f5',
    assignedServiceIds: data.assigned_service_ids || [],
    // Explicitly cast permissions from string[] to SystemFeature[]
    permissions: (data.permissions || []) as SystemFeature[],
    // Parse JSON string or object to WorkScheduleDay[]
    workSchedule: parseWorkSchedule(data.work_schedule)
  };
};

/**
 * Delete a staff member
 */
export const deleteStaffMember = async (salonId: string, staffId: string): Promise<void> => {
  const { error } = await supabase
    .from('staff')
    .delete()
    .eq('salon_id', salonId)
    .eq('id', staffId);

  if (error) {
    console.error("Error deleting staff:", error);
    throw error;
  }
};

/**
 * Get a single staff member by ID
 */
export const getStaffMember = async (salonId: string, staffId: string): Promise<StaffMember | null> => {
  const { data, error } = await supabase
    .from('staff')
    .select('*')
    .eq('salon_id', salonId)
    .eq('id', staffId)
    .single();

  if (error) {
    console.error("Error fetching staff member:", error);
    return null;
  }

  // Convert database snake_case to camelCase for our app
  return {
    id: data.id,
    firstName: data.first_name,
    lastName: data.last_name,
    email: data.email || '',
    isActive: data.is_active,
    showInCalendar: data.show_in_calendar,
    salonId: data.salon_id,
    phone: data.phone || '',
    additionalPhone: data.additional_phone || '',
    country: data.country || 'Italia',
    birthDate: data.birth_date || '',
    position: data.position || '',
    color: data.color || '#9b87f5',
    assignedServiceIds: data.assigned_service_ids || [],
    // Explicitly cast permissions from string[] to SystemFeature[]
    permissions: (data.permissions || []) as SystemFeature[],
    // Parse JSON string or object to WorkScheduleDay[]
    workSchedule: parseWorkSchedule(data.work_schedule)
  };
};
