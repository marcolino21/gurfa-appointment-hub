import { useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { CalendarEvent } from '../types/appointment';

export const useAppointmentActions = (businessId: string) => {
  const { toast } = useToast();

  const handleEventDrop = useCallback(async (info: any) => {
    try {
      const event: CalendarEvent = {
        id: info.event.id,
        title: info.event.title,
        start: info.event.start,
        end: info.event.end,
        staffId: info.event.getResources()[0]?.id,
        status: info.event.extendedProps.status,
        customerName: info.event.extendedProps.customerName,
        serviceName: info.event.extendedProps.serviceName
      };
      // TODO: Implement API call to update appointment
      return event;
    } catch (error) {
      toast({
        title: "Errore",
        description: "Impossibile spostare l'appuntamento",
        variant: "destructive"
      });
      info.revert();
    }
  }, [toast]);

  const handleEventClick = useCallback((info: any) => {
    const event: CalendarEvent = {
      id: info.event.id,
      title: info.event.title,
      start: info.event.start,
      end: info.event.end,
      staffId: info.event.getResources()[0]?.id,
      status: info.event.extendedProps.status,
      customerName: info.event.extendedProps.customerName,
      serviceName: info.event.extendedProps.serviceName
    };
    // TODO: Implement event click handler
    console.log('Event clicked:', event);
  }, []);

  const handleDateClick = useCallback((info: any) => {
    // TODO: Implement date click handler
    console.log('Date clicked:', info.date);
  }, []);

  return {
    handleEventDrop,
    handleEventClick,
    handleDateClick
  };
}; 