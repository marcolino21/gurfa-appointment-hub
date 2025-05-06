
import { useState, useEffect } from 'react';
import { StaffMember, Service } from '@/types';
import { MOCK_STAFF, MOCK_SERVICES } from '@/data/mockData';
import { useToast } from '@/hooks/use-toast';
import { StaffFormValues } from '../types';

export const useStaffData = (salonId: string | null) => {
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const { toast } = useToast();

  // Sincronizziamo lo stato locale con i dati mock all'inizializzazione
  // e quando cambia il salonId
  useEffect(() => {
    if (salonId) {
      // Verifichiamo se esiste l'elemento per il salonId
      if (!MOCK_STAFF[salonId]) {
        MOCK_STAFF[salonId] = [];
      }

      if (!MOCK_SERVICES[salonId]) {
        MOCK_SERVICES[salonId] = [];
      }
      
      console.log("Syncing staff data from mock:", MOCK_STAFF[salonId]);
      setStaffMembers(MOCK_STAFF[salonId] || []);
      setServices(MOCK_SERVICES[salonId] || []);
    }
  }, [salonId]);

  const addStaff = (data: StaffFormValues) => {
    if (!salonId) return null;

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
      assignedServiceIds: data.assignedServiceIds || [],
    };

    console.log("Adding new staff member:", newStaff);

    // Inizializziamo l'array se non esiste
    if (!MOCK_STAFF[salonId]) {
      MOCK_STAFF[salonId] = [];
    }
    
    // Aggiungiamo il nuovo membro ai dati mock
    MOCK_STAFF[salonId] = [...MOCK_STAFF[salonId], newStaff];
    console.log("Updated mock staff data:", MOCK_STAFF[salonId]);
    
    // Aggiorniamo anche lo state con il nuovo membro dello staff
    setStaffMembers(prevStaff => [...prevStaff, newStaff]);
    
    // Mostriamo il toast di conferma
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
        assignedServiceIds: data.assignedServiceIds || [],
      } : staff
    );

    console.log("Editing staff member, updated list:", updatedStaff);

    // Aggiorniamo anche i dati mock
    if (salonId) {
      MOCK_STAFF[salonId] = updatedStaff;
      console.log("Updated mock staff data after edit:", MOCK_STAFF[salonId]);
    }
    
    // Aggiorniamo lo stato locale
    setStaffMembers(updatedStaff);
    
    toast({
      title: 'Membro dello staff modificato',
      description: `${data.firstName} ${data.lastName} è stato modificato con successo`,
    });
  };

  const deleteStaff = (staffId: string) => {
    const updatedStaff = staffMembers.filter(staff => staff.id !== staffId);
    console.log("Deleting staff member, updated list:", updatedStaff);
    
    // Aggiorniamo anche i dati mock
    if (salonId) {
      MOCK_STAFF[salonId] = updatedStaff;
      console.log("Updated mock staff data after delete:", MOCK_STAFF[salonId]);
    }
    
    // Aggiorniamo lo stato locale
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
    console.log("Toggling staff status, updated list:", updatedStaff);
    
    // Aggiorniamo anche i dati mock
    if (salonId) {
      MOCK_STAFF[salonId] = updatedStaff;
    }
    
    // Aggiorniamo lo stato locale
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
    console.log("Toggling calendar visibility, updated list:", updatedStaff);
    
    // Aggiorniamo anche i dati mock
    if (salonId) {
      MOCK_STAFF[salonId] = updatedStaff;
    }
    
    // Aggiorniamo lo stato locale
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
