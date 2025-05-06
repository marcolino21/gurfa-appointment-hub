import { supabase } from '@/integrations/supabase/client';
import { StaffMember } from '@/types';
import { mapDbToStaffMember, mapStaffMemberToDb } from './staffConverters';

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

  return (staffData || []).map(mapDbToStaffMember);
};

/**
 * Update staff data for a salon
 */
export const updateStaffData = async (salonId: string, staffMember: Partial<StaffMember>): Promise<void> => {
  const dbStaffMember = mapStaffMemberToDb(staffMember);

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
  // Check if email already exists
  if (staffMember.email) {
    const { data: existingStaff, error: checkError } = await supabase
      .from('staff')
      .select('id')
      .eq('email', staffMember.email)
      .maybeSingle();

    if (checkError) {
      console.error("Error checking for existing email:", checkError);
    } else if (existingStaff) {
      // Custom error for duplicate email
      const error = new Error('Email già utilizzata');
      error.name = 'DuplicateEmailError';
      throw error;
    }
  }

  // Preparo solo i campi esistenti nella tabella staff
  const dbStaffMember = {
    first_name: staffMember.firstName,
    last_name: staffMember.lastName || '',
    email: staffMember.email,
    is_active: staffMember.isActive ?? true,
    show_in_calendar: staffMember.showInCalendar ?? true,
    phone: staffMember.phone || '',
    additional_phone: staffMember.additionalPhone || '',
    country: staffMember.country || 'Italia',
    birth_date: staffMember.birthDate || '',
    position: staffMember.position || '',
    color: staffMember.color || '#9b87f5',
    assigned_service_ids: staffMember.assignedServiceIds || [],
    permissions: staffMember.permissions || [],
    work_schedule: staffMember.workSchedule || [],
    salon_id: staffMember.salonId,
  };

  const { data, error } = await supabase
    .from('staff')
    .insert(dbStaffMember)
    .select()
    .single();

  if (error) {
    alert("Errore Supabase: " + error.message); // Mostra l'errore a schermo
    console.error("Error adding staff:", error);
    // Check if it's a duplicate email error from the database
    if (error.code === '23505' && error.message.includes('staff_email_key')) {
      const customError = new Error('Email già utilizzata');
      customError.name = 'DuplicateEmailError';
      throw customError;
    }
    throw error;
  }

  return mapDbToStaffMember(data);
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

  return mapDbToStaffMember(data);
};
