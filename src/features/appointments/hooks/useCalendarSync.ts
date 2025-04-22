
import { useEffect, useRef } from 'react';
import { useMasterSlaveScroll } from './calendar-sync/useMasterSlaveScroll';
import { useScrollSystemSetup } from './calendar-sync/useScrollSystemSetup';

/**
 * Hook that manages perfect scroll synchronization between
 * all columns of the multi-operator calendar using transform for hardware acceleration
 */
export const useCalendarSync = (view: 'timeGridDay' | 'timeGridWeek' | 'dayGridMonth') => {
  // References to track scroll state
  const isScrollingRef = useRef<boolean>(false);
  const lastScrollPositionRef = useRef<number>(0);
  const isInitializedRef = useRef<boolean>(false);
  const lastViewRef = useRef<string>(view);
  
  // Get scroll synchronization functions from sub-hooks
  const {
    masterScrollerRef,
    slaveScrollersRef,
    synchronizeViaTransform,
    cleanupAnimationFrame,
    isManualScrollRef,
    rafIdRef
  } = useMasterSlaveScroll();
  
  // Get scroll system setup functionality
  const { setupMasterSlaveScrollSystem } = useScrollSystemSetup(
    synchronizeViaTransform,
    masterScrollerRef,
    slaveScrollersRef,
    isScrollingRef,
    lastScrollPositionRef
  );
  
  // Store and restore scroll position when view changes
  useEffect(() => {
    // If view changed, store position before changes
    if (lastViewRef.current !== view && masterScrollerRef.current) {
      try {
        sessionStorage.setItem(
          `calendarScrollPosition_${lastViewRef.current}`, 
          masterScrollerRef.current.scrollTop.toString()
        );
      } catch (e) {
        console.error("Error storing scroll position:", e);
      }
    }
    
    // Update last view ref
    lastViewRef.current = view;
    
    // Skip for month view that doesn't require synchronization
    if (view === 'dayGridMonth') {
      isInitializedRef.current = false;
      return;
    }

    // Main setup function with delay to ensure DOM is ready
    const setupTimer = setTimeout(() => {
      // Apply optimization classes to main container
      const calendarBody = document.querySelector('.calendar-grid-body');
      if (calendarBody) {
        calendarBody.classList.add('hardware-accelerated');
      }

      // Set up master-slave system
      const cleanup = setupMasterSlaveScrollSystem();
      isInitializedRef.current = true;
      
      // Restore scroll position after setup
      try {
        const storedPosition = sessionStorage.getItem(`calendarScrollPosition_${view}`);
        if (storedPosition && masterScrollerRef.current) {
          const position = parseInt(storedPosition, 10);
          if (!isNaN(position) && position > 0) {
            // Use RAF for smoother restoration
            requestAnimationFrame(() => {
              if (masterScrollerRef.current) {
                isManualScrollRef.current = true;
                masterScrollerRef.current.scrollTop = position;
                // Reset manual flag after scroll completes
                setTimeout(() => {
                  isManualScrollRef.current = false;
                }, 100);
              }
            });
          }
        }
      } catch (e) {
        console.error("Error restoring scroll position:", e);
      }

      console.log('Calendar scroll sync initialized');
      return cleanup;
    }, 250);
    
    // Observer to reconfigure on DOM changes
    const observer = new MutationObserver(() => {
      if (isInitializedRef.current) {
        // Reconfigure only if already initialized and not currently scrolling
        if (!isScrollingRef.current) {
          setupMasterSlaveScrollSystem();
        }
      }
    });
    
    // Observe calendar container
    const calendarContainer = document.querySelector('.staff-calendar-block');
    if (calendarContainer) {
      observer.observe(calendarContainer, { 
        childList: true, 
        subtree: true,
        attributes: false
      });
    }
    
    // Add listeners to reinitialize on window changes with throttling
    let resizeTimeout: number;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = window.setTimeout(() => {
        // Store position before resize
        const currentPos = masterScrollerRef.current?.scrollTop || 0;
        
        if (isInitializedRef.current) {
          console.log('Reinitializing calendar sync after resize');
          setupMasterSlaveScrollSystem();
          
          // Restore position after resize
          if (masterScrollerRef.current && currentPos > 0) {
            requestAnimationFrame(() => {
              if (masterScrollerRef.current) {
                masterScrollerRef.current.scrollTop = currentPos;
              }
            });
          }
        }
      }, 200);
    };
    
    window.addEventListener('resize', handleResize, { passive: true });
    window.addEventListener('orientationchange', setupMasterSlaveScrollSystem);
    
    // Cleanup
    return () => {
      clearTimeout(setupTimer);
      observer.disconnect();
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', setupMasterSlaveScrollSystem);
      
      // Clean up any applied transform
      slaveScrollersRef.current.forEach(slaveScroller => {
        slaveScroller.style.transform = '';
        slaveScroller.style.overflow = '';
      });
      
      // Reset state
      isInitializedRef.current = false;
      cleanupAnimationFrame();
    };
  }, [view, setupMasterSlaveScrollSystem, cleanupAnimationFrame]);
};
