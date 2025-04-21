
import { useEffect } from 'react';

export const useCalendarSync = (view: 'timeGridDay' | 'timeGridWeek' | 'dayGridMonth') => {
  useEffect(() => {
    // Only synchronize scrolling in time grid views
    if (view === 'dayGridMonth') return;
    
    const synchronizeScrolling = () => {
      const scrollContainers = document.querySelectorAll('.fc-scroller-liquid-absolute');
      
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
            setTimeout(() => { isSyncing = false; }, 10);
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
    
    // Give calendars time to render before setting up scroll sync
    const timer = setTimeout(synchronizeScrolling, 300);
    
    // Handle window resize events to re-synchronize scrolling
    const handleResize = () => {
      clearTimeout(timer);
      setTimeout(synchronizeScrolling, 300);
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', handleResize);
    };
  }, [view]);
};
