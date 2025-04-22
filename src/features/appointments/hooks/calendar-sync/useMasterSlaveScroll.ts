
import { useCallback, useRef } from 'react';

/**
 * Hook that provides the core functionality for master-slave scroll synchronization
 * using transform for hardware-accelerated performance
 */
export const useMasterSlaveScroll = () => {
  // Track animation frame to prevent redundant updates
  const rafIdRef = useRef<number | null>(null);
  
  // References to track scroll elements
  const masterScrollerRef = useRef<HTMLElement | null>(null);
  const slaveScrollersRef = useRef<HTMLElement[]>([]);
  
  // Flag to prevent scroll feedback loops
  const isManualScrollRef = useRef<boolean>(false);
  
  // Optimized transform-based synchronization with debounce
  const synchronizeViaTransform = useCallback((scrollTop: number) => {
    // Prevent synchronization if this is triggered by our own code
    if (isManualScrollRef.current) {
      return;
    }
    
    // Set flag to true to indicate this is a programmatic scroll
    isManualScrollRef.current = true;
    
    // Cancel any pending animation frame to avoid accumulation
    if (rafIdRef.current !== null) {
      cancelAnimationFrame(rafIdRef.current);
    }
    
    // Apply transformations in the next render frame for smoother performance
    rafIdRef.current = requestAnimationFrame(() => {
      // Update all slave columns with the same transformation
      slaveScrollersRef.current.forEach(slaveScroller => {
        // Use translate3d which forces hardware acceleration
        slaveScroller.style.transform = `translate3d(0, -${scrollTop}px, 0)`;
      });
      
      // Update external containers to ensure visible scrolling of the entire grid
      // IMPORTANT: Only update if difference is significant to prevent jump-backs
      const gridBody = document.querySelector('.calendar-grid-body');
      if (gridBody && gridBody instanceof HTMLElement) {
        // Use direct property assignment without triggering another scroll event
        // Adding a threshold to prevent micro-adjustments that cause jump-backs
        if (Math.abs(gridBody.scrollTop - scrollTop) > 15) {
          gridBody.scrollTop = scrollTop;
        }
      }
      
      // Reset the frame reference
      rafIdRef.current = null;
      
      // Reset the manual scroll flag after a short delay
      // This prevents scroll feedback loops
      setTimeout(() => {
        isManualScrollRef.current = false;
      }, 50);
    });
  }, []);
  
  // Reset animation frame on cleanup
  const cleanupAnimationFrame = useCallback(() => {
    if (rafIdRef.current !== null) {
      cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = null;
    }
  }, []);
  
  return {
    masterScrollerRef,
    slaveScrollersRef,
    synchronizeViaTransform,
    cleanupAnimationFrame,
    isManualScrollRef,
    rafIdRef
  };
};
