
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
  
  // Ultimo valore di scroll conosciuto per prevenire rimbalzi
  const lastKnownScrollRef = useRef<number>(0);
  
  // Optimized transform-based synchronization with debounce
  const synchronizeViaTransform = useCallback((scrollTop: number) => {
    // Controlla se lo scorrimento è significativo
    if (Math.abs(scrollTop - lastKnownScrollRef.current) < 1) return;
    
    // Aggiorna l'ultimo valore conosciuto
    lastKnownScrollRef.current = scrollTop;
    
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
      const gridBody = document.querySelector('.calendar-grid-body');
      if (gridBody && gridBody instanceof HTMLElement) {
        // Use direct property assignment without triggering another scroll event
        if (Math.abs(gridBody.scrollTop - scrollTop) > 2) {
          gridBody.scrollTop = scrollTop;
        }
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
    rafIdRef,
    lastKnownScrollRef
  };
};
