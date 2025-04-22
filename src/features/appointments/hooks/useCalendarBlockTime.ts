
import { useEffect, useCallback, useState } from 'react';
import { useStaffBlockTime } from './useStaffBlockTime';

export const useCalendarBlockTime = () => {
  const { getBlockTimeEvents } = useStaffBlockTime();
  const [styleApplied, setStyleApplied] = useState(false);
  
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

  // Simplified function to apply styles to blocked time events
  const applyBlockedTimeStyles = useCallback(() => {
    try {
      console.log("Applying blocked time styles - simplified version");
      
      // Apply styles only once, using more efficient selectors
      document.querySelectorAll('.fc-bg-event, .blocked-time-event').forEach(el => {
        if (!el.classList.contains('styled-blocked-time')) {
          el.classList.add('blocked-time-event', 'fc-non-interactive', 'styled-blocked-time');
        }
      });
      
      // Mark that we've applied styles
      if (!styleApplied) {
        setStyleApplied(true);
      }
    } catch (error) {
      console.error("Error applying block time styling:", error);
    }
  }, [styleApplied]);

  // Apply styles only once on mount and when events change
  useEffect(() => {
    if (blockTimeEvents.length > 0) {
      // Apply once immediately
      applyBlockedTimeStyles();
      
      // Apply once more after a short delay to ensure FullCalendar has rendered
      const timer = setTimeout(applyBlockedTimeStyles, 300);
      
      return () => clearTimeout(timer);
    }
  }, [blockTimeEvents, applyBlockedTimeStyles]);

  return { 
    enhancedBlockTimeEvents,
    applyBlockedTimeStyles 
  };
};
