
import { useCallback } from 'react';

/**
 * Hook for setting up the master-slave scroll system
 * and configuring all scroll event listeners
 */
export const useScrollSystemSetup = (
  synchronizeViaTransform: (scrollTop: number) => void,
  masterScrollerRef: React.MutableRefObject<HTMLElement | null>,
  slaveScrollersRef: React.MutableRefObject<HTMLElement[]>,
  isScrollingRef: React.MutableRefObject<boolean>,
  lastScrollPositionRef: React.MutableRefObject<number>
) => {
  // Main function to configure the master-slave system
  const setupMasterSlaveScrollSystem = useCallback(() => {
    // Clear previous references
    slaveScrollersRef.current = [];
    masterScrollerRef.current = null;
    
    // Select the master scroller (time column)
    const masterScroller = document.querySelector('.calendar-time-col') as HTMLElement;
    if (!masterScroller) return;
    
    // Save the master reference
    masterScrollerRef.current = masterScroller;
    
    // Find all potential slave scrollers
    const staffColumns = document.querySelectorAll('.calendar-staff-col .fc-scroller');
    if (staffColumns.length === 0) return;
    
    // Configure each slave
    staffColumns.forEach(staffCol => {
      const slaveScroller = staffCol as HTMLElement;
      
      // Block native scrolling for slave and prepare for transform
      slaveScroller.style.overflow = 'hidden';
      slaveScroller.style.willChange = 'transform';
      slaveScroller.style.transform = 'translate3d(0, 0, 0)';
      slaveScroller.style.transition = 'transform 0ms linear';
      
      // Add to slave list
      slaveScrollersRef.current.push(slaveScroller);
      
      // Disable native scroll events to prevent interference
      slaveScroller.addEventListener('scroll', (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (masterScrollerRef.current) {
          masterScrollerRef.current.scrollTop = slaveScroller.scrollTop;
        }
        return false;
      }, { passive: false });
    });
    
    // Optimize the master scroller
    masterScroller.style.willChange = 'scroll-position';
    masterScroller.style.overscrollBehavior = 'contain';
    
    // Configure grid body container scrolling
    const gridBody = document.querySelector('.calendar-grid-body') as HTMLElement;
    if (gridBody) {
      gridBody.addEventListener('scroll', (e) => {
        if (masterScrollerRef.current && !isScrollingRef.current) {
          masterScrollerRef.current.scrollTop = gridBody.scrollTop;
        }
      }, { passive: true });
    }
    
    // Master scroll handler
    const handleMasterScroll = () => {
      if (!masterScrollerRef.current) return;
      
      // Avoid redundant updates
      const currentScrollTop = masterScrollerRef.current.scrollTop;
      if (currentScrollTop === lastScrollPositionRef.current) return;
      
      // Update the reference position
      lastScrollPositionRef.current = currentScrollTop;
      
      // Signal that we're scrolling
      if (!isScrollingRef.current) {
        document.body.classList.add('is-scrolling');
        isScrollingRef.current = true;
      }
      
      // Synchronize slaves via transform
      synchronizeViaTransform(currentScrollTop);
      
      // Cleanup class after short delay
      clearTimeout(window.setTimeout(() => {
        document.body.classList.remove('is-scrolling');
        isScrollingRef.current = false;
      }, 100));
    };
    
    // Optimize scroll event with passive: true for performance
    masterScroller.addEventListener('scroll', handleMasterScroll, { passive: true });
    
    // Initial sync
    lastScrollPositionRef.current = masterScroller.scrollTop;
    synchronizeViaTransform(masterScroller.scrollTop);
    
    // Return cleanup function
    return () => {
      if (masterScrollerRef.current) {
        masterScrollerRef.current.removeEventListener('scroll', handleMasterScroll);
      }
      
      // Reset references
      slaveScrollersRef.current = [];
      masterScrollerRef.current = null;
    };
  }, [synchronizeViaTransform, masterScrollerRef, slaveScrollersRef, isScrollingRef, lastScrollPositionRef]);
  
  return {
    setupMasterSlaveScrollSystem
  };
};
