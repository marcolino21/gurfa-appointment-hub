
import { useEffect, useCallback, useState, useMemo } from 'react';
import { useStaffBlockTime } from './useStaffBlockTime';

export const useCalendarBlockTime = () => {
  const { getBlockTimeEvents } = useStaffBlockTime();
  const [styleApplied, setStyleApplied] = useState(false);
  
  // Get the block time events from the staff hook
  const blockTimeEvents = getBlockTimeEvents();

  // Enhance the block time events with the necessary properties for FullCalendar - memoized for performance
  const enhancedBlockTimeEvents = useMemo(() => {
    console.log("Generating enhanced block time events");
    return blockTimeEvents.map(event => ({
      ...event,
      display: 'background',
      rendering: 'background',
      className: 'blocked-time-event',
      classNames: ['blocked-time-event'],
      overlap: false,
      backgroundColor: 'rgba(211, 211, 211, 0.7)'
    }));
  }, [blockTimeEvents]);

  // Simplified function to apply styles to blocked time events - usando un approccio più dichiarativo
  const applyBlockedTimeStyles = useCallback(() => {
    try {
      console.log("Applying blocked time styles");
      document.querySelectorAll('.fc-bg-event, .blocked-time-event').forEach(el => {
        if (!el.classList.contains('styled-blocked-time')) {
          el.classList.add('blocked-time-event', 'fc-non-interactive', 'styled-blocked-time');
        }
      });
      
      if (!styleApplied) {
        setStyleApplied(true);
      }
    } catch (error) {
      console.error("Error applying block time styling:", error);
    }
  }, [styleApplied]);

  // Apply styles solo una volta all'inizio, non ad ogni cambio di eventi
  useEffect(() => {
    if (blockTimeEvents.length > 0 && !styleApplied) {
      const timer = setTimeout(applyBlockedTimeStyles, 300);
      return () => clearTimeout(timer);
    }
  }, [blockTimeEvents, applyBlockedTimeStyles, styleApplied]);

  return { 
    enhancedBlockTimeEvents,
    applyBlockedTimeStyles 
  };
};
