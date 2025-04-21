import { useEffect, useRef } from 'react';

export const useCalendarSync = (view: 'timeGridDay' | 'timeGridWeek' | 'dayGridMonth') => {
  const activeScrollElementRef = useRef<EventTarget | null>(null);
  const animationFrameRequestedRef = useRef<number | null>(null);
  
  useEffect(() => {
    if (view === 'dayGridMonth') return;
    
    const synchronizeScrolling = () => {
      const scrollContainers = document.querySelectorAll('.fc-scroller-liquid-absolute, .calendar-time-col, .calendar-staff-cols');
      
      if (scrollContainers.length <= 1) return;
      
      const handleScroll = (event: Event) => {
        if (activeScrollElementRef.current === event.target) return;
        
        if (animationFrameRequestedRef.current !== null) return;
        
        activeScrollElementRef.current = event.target;
        
        animationFrameRequestedRef.current = requestAnimationFrame(() => {
          const scrollingElement = event.target as HTMLElement;
          const scrollTop = scrollingElement.scrollTop;
          
          scrollContainers.forEach((container) => {
            const element = container as HTMLElement;
            if (element !== scrollingElement) {
              element.scrollTop = scrollTop;
            }
          });
          
          animationFrameRequestedRef.current = null;
          
          setTimeout(() => { 
            activeScrollElementRef.current = null;
          }, 10);
        });
      };
      
      scrollContainers.forEach((container) => {
        container.addEventListener('scroll', handleScroll, { passive: true });
      });
      
      return () => {
        scrollContainers.forEach((container) => {
          container.removeEventListener('scroll', handleScroll);
        });
        
        if (animationFrameRequestedRef.current !== null) {
          cancelAnimationFrame(animationFrameRequestedRef.current);
          animationFrameRequestedRef.current = null;
        }
      };
    };
    
    const timer = setTimeout(synchronizeScrolling, 50);
    
    window.addEventListener('resize', synchronizeScrolling, { passive: true });
    window.addEventListener('orientationchange', synchronizeScrolling);
    
    const observer = new MutationObserver((mutations) => {
      const shouldReSync = mutations.some(mutation => {
        return mutation.target.classList?.contains('staff-calendar-block') ||
               mutation.target.classList?.contains('calendar-grid-body');
      });
      
      if (shouldReSync) {
        synchronizeScrolling();
      }
    });
    
    const calendarElement = document.querySelector('.staff-calendar-block');
    if (calendarElement) {
      observer.observe(calendarElement, { 
        childList: true, 
        subtree: true,
        attributes: true,
        attributeFilter: ['class', 'style']
      });
    }
    
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', synchronizeScrolling);
      window.removeEventListener('orientationchange', synchronizeScrolling);
      observer.disconnect();
    };
  }, [view]);
};
