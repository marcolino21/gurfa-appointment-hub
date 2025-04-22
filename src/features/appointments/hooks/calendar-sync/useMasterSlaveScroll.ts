
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
  
  // Optimized transform-based synchronization
  const synchronizeViaTransform = useCallback((scrollTop: number) => {
    // Cancel any pending animation frame to avoid accumulation
    if (rafIdRef.current !== null) {
      cancelAnimationFrame(rafIdRef.current);
    }
    
    // Apply transformations in the next render frame
    rafIdRef.current = requestAnimationFrame(() => {
      // Update all slave columns with the same transformation
      slaveScrollersRef.current.forEach(slaveScroller => {
        // Use translateY which is optimized for hardware acceleration
        slaveScroller.style.transform = `translate3d(0, -${scrollTop}px, 0)`;
      });
      
      // Update external containers to ensure visible scrolling of the entire grid
      const gridBody = document.querySelector('.calendar-grid-body');
      if (gridBody && gridBody instanceof HTMLElement) {
        gridBody.scrollTop = scrollTop;
      }
      
      // Reset the frame reference
      rafIdRef.current = null;
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
    rafIdRef
  };
};
