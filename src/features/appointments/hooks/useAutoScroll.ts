
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
      // Start at 8:00, each hour is approximately 60px high (with 30min slots at 30px each)
      const scrollPosition = Math.max(0, (hours - 8) * 60 - 60);
      
      const scrollToCurrentTime = () => {
        try {
          const scrollers = document.querySelectorAll('.fc-scroller-liquid-absolute');
          
          if (scrollers.length === 0) {
            console.log('No scrollers found, retrying...');
            return false; // Will retry
          }
          
          scrollers.forEach((scroller) => {
            (scroller as HTMLElement).scrollTop = scrollPosition;
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
