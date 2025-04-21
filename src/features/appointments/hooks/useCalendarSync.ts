
import { useEffect } from 'react';

export const useCalendarSync = (view: 'timeGridDay' | 'timeGridWeek' | 'dayGridMonth') => {
  useEffect(() => {
    if (view === 'dayGridMonth') return;
    
    const synchronizeScrolling = () => {
      const scrollContainers = document.querySelectorAll('.fc-scroller-liquid-absolute, .calendar-time-col, .calendar-staff-cols');
      
      if (scrollContainers.length <= 1) return;
      
      // Track which element is currently being scrolled to prevent loops
      let activeScrollElement: EventTarget | null = null;
      
      const handleScroll = (event: Event) => {
        // If this is a recursive scroll event, ignore it
        if (activeScrollElement === event.target) return;
        
        // Set the current element as active scrolling element
        activeScrollElement = event.target;
        
        // Use requestAnimationFrame for smoother scrolling
        requestAnimationFrame(() => {
          const scrollingElement = event.target as HTMLElement;
          const scrollTop = scrollingElement.scrollTop;
          
          // Sync all containers to the same scroll position
          scrollContainers.forEach((container) => {
            const element = container as HTMLElement;
            if (element !== scrollingElement) {
              element.scrollTop = scrollTop;
            }
          });
          
          // Reset the active scroll element after a short delay
          setTimeout(() => { 
            activeScrollElement = null;
          }, 10);
        });
      };
      
      // Add scroll event listeners to all containers
      scrollContainers.forEach((container) => {
        container.addEventListener('scroll', handleScroll, { passive: true });
      });
      
      return () => {
        scrollContainers.forEach((container) => {
          container.removeEventListener('scroll', handleScroll);
        });
      };
    };
    
    // Initial setup with a slight delay to ensure elements are rendered
    const timer = setTimeout(synchronizeScrolling, 100);
    
    // Re-sync on window resize
    window.addEventListener('resize', synchronizeScrolling);
    
    // Also re-run synchronization when DOM changes that might affect the calendar
    const observer = new MutationObserver((mutations) => {
      synchronizeScrolling();
    });
    
    const calendarElement = document.querySelector('.staff-calendar-block');
    if (calendarElement) {
      observer.observe(calendarElement, { 
        childList: true, 
        subtree: true 
      });
    }
    
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', synchronizeScrolling);
      observer.disconnect();
    };
  }, [view]);
};
