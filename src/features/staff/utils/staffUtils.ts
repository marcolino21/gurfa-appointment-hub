
import { StaffMember } from '@/types';
import { supabase } from '@/integrations/supabase/client';

/**
 * Ottiene le iniziali da nome e cognome
 */
export const getInitials = (firstName: string, lastName?: string): string => {
  const firstInitial = firstName ? firstName.charAt(0).toUpperCase() : '';
  const lastInitial = lastName ? lastName.charAt(0).toUpperCase() : '';
  return `${firstInitial}${lastInitial}`;
};

/**
 * Filtra i membri dello staff in base a un termine di ricerca
 */
export const filterStaffMembers = (staffMembers: StaffMember[], searchTerm: string): StaffMember[] => {
  if (!searchTerm) return staffMembers;
  
  const term = searchTerm.toLowerCase();
  return staffMembers.filter(staff => {
    const fullName = `${staff.firstName} ${staff.lastName}`.toLowerCase();
    const email = staff.email?.toLowerCase() || '';
    return fullName.includes(term) || email.includes(term);
  });
};

/**
 * Ottiene il colore predefinito per i nuovi membri dello staff
 */
export const getDefaultStaffColor = (): string => {
  // Lista di colori predefiniti
  const colors = [
    '#9b87f5', // Viola
    '#4f46e5', // Indigo
    '#3b82f6', // Blu
    '#0ea5e9', // Azzurro
    '#10b981', // Verde
    '#f59e0b', // Arancione
    '#ef4444', // Rosso
  ];
  
  // Scegli un colore casuale dalla lista
  return colors[Math.floor(Math.random() * colors.length)];
};

/**
 * Debug utility per verificare i dati dello staff in Supabase
 */
export const debugStaffData = async (salonId: string | null, message: string): Promise<void> => {
  console.log(`DEBUG [${message}] - SalonID:`, salonId);
  
  if (salonId) {
    try {
      const { data, error } = await supabase
        .from('staff')
        .select('*')
        .eq('salon_id', salonId);
        
      if (error) {
        console.error(`Error fetching staff data for salon ${salonId}:`, error);
      } else {
        console.log(`Staff data from Supabase for salon ${salonId}:`, data);
      }
    } catch (e) {
      console.error('Error in debugStaffData:', e);
    }
    
    // Anche i dati mock per confronto
    try {
      const mockData = require('@/data/mockData').MOCK_STAFF[salonId];
      console.log(`Mock staff data for salon ${salonId}:`, mockData);
    } catch (e) {
      console.log('No mock data available for comparison');
    }
  } else {
    console.log('No salon ID provided for debugStaffData');
  }
};

/**
 * Converti un oggetto StaffMember in un formato compatibile con Supabase
 */
export const convertToSupabaseStaff = (staff: StaffMember) => {
  return {
    first_name: staff.firstName,
    last_name: staff.lastName,
    email: staff.email,
    phone: staff.phone,
    additional_phone: staff.additionalPhone,
    country: staff.country,
    birth_date: staff.birthDate,
    position: staff.position,
    color: staff.color,
    salon_id: staff.salonId,
    is_active: staff.isActive,
    show_in_calendar: staff.showInCalendar,
    assigned_service_ids: staff.assignedServiceIds,
  };
};

/**
 * Converti un oggetto di risposta Supabase in un StaffMember
 */
export const convertFromSupabaseStaff = (data: any): StaffMember => {
  return {
    id: data.id,
    firstName: data.first_name,
    lastName: data.last_name,
    email: data.email,
    phone: data.phone,
    additionalPhone: data.additional_phone,
    country: data.country,
    birthDate: data.birth_date,
    position: data.position,
    color: data.color,
    salonId: data.salon_id,
    isActive: data.is_active,
    showInCalendar: data.show_in_calendar,
    assignedServiceIds: data.assigned_service_ids || [],
    permissions: data.permissions,
    work_schedule: data.work_schedule,
  };
};
