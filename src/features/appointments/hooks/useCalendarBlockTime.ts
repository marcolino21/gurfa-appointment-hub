
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
      console.log("Applying blocked time styles...");
      
      // First, target all background events
      document.querySelectorAll('.fc-bg-event').forEach(el => {
        el.classList.add('blocked-time-event');
        el.classList.add('fc-non-interactive');
      });
      
      // Also ensure any event with blocked-time-event class gets fully styled
      document.querySelectorAll('.blocked-time-event').forEach(el => {
        el.classList.add('fc-non-interactive');
      });
      
      // Apply styles to the entire column with blocked time
      document.querySelectorAll('.fc-timegrid-col-bg').forEach(col => {
        // Check if this column contains a blocked time event
        if (col.querySelector('.blocked-time-event')) {
          const parent = col.closest('.fc-timegrid-col');
          if (parent) {
            parent.classList.add('has-blocked-time');
          }
        }
      });
      
      // Make sure full columns are properly styled
      document.querySelectorAll('[data-blocked="true"]').forEach(col => {
        const fcCols = col.querySelectorAll('.fc-timegrid-col');
        fcCols.forEach(fcCol => {
          fcCol.classList.add('blocked-staff-column');
        });
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
      
      // Apply multiple times with increasing delays to ensure styles are applied after all renders
      const timers = [
        setTimeout(applyBlockedTimeStyles, 100),
        setTimeout(applyBlockedTimeStyles, 300),
        setTimeout(applyBlockedTimeStyles, 600),
        setTimeout(applyBlockedTimeStyles, 1000) // Added longer timeout for complex calendars
      ];
      
      return () => timers.forEach(timer => clearTimeout(timer));
    }
  }, [blockTimeEvents, applyBlockedTimeStyles]);

  return { 
    enhancedBlockTimeEvents,
    applyBlockedTimeStyles 
  };
};
