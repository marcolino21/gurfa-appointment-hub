
import { useEffect } from 'react';

export const useAutoScroll = (
  calendarApi: any, 
  view: 'timeGridDay' | 'timeGridWeek' | 'dayGridMonth'
) => {
  useEffect(() => {
    if (calendarApi && (view === 'timeGridDay' || view === 'timeGridWeek')) {
      const now = new Date();
      const hours = now.getHours();
      
      if (hours >= 9 && hours < 20) {
        const scrollPosition = (hours - 9) * 40 * 2 - 200;
        
        setTimeout(() => {
          const scrollers = document.querySelectorAll('.fc-scroller-liquid-absolute');
          scrollers.forEach((scroller) => {
            (scroller as HTMLElement).scrollTop = scrollPosition;
          });
        }, 200);
      }
    }
  }, [calendarApi, view]);
};
