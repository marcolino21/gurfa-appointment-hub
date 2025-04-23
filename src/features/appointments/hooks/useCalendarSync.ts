
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
  
  // Get scroll synchronization functions from sub-hooks
  const {
    masterScrollerRef,
    slaveScrollersRef,
    synchronizeViaTransform,
    cleanupAnimationFrame,
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
  
  // Main effect that sets up the system when view changes
  useEffect(() => {
    // Skip for month view that doesn't require synchronization
    if (view === 'dayGridMonth') {
      isInitializedRef.current = false;
      return;
    }
    
    console.log(`Setting up calendar sync for view: ${view}`);
    
    // Setup with delay to ensure DOM is ready
    const setupTimer = setTimeout(() => {
      // Apply optimization classes to main container
      const calendarBody = document.querySelector('.calendar-grid-body');
      if (calendarBody) {
        calendarBody.classList.add('hardware-accelerated');
      }
      
      // Setup master-slave system
      const cleanup = setupMasterSlaveScrollSystem();
      isInitializedRef.current = true;
      
      console.log('Calendar scroll sync initialized');
      
      return cleanup;
    }, 250);
    
    // Observer to reconfigure on DOM changes
    const observer = new MutationObserver(() => {
      if (isInitializedRef.current) {
        // Reconfigure only if already initialized, otherwise wait for timer
        setupMasterSlaveScrollSystem();
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
        if (isInitializedRef.current) {
          console.log('Reinitializing calendar sync after resize');
          setupMasterSlaveScrollSystem();
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
