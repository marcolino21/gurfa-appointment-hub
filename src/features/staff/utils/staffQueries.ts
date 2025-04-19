
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
  const dbStaffMember = {
    ...mapStaffMemberToDb(staffMember),
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
