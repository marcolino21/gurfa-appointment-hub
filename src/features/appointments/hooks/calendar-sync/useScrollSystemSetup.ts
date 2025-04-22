
import { MutableRefObject, useCallback } from 'react';

/**
 * Hook that sets up the scroll synchronization system
 */
export const useScrollSystemSetup = (
  synchronizeViaTransform: (scrollTop: number) => void,
  masterScrollerRef: MutableRefObject<HTMLElement | null>,
  slaveScrollersRef: MutableRefObject<HTMLElement[]>,
  isScrollingRef: MutableRefObject<boolean>,
  lastScrollPositionRef: MutableRefObject<number>
) => {
  // Setup the master-slave scroll system
  const setupMasterSlaveScrollSystem = useCallback(() => {
    console.log('Setting up scroll sync system');
    
    // Find all scrollable elements
    const timeColumn = document.querySelector('.calendar-time-col');
    const staffColumns = document.querySelectorAll('.calendar-staff-col .fc-scroller');
    
    // Clear existing references
    masterScrollerRef.current = null;
    slaveScrollersRef.current = [];
    
    // Skip if required elements are not found
    if (!timeColumn || !staffColumns.length) {
      console.log('Required scroll elements not found');
      return () => {};
    }
    
    // Setup the time column as the master scroller
    masterScrollerRef.current = timeColumn as HTMLElement;
    console.log(`Setting up scroll sync system with ${staffColumns.length} staff columns`);
    
    // Store staff columns as slave scrollers
    slaveScrollersRef.current = Array.from(staffColumns).map(el => el as HTMLElement);
    
    // Event flag to prevent scroll feedback loops
    let scrollTimeout: number | null = null;
    
    // Define a throttled scroll handler to reduce events
    const handleMasterScroll = (e: Event) => {
      if (e.target !== masterScrollerRef.current) return;
      
      const scrollTop = (e.target as HTMLElement).scrollTop;
      
      // Store last position for potential restoration
      lastScrollPositionRef.current = scrollTop;
      
      // Skip if we're already in a scroll operation - prevents feedback loops
      if (isScrollingRef.current) return;
      
      // Set scroll flag
      isScrollingRef.current = true;
      
      // Synchronize all slave scrollers via transform
      synchronizeViaTransform(scrollTop);
      
      // Reset scroll flag after a delay
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }
      
      scrollTimeout = window.setTimeout(() => {
        isScrollingRef.current = false;
      }, 150);
    };
    
    // Add passive event listener for performance
    masterScrollerRef.current.addEventListener('scroll', handleMasterScroll, { passive: true });
    
    // Prevent scroll behavior on slave elements to avoid feedback loops
    slaveScrollersRef.current.forEach(slaveScroller => {
      slaveScroller.style.overflow = 'hidden';
      
      // Optional: Add dummy scrollbar for visual consistency
      const dummyScrollbar = document.createElement('div');
      dummyScrollbar.classList.add('dummy-scrollbar');
      dummyScrollbar.style.width = '8px';
      dummyScrollbar.style.position = 'absolute';
      dummyScrollbar.style.right = '0';
      dummyScrollbar.style.top = '0';
      dummyScrollbar.style.bottom = '0';
      dummyScrollbar.style.backgroundColor = 'rgba(0,0,0,0.05)';
      dummyScrollbar.style.borderRadius = '4px';
      dummyScrollbar.style.zIndex = '10';
      slaveScroller.parentElement?.appendChild(dummyScrollbar);
    });
    
    // Trick to prevent scroll resets on re-renders: store position in local storage
    window.addEventListener('beforeunload', () => {
      const position = masterScrollerRef.current?.scrollTop || 0;
      if (position > 0) {
        try {
          sessionStorage.setItem('calendarScrollPosition', position.toString());
        } catch (e) {
          console.error('Failed to save scroll position:', e);
        }
      }
    });
    
    // Return cleanup function
    return () => {
      if (masterScrollerRef.current) {
        masterScrollerRef.current.removeEventListener('scroll', handleMasterScroll);
      }
      
      // Clean up dummy scrollbars
      document.querySelectorAll('.dummy-scrollbar').forEach(el => {
        el.remove();
      });
      
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }
    };
  }, [
    synchronizeViaTransform,
    masterScrollerRef,
    slaveScrollersRef,
    isScrollingRef,
    lastScrollPositionRef
  ]);
  
  return {
    setupMasterSlaveScrollSystem
  };
};
