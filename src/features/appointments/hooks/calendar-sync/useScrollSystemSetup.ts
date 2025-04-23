
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
    if (!masterScroller) {
      console.warn('Master scroller (.calendar-time-col) not found');
      return;
    }
    
    // Save the master reference
    masterScrollerRef.current = masterScroller;
    
    // Find all potential slave scrollers
    const staffColumns = document.querySelectorAll('.calendar-staff-col .fc-scroller');
    if (staffColumns.length === 0) {
      console.warn('No staff columns found for scroll sync');
      return;
    }
    
    console.log(`Setting up scroll sync system with ${staffColumns.length} staff columns`);
    
    // Configure each slave
    staffColumns.forEach(staffCol => {
      const slaveScroller = staffCol as HTMLElement;
      
      // Block native scrolling for slave and prepare for transform
      slaveScroller.style.overflow = 'hidden';
      slaveScroller.style.willChange = 'transform';
      slaveScroller.style.transform = 'translate3d(0, 0, 0)';
      
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
    
    // Throttled master scroll handler for better performance
    let lastScrollTime = 0;
    const scrollThrottleMs = 16; // Throttle to match 60fps (~16ms)
    let scrollTimeout: number | null = null;
    let userScrolling = false;
    
    const handleMasterScroll = () => {
      if (!masterScrollerRef.current) return;
      
      // Indica che un utente sta scrollando
      userScrolling = true;
      
      const now = Date.now();
      if (now - lastScrollTime < scrollThrottleMs) return;
      lastScrollTime = now;
      
      // Ottieni la posizione corrente
      const currentScrollTop = masterScrollerRef.current.scrollTop;
      
      // Aggiorna la posizione salvata
      if (Math.abs(currentScrollTop - lastScrollPositionRef.current) > 1) {
        lastScrollPositionRef.current = currentScrollTop;
        
        // Segnala che stiamo scrollando
        if (!isScrollingRef.current) {
          document.body.classList.add('is-scrolling');
          isScrollingRef.current = true;
        }
        
        // Sincronizza gli slave via transform
        synchronizeViaTransform(currentScrollTop);
      }
      
      // Pulisci la classe dopo un breve ritardo
      if (scrollTimeout) clearTimeout(scrollTimeout);
      scrollTimeout = window.setTimeout(() => {
        document.body.classList.remove('is-scrolling');
        isScrollingRef.current = false;
        scrollTimeout = null;
      }, 150);
    };
    
    // Ottimizza l'evento scroll con passive: true per prestazioni
    masterScroller.addEventListener('scroll', handleMasterScroll, { passive: true });
    
    // Aggiungi gestione eventi touch per migliore esperienza mobile
    let touchStartY = 0;
    masterScroller.addEventListener('touchstart', (e) => {
      touchStartY = e.touches[0].clientY;
      userScrolling = true;
    }, { passive: true });
    
    // Sincronizzazione iniziale
    lastScrollPositionRef.current = masterScroller.scrollTop;
    synchronizeViaTransform(masterScroller.scrollTop);
    
    // Funzione di pulizia
    return () => {
      if (masterScrollerRef.current) {
        masterScrollerRef.current.removeEventListener('scroll', handleMasterScroll);
      }
      
      // Cleanup timeout
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
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
