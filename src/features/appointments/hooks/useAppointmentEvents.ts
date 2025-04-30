import { useMemo } from 'react';
import { useAppointments } from '@/contexts/AppointmentContext';
import { format, isAfter, isBefore, isSameDay } from 'date-fns';
import { it } from 'date-fns/locale';
import { CalendarEvent } from '../types';
import { useStaffAppointments } from './useStaffAppointments';
import { getStaffMemberName } from '@/types/staff';

export const useAppointmentEvents = () => {
  const { filteredAppointments, calendarUpdateTimestamp } = useAppointments();
  const { visibleStaff } = useStaffAppointments();

  // Map appointments to scheduler events
  const events = useMemo(() => {
    console.log("Mapping appointments to scheduler events:", filteredAppointments.length, "at timestamp", calendarUpdateTimestamp);
    
    return filteredAppointments.map(appointment => {
      try {
        const staffId = appointment.staffId || '';
        const staffMember = visibleStaff.find(staff => staff.id === staffId);
        const staffName = staffMember ? getStaffMemberName(staffMember) : 'Staff non assegnato';
        const title = `${appointment.clientName || 'Cliente non specificato'} - ${appointment.service || 'Servizio non specificato'}`;
        
        const start = new Date(appointment.start);
        const end = new Date(appointment.end);
        
        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
          console.error(`Invalid date for appointment ${appointment.id}`, { start: appointment.start, end: appointment.end });
          return null;
        }
        
        if (!isAfter(end, start)) {
          console.error(`Invalid date range for appointment ${appointment.id}: end date must be after start date`, {
            start: format(start, 'yyyy-MM-dd HH:mm', { locale: it }),
            end: format(end, 'yyyy-MM-dd HH:mm', { locale: it })
          });
          return null;
        }
        
        const now = new Date();
        if (isBefore(end, now)) {
          console.warn(`Appointment ${appointment.id} is in the past`, {
            start: format(start, 'yyyy-MM-dd HH:mm', { locale: it }),
            end: format(end, 'yyyy-MM-dd HH:mm', { locale: it })
          });
        }
        
        const durationHours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
        if (durationHours > 4) {
          console.warn(`Appointment ${appointment.id} exceeds maximum duration of 4 hours`, {
            duration: durationHours.toFixed(2),
            start: format(start, 'yyyy-MM-dd HH:mm', { locale: it }),
            end: format(end, 'yyyy-MM-dd HH:mm', { locale: it })
          });
        }
        
        return {
          id: appointment.id,
          title: title,
          start: start,
          end: end,
          staffId: staffId,
          resourceId: staffId,
          backgroundColor: appointment.color || '#4f46e5',
          extendedProps: {
            staffName,
            clientName: appointment.clientName,
            serviceType: appointment.service || '',
            staffId: staffId,
            resourceId: staffId
          },
          status: appointment.status
        } as CalendarEvent;
      } catch (error) {
        console.error("Error creating event for appointment:", appointment, error);
        return null;
      }
    }).filter((event): event is CalendarEvent => event !== null);
  }, [filteredAppointments, calendarUpdateTimestamp, visibleStaff]);

  return events;
};
