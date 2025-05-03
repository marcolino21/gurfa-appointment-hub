import { useState, useCallback } from 'react';
import { CalendarEvent } from '../types/calendar';
import { useToast } from '@/hooks/use-toast';

interface CalendarApi {
  getEvents: () => CalendarEvent[];
}

interface DragInfo {
  event: CalendarEvent;
  el: HTMLElement;
  preventDefault?: () => void;
}

interface DragStopInfo {
  event: CalendarEvent;
  revert: () => void;
}

interface ResizeInfo {
  event: CalendarEvent;
  el: HTMLElement;
  preventDefault?: () => void;
}

interface ResizeStopInfo {
  event: CalendarEvent;
  revert: () => void;
}

export const useCalendarEvents = (calendarApi: CalendarApi) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const { toast } = useToast();

  const handleEventDragStart = useCallback((info: DragInfo) => {
    setIsDragging(true);
    info.el.style.opacity = '0.7';
    info.el.style.cursor = 'grabbing';
    if (info.preventDefault) {
      info.preventDefault();
    }
  }, []);

  const handleEventDragStop = useCallback((info: DragStopInfo) => {
    setIsDragging(false);
    const events = calendarApi.getEvents();
    const overlappingEvent = events.find(e => 
      e.event_id !== info.event.event_id &&
      e.resourceId === info.event.resourceId &&
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

  const handleEventResizeStart = useCallback((info: ResizeInfo) => {
    setIsResizing(true);
    info.el.style.opacity = '0.7';
    if (info.preventDefault) {
      info.preventDefault();
    }
  }, []);

  const handleEventResizeStop = useCallback((info: ResizeStopInfo) => {
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