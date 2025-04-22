
import { useEffect, useRef } from 'react';

/**
 * Hook per gestire lo scroll automatico del calendario alla posizione corrente
 * con ottimizzazioni per prestazioni e fluidità
 */
export const useAutoScroll = (
  calendarApi: any, 
  view: 'timeGridDay' | 'timeGridWeek' | 'dayGridMonth'
) => {
  const scrollAttemptedRef = useRef(false);
  const autoScrollTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    // Clear any existing timeout to prevent memory leaks
    if (autoScrollTimeoutRef.current !== null) {
      clearTimeout(autoScrollTimeoutRef.current);
    }

    if (!calendarApi || view === 'dayGridMonth' || scrollAttemptedRef.current) return;
    
    const now = new Date();
    const hours = now.getHours();
    
    // Only auto-scroll during business hours
    if (hours >= 8 && hours < 20) {
      // Calculate scroll position based on current time
      // Starts at 8:00, each hour is about 80px high (with 30min slots at 40px each)
      const scrollPosition = Math.max(0, (hours - 8) * 80 + ((now.getMinutes() >= 30) ? 40 : 0));
      
      const scrollToCurrentTime = () => {
        try {
          // Find the master scroller - this will control all synchronized scrolling
          const masterScroller = document.querySelector('.calendar-time-col') as HTMLElement;
          
          if (!masterScroller) {
            console.log('Primary scroll container not found, retrying...');
            return false; // Will retry
          }
          
          // Set a flag on the DOM element to indicate we're performing an auto-scroll
          // This helps prevent feedback loops
          masterScroller.dataset.autoScrolling = 'true';
          
          // Do the scroll without transitions to avoid issues
          masterScroller.scrollTop = scrollPosition;
          
          // Remove the flag after animation
          setTimeout(() => {
            if (masterScroller) {
              delete masterScroller.dataset.autoScrolling;
            }
          }, 800);
          
          return true; // Scroll completed successfully
        } catch (error) {
          console.error("Error during auto-scroll:", error);
          return false; // Will retry
        }
      };
      
      // More sophisticated retry strategy with exponential intervals
      let attempts = 0;
      const maxAttempts = 5;
      
      const attemptScroll = () => {
        if (attempts >= maxAttempts) {
          scrollAttemptedRef.current = true;
          return;
        }
        
        const success = scrollToCurrentTime();
        
        if (!success) {
          attempts++;
          // Exponential interval
          autoScrollTimeoutRef.current = window.setTimeout(attemptScroll, 300 * Math.pow(1.5, attempts));
        } else {
          scrollAttemptedRef.current = true;
        }
      };
      
      // Start first attempt after initial rendering
      autoScrollTimeoutRef.current = window.setTimeout(attemptScroll, 500);
    }

    return () => {
      // Reset the attempt flag when component is unmounted or view changes
      scrollAttemptedRef.current = false;
      
      // Clear timeout on cleanup
      if (autoScrollTimeoutRef.current !== null) {
        clearTimeout(autoScrollTimeoutRef.current);
        autoScrollTimeoutRef.current = null;
      }
    };
  }, [calendarApi, view]);
};
