import { useState, useCallback } from 'react';
import { CalendarEvent } from '../types';
import { useToast } from '@/hooks/use-toast';

interface CalendarApi {
  getEvents: () => CalendarEvent[];
}

export const useCalendarEvents = (calendarApi: CalendarApi) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const { toast } = useToast();

  const handleEventDragStart = useCallback((info: { event: CalendarEvent; el: HTMLElement }) => {
    setIsDragging(true);
    info.el.style.opacity = '0.7';
    info.el.style.cursor = 'grabbing';
  }, []);

  const handleEventDragStop = useCallback((info: { event: CalendarEvent; revert: () => void }) => {
    setIsDragging(false);
    const events = calendarApi.getEvents();
    const overlappingEvent = events.find(e => 
      e.event_id !== info.event.event_id &&
      e.resource_id === info.event.resource_id &&
      ((e.start <= info.event.start && e.end > info.event.start) ||
       (e.start < info.event.end && e.end >= info.event.end) ||
       (e.start >= info.event.start && e.end <= info.event.end))
    );

    if (overlappingEvent) {
      info.revert();
      toast({
        title: "Conflitto di appuntamenti",
        description: "Esiste già un appuntamento in questo orario.",
        variant: "destructive"
      });
    }
  }, [calendarApi, toast]);

  const handleEventResizeStart = useCallback((info: { event: CalendarEvent; el: HTMLElement }) => {
    setIsResizing(true);
    info.el.style.opacity = '0.7';
  }, []);

  const handleEventResizeStop = useCallback((info: { event: CalendarEvent; revert: () => void }) => {
    setIsResizing(false);
    const duration = info.event.end.getTime() - info.event.start.getTime();
    const minDuration = 30 * 60 * 1000; // 30 minutes
    const maxDuration = 4 * 60 * 60 * 1000; // 4 hours

    if (duration < minDuration || duration > maxDuration) {
      info.revert();
      toast({
        title: "Validazione fallita",
        description: `La durata dell'appuntamento deve essere tra 30 minuti e 4 ore.`,
        variant: "destructive"
      });
    }
  }, [toast]);

  return {
    isDragging,
    isResizing,
    handleEventDragStart,
    handleEventDragStop,
    handleEventResizeStart,
    handleEventResizeStop
  };
}; 