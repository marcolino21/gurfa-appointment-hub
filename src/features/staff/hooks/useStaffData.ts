import { useState, useEffect } from 'react';
import { StaffMember, Service } from '@/types';
import { MOCK_STAFF, MOCK_SERVICES } from '@/data/mockData';
import { useToast } from '@/hooks/use-toast';
import { StaffFormValues, WorkScheduleDay } from '../types';

export const useStaffData = (salonId: string | null) => {
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>(
    salonId ? MOCK_STAFF[salonId] || [] : []
  );
  const [services, setServices] = useState<Service[]>(
    salonId ? MOCK_SERVICES[salonId] || [] : []
  );
  const { toast } = useToast();

  // Aggiorna i membri dello staff quando cambia il salonId
  useEffect(() => {
    if (salonId) {
      setStaffMembers(MOCK_STAFF[salonId] || []);
      setServices(MOCK_SERVICES[salonId] || []);
    }
  }, [salonId]);

  const addStaff = (data: StaffFormValues) => {
    // Verifichiamo se salonId è definito, altrimenti usiamo un ID temporaneo
    const effectiveSalonId = salonId || 'temp_salon_id';
    
    console.log("Adding staff with data:", data);
    console.log("Current salonId:", effectiveSalonId);

    // Ensure workSchedule days and isWorking are properly defined
    const workSchedule: WorkScheduleDay[] = data.workSchedule.map(day => ({
      day: day.day,
      isWorking: Boolean(day.isWorking),
      startTime: day.startTime || '',
      endTime: day.endTime || '',
      breakStart: day.breakStart || '',
      breakEnd: day.breakEnd || '',
    }));

    // Create staff with required fields explicitly defined
    const newStaff: StaffMember = {
      id: `staff${Math.random().toString(36).substr(2, 9)}`,
      firstName: data.firstName,
      lastName: data.lastName || '', // Ensure it's never undefined
      email: data.email,
      isActive: Boolean(data.isActive),
      showInCalendar: Boolean(data.showInCalendar), 
      salonId: effectiveSalonId,
      // Optional fields
      phone: data.phone || '',
      additionalPhone: data.additionalPhone || '',
      country: data.country || 'Italia',
      birthDate: data.birthDate || '',
      position: data.position || '', 
      color: data.color || '#9b87f5',
      assignedServiceIds: Array.isArray(data.assignedServiceIds) ? data.assignedServiceIds : [],
      workSchedule: workSchedule,
    };

    console.log("New staff object:", newStaff);

    // Update local state and mock data
    setStaffMembers(prev => [...prev, newStaff]);
    
    // Update mock data for persistence between pages
    if (!MOCK_STAFF[effectiveSalonId]) {
      MOCK_STAFF[effectiveSalonId] = [];
    }
    MOCK_STAFF[effectiveSalonId] = [...MOCK_STAFF[effectiveSalonId], newStaff];
    
    toast({
      title: 'Membro dello staff aggiunto',
      description: `${newStaff.firstName} ${newStaff.lastName} è stato aggiunto con successo`,
    });
    
    return newStaff;
  };

  const editStaff = (staffId: string, data: StaffFormValues) => {
    if (!salonId) {
      toast({
        title: 'Errore',
        description: 'Impossibile modificare il membro dello staff: salonId non definito',
        variant: 'destructive',
      });
      return;
    }

    // Ensure workSchedule days and isWorking are properly defined
    const workSchedule: WorkScheduleDay[] = data.workSchedule.map(day => ({
      day: day.day,
      isWorking: Boolean(day.isWorking),
      startTime: day.startTime || '',
      endTime: day.endTime || '',
      breakStart: day.breakStart || '',
      breakEnd: day.breakEnd || '',
    }));

    const updatedStaff = staffMembers.map(staff => 
      staff.id === staffId ? {
        ...staff,
        firstName: data.firstName,
        lastName: data.lastName || '',
        email: data.email,
        isActive: Boolean(data.isActive),
        showInCalendar: Boolean(data.showInCalendar),
        phone: data.phone || '',
        additionalPhone: data.additionalPhone || '',
        country: data.country || 'Italia',
        birthDate: data.birthDate || '',
        position: data.position || '',
        color: data.color || '#9b87f5',
        assignedServiceIds: Array.isArray(data.assignedServiceIds) ? data.assignedServiceIds : [],
        workSchedule: workSchedule,
      } : staff
    );

    setStaffMembers(updatedStaff);
    
    // Update mock data for persistence
    if (salonId && MOCK_STAFF[salonId]) {
      MOCK_STAFF[salonId] = updatedStaff;
    }
    
    toast({
      title: 'Membro dello staff modificato',
      description: `${data.firstName} ${data.lastName} è stato modificato con successo`,
    });
  };

  const deleteStaff = (staffId: string) => {
    const updatedStaff = staffMembers.filter(staff => staff.id !== staffId);
    setStaffMembers(updatedStaff);
    
    // Aggiorniamo anche il mock data
    if (salonId && MOCK_STAFF[salonId]) {
      MOCK_STAFF[salonId] = updatedStaff;
    }
    
    toast({
      title: 'Membro dello staff eliminato',
      description: 'Il membro dello staff è stato eliminato con successo',
    });
  };

  const toggleStaffStatus = (staffId: string, isActive: boolean) => {
    const updatedStaff = staffMembers.map(staff => 
      staff.id === staffId ? { ...staff, isActive } : staff
    );
    setStaffMembers(updatedStaff);
    
    // Aggiorniamo anche il mock data
    if (salonId && MOCK_STAFF[salonId]) {
      MOCK_STAFF[salonId] = updatedStaff;
    }
    
    toast({
      title: isActive ? 'Membro dello staff attivato' : 'Membro dello staff disattivato',
      description: `Il membro dello staff è stato ${isActive ? 'attivato' : 'disattivato'} con successo`,
    });
  };

  const toggleCalendarVisibility = (staffId: string, showInCalendar: boolean) => {
    const updatedStaff = staffMembers.map(staff => 
      staff.id === staffId ? { ...staff, showInCalendar } : staff
    );
    setStaffMembers(updatedStaff);
    
    // Aggiorniamo anche il mock data
    if (salonId && MOCK_STAFF[salonId]) {
      MOCK_STAFF[salonId] = updatedStaff;
    }
    
    toast({
      title: showInCalendar ? 'Visibile in agenda' : 'Nascosto dall\'agenda',
      description: `Il membro dello staff sarà ${showInCalendar ? 'visibile' : 'nascosto'} nell'agenda`,
    });
  };

  return {
    staffMembers,
    services,
    addStaff,
    editStaff,
    deleteStaff,
    toggleStaffStatus,
    toggleCalendarVisibility,
  };
};
