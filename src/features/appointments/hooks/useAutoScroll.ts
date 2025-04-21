
import { useEffect } from 'react';

export const useAutoScroll = (
  calendarApi: any, 
  view: 'timeGridDay' | 'timeGridWeek' | 'dayGridMonth'
) => {
  useEffect(() => {
    if (!calendarApi || view === 'dayGridMonth') return;
    
    const now = new Date();
    const hours = now.getHours();
    
    // Only auto-scroll during business hours
    if (hours >= 8 && hours < 20) {
      // Calculate scroll position based on current time
      // Start at 8:00, each hour is approximately 80px high (with 30min slots at 40px each)
      const scrollPosition = Math.max(0, (hours - 8) * 80 + ((now.getMinutes() >= 30) ? 40 : 0));
      
      const scrollToCurrentTime = () => {
        try {
          // Find the primary scroll container - this will control all synchronized scrolling
          const mainScroller = document.querySelector('.calendar-time-col') as HTMLElement;
          
          if (!mainScroller) {
            console.log('Primary scroll container not found, retrying...');
            return false; // Will retry
          }
          
          // Set the scroll position with smooth behavior
          mainScroller.scrollTo({
            top: scrollPosition,
            behavior: 'smooth'
          });
          
          return true; // Successfully scrolled
        } catch (error) {
          console.error("Error in auto-scroll:", error);
          return false; // Will retry
        }
      };
      
      // Try multiple times with increasing delays to ensure calendars are fully rendered
      let attempts = 0;
      const maxAttempts = 5;
      
      const attemptScroll = () => {
        if (attempts >= maxAttempts) return;
        
        const success = scrollToCurrentTime();
        
        if (!success) {
          attempts++;
          setTimeout(attemptScroll, 300 * attempts); // Increasing delay with each attempt
        }
      };
      
      // Start the first attempt after initial render
      setTimeout(attemptScroll, 300);
    }
  }, [calendarApi, view]);
};
