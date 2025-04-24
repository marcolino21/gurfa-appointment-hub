
import { useMemo } from 'react';
import { useAppointments } from '@/contexts/AppointmentContext';
import { useStaffAppointments } from './useStaffAppointments';
import { StaffMember } from '@/types';
import { Appointment } from '@/types';

export const useAppointmentEvents = () => {
  const { filteredAppointments } = useAppointments();
  const { visibleStaff } = useStaffAppointments();

  // Funzione di utility per normalizzare staffId
  const normalizeStaffId = (staffId: any): string | undefined => {
    if (staffId === null || staffId === undefined) return undefined;
    
    if (typeof staffId === 'object' && staffId !== null && 'value' in staffId) {
      return staffId.value === 'undefined' ? undefined : String(staffId.value);
    }
    
    if (Array.isArray(staffId) && staffId.length > 0) {
      if (staffId[0] && typeof staffId[0] === 'object' && 'staffId' in staffId[0]) {
        const firstStaffId = staffId[0].staffId;
        return firstStaffId ? String(firstStaffId) : undefined;
      }
      return undefined;
    }
    
    return staffId ? String(staffId) : undefined;
  };

  // Funzione per ottenere il colore corretto per lo stato dell'appuntamento
  const getStatusColor = (status: string): string => {
    switch(status) {
      case 'confirmed': return '#10b981'; // green
      case 'completed': return '#3b82f6'; // blue
      case 'cancelled': return '#ef4444'; // red
      case 'pending':
      default: return '#f59e0b'; // amber
    }
  };

  // Converti gli appuntamenti in eventi per il calendario
  const events = useMemo(() => {
    if (!filteredAppointments.length) return [];
    
    console.log("Converting appointments to events:", filteredAppointments);
    
    return filteredAppointments.map((appointment: Appointment) => {
      const staffId = normalizeStaffId(appointment.staffId);
      console.log(`Appointment ${appointment.id} has staffId: ${staffId}`);
      
      // Tenta di determinare lo staffId dalle serviceEntries
      let eventStaffId = staffId;
      if (!eventStaffId && appointment.serviceEntries && appointment.serviceEntries.length > 0) {
        eventStaffId = appointment.serviceEntries[0].staffId;
        console.log(`Using staffId from serviceEntries: ${eventStaffId}`);
      }
      
      // Se ancora non abbiamo uno staffId valido e ci sono operatori disponibili, assegnamo il primo
      if (!eventStaffId && visibleStaff.length > 0) {
        eventStaffId = visibleStaff[0].id;
        console.log(`Assigned default staffId: ${eventStaffId}`);
      }
      
      // Trova il membro dello staff corrispondente
      const staffMember: StaffMember | undefined = eventStaffId 
        ? visibleStaff.find(staff => staff.id === eventStaffId) 
        : undefined;
      
      // Assegna un colore appropriato in base allo stato
      const borderColor = getStatusColor(appointment.status);
      
      return {
        id: appointment.id,
        title: appointment.title || appointment.service || "Appuntamento",
        resourceId: eventStaffId, // Usa lo staffId normalizzato
        start: appointment.start,
        end: appointment.end,
        backgroundColor: staffMember?.color || '#9b87f5',
        textColor: '#ffffff',
        borderColor,
        borderLeft: `4px solid ${borderColor}`,
        extendedProps: {
          clientName: appointment.clientName,
          clientPhone: appointment.clientPhone,
          service: appointment.service,
          status: appointment.status,
          notes: appointment.notes,
          staffName: staffMember ? `${staffMember.firstName} ${staffMember.lastName}` : ''
        }
      };
    });
  }, [filteredAppointments, visibleStaff]);

  return { events };
};
