
import { useEffect, useCallback } from 'react';
import { useStaffBlockTime } from '../hooks/useStaffBlockTime';

export const useCalendarBlockTime = () => {
  const { getBlockTimeEvents } = useStaffBlockTime();
  
  // Get the block time events from the staff hook
  const blockTimeEvents = getBlockTimeEvents();

  // Enhance the block time events with the necessary properties for FullCalendar
  const enhancedBlockTimeEvents = blockTimeEvents.map(event => ({
    ...event,
    display: 'background',
    rendering: 'background',
    className: 'blocked-time-event',
    classNames: ['blocked-time-event'],
    overlap: false,
    backgroundColor: 'rgba(211, 211, 211, 0.7)'
  }));

  // Function to apply styles to blocked time events after the calendar renders them
  const applyBlockedTimeStyles = useCallback(() => {
    try {
      // First, target all background events
      document.querySelectorAll('.fc-bg-event').forEach(el => {
        el.classList.add('blocked-time-event');
      });
      
      // Also ensure any event with blocked-time-event class gets fully styled
      document.querySelectorAll('.blocked-time-event').forEach(el => {
        el.classList.add('fc-non-interactive');
      });
    } catch (error) {
      console.error("Error applying block time styling:", error);
    }
  }, []);

  // Apply styles whenever blockTimeEvents change
  useEffect(() => {
    if (blockTimeEvents.length > 0) {
      // Apply styles immediately and then again after a delay to ensure rendering is complete
      applyBlockedTimeStyles();
      const timer = setTimeout(applyBlockedTimeStyles, 200);
      return () => clearTimeout(timer);
    }
  }, [blockTimeEvents, applyBlockedTimeStyles]);

  return { 
    enhancedBlockTimeEvents,
    applyBlockedTimeStyles 
  };
};
