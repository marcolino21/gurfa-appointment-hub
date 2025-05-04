
import { useState } from 'react';
import { StaffMember, Service } from '@/types';
import { MOCK_STAFF, MOCK_SERVICES } from '@/data/mockData';
import { useToast } from '@/hooks/use-toast';
import { StaffFormValues } from '../types';

export const useStaffData = (salonId: string | null) => {
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>(
    salonId ? MOCK_STAFF[salonId] || [] : []
  );
  const [services, setServices] = useState<Service[]>(
    salonId ? MOCK_SERVICES[salonId] || [] : []
  );
  const { toast } = useToast();

  const addStaff = (data: StaffFormValues) => {
    if (!salonId) return;

    // Create staff with required fields explicitly defined
    const newStaff: StaffMember = {
      id: `staff${Math.random().toString(36).substr(2, 9)}`,
      firstName: data.firstName,
      lastName: data.lastName || '', // Ensure it's never undefined
      email: data.email,
      isActive: data.isActive,
      showInCalendar: data.showInCalendar, 
      salonId: salonId,
      // Optional fields
      phone: data.phone,
      additionalPhone: data.additionalPhone,
      country: data.country,
      birthDate: data.birthDate,
      position: data.position, 
      color: data.color,
      assignedServiceIds: data.assignedServiceIds,
    };

    setStaffMembers([...staffMembers, newStaff]);
    toast({
      title: 'Membro dello staff aggiunto',
      description: `${newStaff.firstName} ${newStaff.lastName} è stato aggiunto con successo`,
    });
    
    return newStaff;
  };

  const editStaff = (staffId: string, data: StaffFormValues) => {
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
        assignedServiceIds: data.assignedServiceIds,
      } : staff
    );

    setStaffMembers(updatedStaff);
    toast({
      title: 'Membro dello staff modificato',
      description: `${data.firstName} ${data.lastName} è stato modificato con successo`,
    });
  };

  const deleteStaff = (staffId: string) => {
    const updatedStaff = staffMembers.filter(staff => staff.id !== staffId);
    setStaffMembers(updatedStaff);
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
