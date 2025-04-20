
import { useEffect } from 'react';

export const useCalendarSync = (view: 'timeGridDay' | 'timeGridWeek' | 'dayGridMonth') => {
  useEffect(() => {
    const synchronizeScrolling = () => {
      const scrollContainers = document.querySelectorAll('.fc-scroller-liquid-absolute');
      
      if (scrollContainers.length <= 1) return;
      
      const handleScroll = (event: Event) => {
        const scrollingElement = event.target as HTMLElement;
        const scrollTop = scrollingElement.scrollTop;
        
        scrollContainers.forEach((container) => {
          const element = container as HTMLElement;
          if (element !== scrollingElement) {
            element.scrollTop = scrollTop;
          }
        });
      };
      
      scrollContainers.forEach((container) => {
        container.addEventListener('scroll', handleScroll);
      });
      
      return () => {
        scrollContainers.forEach((container) => {
          container.removeEventListener('scroll', handleScroll);
        });
      };
    };
    
    const timer = setTimeout(synchronizeScrolling, 200);
    return () => clearTimeout(timer);
  }, [view]);
};
