
import { useState, useEffect } from 'react';
import { StaffMember, Service } from '@/types';
import { MOCK_STAFF, MOCK_SERVICES } from '@/data/mockData';
import { useToast } from '@/hooks/use-toast';
import { StaffFormValues } from '../types';
import { supabase } from '@/integrations/supabase/client';
import { debugStaffData } from '../utils/staffUtils';

// Default salon ID for testing purposes when currentSalonId is null
const DEFAULT_SALON_ID = 'sa1';

export const useStaffData = (salonId: string | null) => {
  // Use default salon ID if none provided
  const effectiveSalonId = salonId || DEFAULT_SALON_ID;
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  console.log("useStaffData hook initialized with salonId:", salonId, "effectiveSalonId:", effectiveSalonId);

  // Fetch staff data from Supabase
  useEffect(() => {
    const fetchStaffData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        console.log("Fetching staff data from Supabase for salon:", effectiveSalonId);
        
        // Fetch staff from Supabase
        const { data: staffData, error: staffError } = await supabase
          .from('staff')
          .select('*')
          .eq('salon_id', effectiveSalonId);

        if (staffError) {
          console.error("Error fetching staff:", staffError);
          setError(`Error fetching staff: ${staffError.message}`);
          
          // Fallback to mock data if Supabase query fails
          console.log("Falling back to mock data for staff");
          if (!MOCK_STAFF[effectiveSalonId]) {
            MOCK_STAFF[effectiveSalonId] = [];
          }
          setStaffMembers(MOCK_STAFF[effectiveSalonId]);
        } else {
          console.log("Successfully fetched staff data from Supabase:", staffData);
          setStaffMembers(staffData || []);
        }
        
        // For services, continue using mock data for now
        if (!MOCK_SERVICES[effectiveSalonId]) {
          MOCK_SERVICES[effectiveSalonId] = [];
        }
        setServices(MOCK_SERVICES[effectiveSalonId]);
      } catch (e) {
        console.error("Unexpected error in fetchStaffData:", e);
        setError(`Unexpected error: ${e instanceof Error ? e.message : 'Unknown error'}`);
        
        // Fallback to mock data
        if (!MOCK_STAFF[effectiveSalonId]) {
          MOCK_STAFF[effectiveSalonId] = [];
        }
        setStaffMembers(MOCK_STAFF[effectiveSalonId]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStaffData();
  }, [effectiveSalonId]);

  const addStaff = async (data: StaffFormValues) => {
    console.log("Adding staff with salon ID:", effectiveSalonId, "Data:", data);

    // Create staff with required fields explicitly defined
    const newStaff: StaffMember = {
      id: `staff${Math.random().toString(36).substr(2, 9)}`, // Will be overridden by Supabase
      firstName: data.firstName,
      lastName: data.lastName || '',
      email: data.email,
      isActive: data.isActive,
      showInCalendar: data.showInCalendar, 
      salonId: effectiveSalonId,
      phone: data.phone,
      additionalPhone: data.additionalPhone,
      country: data.country,
      birthDate: data.birthDate,
      position: data.position, 
      color: data.color,
      assignedServiceIds: data.assignedServiceIds || [],
    };

    try {
      // Insert into Supabase
      const { data: insertedData, error: insertError } = await supabase
        .from('staff')
        .insert([
          {
            first_name: newStaff.firstName,
            last_name: newStaff.lastName,
            email: newStaff.email,
            phone: newStaff.phone,
            additional_phone: newStaff.additionalPhone,
            country: newStaff.country,
            birth_date: newStaff.birthDate,
            position: newStaff.position,
            color: newStaff.color,
            salon_id: newStaff.salonId,
            is_active: newStaff.isActive,
            show_in_calendar: newStaff.showInCalendar,
            assigned_service_ids: newStaff.assignedServiceIds,
          }
        ])
        .select();

      if (insertError) {
        console.error("Error inserting staff into Supabase:", insertError);
        toast({
          title: 'Errore',
          description: `Si è verificato un errore: ${insertError.message}`,
          variant: 'destructive'
        });
        return null;
      }

      console.log("Successfully inserted staff into Supabase:", insertedData);

      // Map the inserted data back to our StaffMember type
      const insertedStaff: StaffMember = insertedData && insertedData[0] ? {
        id: insertedData[0].id,
        firstName: insertedData[0].first_name,
        lastName: insertedData[0].last_name,
        email: insertedData[0].email,
        phone: insertedData[0].phone || undefined,
        additionalPhone: insertedData[0].additional_phone || undefined,
        country: insertedData[0].country || undefined,
        birthDate: insertedData[0].birth_date || undefined,
        position: insertedData[0].position || undefined,
        color: insertedData[0].color || undefined,
        salonId: insertedData[0].salon_id,
        isActive: insertedData[0].is_active,
        showInCalendar: insertedData[0].show_in_calendar,
        assignedServiceIds: insertedData[0].assigned_service_ids || [],
        permissions: insertedData[0].permissions || [],
        work_schedule: insertedData[0].work_schedule,
      } : newStaff;

      // Update local state
      setStaffMembers(prevStaff => [...prevStaff, insertedStaff]);
      
      // Show success toast
      toast({
        title: 'Membro dello staff aggiunto',
        description: `${insertedStaff.firstName} ${insertedStaff.lastName} è stato aggiunto con successo`,
      });
      
      return insertedStaff;
    } catch (e) {
      console.error("Unexpected error in addStaff:", e);
      
      toast({
        title: 'Errore',
        description: `Si è verificato un errore inaspettato: ${e instanceof Error ? e.message : 'Errore sconosciuto'}`,
        variant: 'destructive'
      });
      
      return null;
    }
  };

  const editStaff = async (staffId: string, data: StaffFormValues) => {
    try {
      const { error: updateError } = await supabase
        .from('staff')
        .update({
          first_name: data.firstName,
          last_name: data.lastName || '',
          email: data.email,
          phone: data.phone,
          additional_phone: data.additionalPhone,
          country: data.country,
          birth_date: data.birthDate,
          position: data.position,
          color: data.color,
          is_active: data.isActive,
          show_in_calendar: data.showInCalendar,
          assigned_service_ids: data.assignedServiceIds || [],
        })
        .eq('id', staffId);

      if (updateError) {
        console.error("Error updating staff in Supabase:", updateError);
        toast({
          title: 'Errore',
          description: `Si è verificato un errore: ${updateError.message}`,
          variant: 'destructive'
        });
        return;
      }

      // Update local state
      const updatedStaff = staffMembers.map(staff => 
        staff.id === staffId ? {
          ...staff,
          firstName: data.firstName,
          lastName: data.lastName || '',
          email: data.email,
          isActive: data.isActive,
          showInCalendar: data.showInCalendar,
          phone: data.phone,
          additionalPhone: data.additionalPhone,
          country: data.country,
          birthDate: data.birthDate,
          position: data.position,
          color: data.color,
          assignedServiceIds: data.assignedServiceIds || [],
        } : staff
      );

      setStaffMembers(updatedStaff);
      
      toast({
        title: 'Membro dello staff modificato',
        description: `${data.firstName} ${data.lastName} è stato modificato con successo`,
      });
    } catch (e) {
      console.error("Unexpected error in editStaff:", e);
      
      toast({
        title: 'Errore',
        description: `Si è verificato un errore inaspettato: ${e instanceof Error ? e.message : 'Errore sconosciuto'}`,
        variant: 'destructive'
      });
    }
  };

  const deleteStaff = async (staffId: string) => {
    try {
      const { error: deleteError } = await supabase
        .from('staff')
        .delete()
        .eq('id', staffId);

      if (deleteError) {
        console.error("Error deleting staff in Supabase:", deleteError);
        toast({
          title: 'Errore',
          description: `Si è verificato un errore: ${deleteError.message}`,
          variant: 'destructive'
        });
        return;
      }

      // Update local state
      const updatedStaff = staffMembers.filter(staff => staff.id !== staffId);
      setStaffMembers(updatedStaff);
      
      toast({
        title: 'Membro dello staff eliminato',
        description: 'Il membro dello staff è stato eliminato con successo',
      });
    } catch (e) {
      console.error("Unexpected error in deleteStaff:", e);
      
      toast({
        title: 'Errore',
        description: `Si è verificato un errore inaspettato: ${e instanceof Error ? e.message : 'Errore sconosciuto'}`,
        variant: 'destructive'
      });
    }
  };

  const toggleStaffStatus = async (staffId: string, isActive: boolean) => {
    try {
      const { error: updateError } = await supabase
        .from('staff')
        .update({ is_active: isActive })
        .eq('id', staffId);

      if (updateError) {
        console.error("Error toggling staff status in Supabase:", updateError);
        toast({
          title: 'Errore',
          description: `Si è verificato un errore: ${updateError.message}`,
          variant: 'destructive'
        });
        return;
      }

      // Update local state
      const updatedStaff = staffMembers.map(staff => 
        staff.id === staffId ? { ...staff, isActive } : staff
      );
      setStaffMembers(updatedStaff);
      
      toast({
        title: isActive ? 'Membro dello staff attivato' : 'Membro dello staff disattivato',
        description: `Il membro dello staff è stato ${isActive ? 'attivato' : 'disattivato'} con successo`,
      });
    } catch (e) {
      console.error("Unexpected error in toggleStaffStatus:", e);
      
      toast({
        title: 'Errore',
        description: `Si è verificato un errore inaspettato: ${e instanceof Error ? e.message : 'Errore sconosciuto'}`,
        variant: 'destructive'
      });
    }
  };

  const toggleCalendarVisibility = async (staffId: string, showInCalendar: boolean) => {
    try {
      const { error: updateError } = await supabase
        .from('staff')
        .update({ show_in_calendar: showInCalendar })
        .eq('id', staffId);

      if (updateError) {
        console.error("Error toggling calendar visibility in Supabase:", updateError);
        toast({
          title: 'Errore',
          description: `Si è verificato un errore: ${updateError.message}`,
          variant: 'destructive'
        });
        return;
      }

      // Update local state
      const updatedStaff = staffMembers.map(staff => 
        staff.id === staffId ? { ...staff, showInCalendar } : staff
      );
      setStaffMembers(updatedStaff);
      
      toast({
        title: showInCalendar ? 'Visibile in agenda' : 'Nascosto dall\'agenda',
        description: `Il membro dello staff sarà ${showInCalendar ? 'visibile' : 'nascosto'} nell'agenda`,
      });
    } catch (e) {
      console.error("Unexpected error in toggleCalendarVisibility:", e);
      
      toast({
        title: 'Errore',
        description: `Si è verificato un errore inaspettato: ${e instanceof Error ? e.message : 'Errore sconosciuto'}`,
        variant: 'destructive'
      });
    }
  };

  return {
    staffMembers,
    services,
    addStaff,
    editStaff,
    deleteStaff,
    toggleStaffStatus,
    toggleCalendarVisibility,
    isLoading,
    error,
  };
};
