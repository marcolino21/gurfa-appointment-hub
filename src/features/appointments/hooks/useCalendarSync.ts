
import { useEffect } from 'react';

export const useCalendarSync = (view: 'timeGridDay' | 'timeGridWeek' | 'dayGridMonth') => {
  useEffect(() => {
    if (view === 'dayGridMonth') return;
    
    const synchronizeScrolling = () => {
      const scrollContainers = document.querySelectorAll('.fc-scroller-liquid-absolute, .calendar-time-col, .calendar-staff-cols');
      
      if (scrollContainers.length <= 1) return;
      
      let isSyncing = false;
      let ticking = false;
      
      const handleScroll = (event: Event) => {
        if (isSyncing) return;
        isSyncing = true;
        
        if (!ticking) {
          window.requestAnimationFrame(() => {
            const scrollingElement = event.target as HTMLElement;
            const scrollTop = scrollingElement.scrollTop;
            
            scrollContainers.forEach((container) => {
              const element = container as HTMLElement;
              if (element !== scrollingElement) {
                element.scrollTop = scrollTop;
              }
            });
            
            ticking = false;
            setTimeout(() => { isSyncing = false; }, 16);
          });
          
          ticking = true;
        }
      };
      
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
    
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', synchronizeScrolling);
    };
  }, [view]);
};
