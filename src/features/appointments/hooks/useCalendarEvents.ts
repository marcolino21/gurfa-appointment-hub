
import { useState, useEffect } from 'react';
import { CalendarEvent } from '../types';

/**
 * Custom hook to manage calendar events
 * @param initialEvents Initial array of calendar events
 * @returns Object with events and methods to manipulate them
 */
export const useCalendarEvents = (initialEvents: CalendarEvent[] = []) => {
  const [events, setEvents] = useState<CalendarEvent[]>(initialEvents);
  
  // Add any additional logic needed for calendar events here
  
  return {
    events,
    setEvents,
    addEvent: (event: CalendarEvent) => {
      setEvents(prev => [...prev, event]);
    },
    updateEvent: (updatedEvent: CalendarEvent) => {
      setEvents(prev => 
        prev.map(event => event.id === updatedEvent.id ? updatedEvent : event)
      );
    },
    removeEvent: (eventId: string) => {
      setEvents(prev => prev.filter(event => event.id !== eventId));
    }
  };
};

export default useCalendarEvents;
