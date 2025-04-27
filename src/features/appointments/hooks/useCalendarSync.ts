
import { useEffect, useRef } from 'react';
import { useMasterSlaveScroll } from './calendar-sync/useMasterSlaveScroll';
import { useScrollSystemSetup } from './calendar-sync/useScrollSystemSetup';

/**
 * Hook that manages scroll synchronization between calendar columns
 * using simplified approach for standard FullCalendar
 */
export const useCalendarSync = (view: 'timeGridDay' | 'timeGridWeek' | 'dayGridMonth') => {
  // References to track scroll state
  const isScrollingRef = useRef<boolean>(false);
  const lastScrollPositionRef = useRef<number>(0);
  const isInitializedRef = useRef<boolean>(false);
  
  // Get scroll synchronization functions from sub-hooks
  const {
    masterScrollerRef,
    slaveScrollersRef,
    synchronizeViaTransform,
    cleanupAnimationFrame,
    rafIdRef,
    lastScrollPositionRef: lastKnownScrollRef
  } = useMasterSlaveScroll();
  
  // Get scroll system setup functionality
  const { setupMasterSlaveScrollSystem } = useScrollSystemSetup(
    synchronizeViaTransform,
    masterScrollerRef,
    slaveScrollersRef,
    isScrollingRef,
    lastScrollPositionRef
  );
  
  // Main effect that sets up the system when view changes
  useEffect(() => {
    // Skip for month view that doesn't require synchronization
    if (view === 'dayGridMonth') {
      isInitializedRef.current = false;
      return;
    }
    
    console.log(`Setting up calendar sync for view: ${view}`);
    
    // Simplified setup for standard FullCalendar
    const setupTimer = setTimeout(() => {
      // Basic sync setup using standard DOM methods
      const calendarScrollers = document.querySelectorAll('.fc-scroller');
      
      if (calendarScrollers.length > 0) {
        // Use the first scroller as master
        const firstScroller = calendarScrollers[0];
        
        firstScroller.addEventListener('scroll', () => {
          const scrollTop = (firstScroller as HTMLElement).scrollTop;
          
          // Sync all other scrollers
          calendarScrollers.forEach((scroller, index) => {
            if (index === 0) return; // Skip master
            
            (scroller as HTMLElement).scrollTop = scrollTop;
          });
        });
      }
      
      isInitializedRef.current = true;
      console.log('Simplified calendar scroll sync initialized');
    }, 500);
    
    // Add fallback for window resize
    const handleResize = () => {
      if (isInitializedRef.current) {
        console.log('Window resized, reinitializing sync');
        // Just force a reflow by adding/removing a class
        document.querySelectorAll('.fc-scroller').forEach(scroller => {
          scroller.classList.add('resized');
          setTimeout(() => scroller.classList.remove('resized'), 0);
        });
      }
    };
    
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => {
      clearTimeout(setupTimer);
      window.removeEventListener('resize', handleResize);
    };
  }, [view, setupMasterSlaveScrollSystem, cleanupAnimationFrame]);
};
