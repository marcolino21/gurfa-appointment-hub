
import { useEffect, useRef, useCallback } from 'react';

/**
 * Hook che gestisce la sincronizzazione perfetta dello scorrimento tra 
 * tutte le colonne del calendario multi-operatore
 */
export const useCalendarSync = (view: 'timeGridDay' | 'timeGridWeek' | 'dayGridMonth') => {
  // Riferimenti per tracciare lo stato dello scorrimento
  const activeScrollElementRef = useRef<EventTarget | null>(null);
  const animationFrameRequestedRef = useRef<number | null>(null);
  const scrollLockTimeoutRef = useRef<number | null>(null);
  const isInitialSyncDoneRef = useRef<boolean>(false);
  
  // Funzione memoizzata per sincronizzare gli elementi di scorrimento
  const synchronizeScrolling = useCallback(() => {
    // Otteniamo tutti i contenitori di scorrimento che devono essere sincronizzati
    const scrollContainers = document.querySelectorAll(
      '.fc-scroller-liquid-absolute, .calendar-time-col, .calendar-staff-cols'
    );
    
    // Verifica che ci siano abbastanza contenitori da sincronizzare
    if (scrollContainers.length <= 1) return undefined;
    
    // Allineamento iniziale per assicurarsi che tutti i contenitori partano dalla stessa posizione
    if (!isInitialSyncDoneRef.current) {
      setTimeout(() => {
        const mainScroller = document.querySelector('.calendar-time-col') as HTMLElement;
        if (mainScroller) {
          const scrollTop = mainScroller.scrollTop;
          scrollContainers.forEach(container => {
            const element = container as HTMLElement;
            if (element !== mainScroller) {
              element.scrollTop = scrollTop;
            }
          });
        }
        isInitialSyncDoneRef.current = true;
      }, 100);
    }
    
    // Funzione ottimizzata per gestire eventi di scorrimento
    const handleScroll = (event: Event) => {
      // Ignora eventi ripetuti dallo stesso elemento o eventi durante l'animazione
      if (activeScrollElementRef.current === event.target || 
          animationFrameRequestedRef.current !== null) {
        return;
      }
      
      // Blocca temporaneamente altri eventi di scorrimento
      activeScrollElementRef.current = event.target;
      
      // Usa requestAnimationFrame per allineare l'aggiornamento con il ciclo di rendering del browser
      animationFrameRequestedRef.current = requestAnimationFrame(() => {
        try {
          const scrollingElement = event.target as HTMLElement;
          const scrollTop = scrollingElement.scrollTop;
          
          // Aggiorna tutti gli altri contenitori per mantenere l'allineamento
          scrollContainers.forEach(container => {
            const element = container as HTMLElement;
            if (element !== scrollingElement) {
              // Imposta lo scrollTop direttamente per massima efficienza
              element.scrollTop = scrollTop;
            }
          });
        } catch (error) {
          console.error("Errore durante la sincronizzazione dello scorrimento:", error);
        } finally {
          // Resetta il flag di animazione
          animationFrameRequestedRef.current = null;
          
          // Sblocca gli eventi di scorrimento con un breve ritardo per evitare oscillazioni
          if (scrollLockTimeoutRef.current) {
            clearTimeout(scrollLockTimeoutRef.current);
          }
          
          scrollLockTimeoutRef.current = window.setTimeout(() => {
            activeScrollElementRef.current = null;
            scrollLockTimeoutRef.current = null;
          }, 30); // Ritardo ottimizzato per prestazioni fluide
        }
      });
    };
    
    // Aggiungi listener con il flag passive per migliorare le prestazioni
    scrollContainers.forEach(container => {
      container.addEventListener('scroll', handleScroll, { passive: true });
    });
    
    // Funzione di pulizia che rimuove tutti i listener quando il componente viene smontato
    return () => {
      scrollContainers.forEach(container => {
        container.removeEventListener('scroll', handleScroll);
      });
      
      // Cancella eventuali animationFrame pendenti
      if (animationFrameRequestedRef.current !== null) {
        cancelAnimationFrame(animationFrameRequestedRef.current);
        animationFrameRequestedRef.current = null;
      }
      
      // Cancella eventuali timeout pendenti
      if (scrollLockTimeoutRef.current !== null) {
        clearTimeout(scrollLockTimeoutRef.current);
        scrollLockTimeoutRef.current = null;
      }
    };
  }, []);
  
  useEffect(() => {
    // Salta la sincronizzazione per la vista mese
    if (view === 'dayGridMonth') return;
    
    // Reimposta il flag di sincronizzazione iniziale quando cambia la vista
    isInitialSyncDoneRef.current = false;
    
    // Ritardo minimo per assicurarsi che il DOM sia completamente caricato
    const setupTimer = setTimeout(() => {
      // Forza un'ottimizzazione del layout prima di iniziare la sincronizzazione
      const calendarBody = document.querySelector('.calendar-grid-body');
      if (calendarBody instanceof Element) {
        calendarBody.classList.add('hardware-accelerated');
      }
      
      // Avvia la sincronizzazione
      const cleanup = synchronizeScrolling();
      
      return () => {
        if (cleanup) cleanup();
      };
    }, 100);
    
    // Ascolta eventi di ridimensionamento e orientamento per aggiornare la sincronizzazione
    window.addEventListener('resize', synchronizeScrolling, { passive: true });
    window.addEventListener('orientationchange', synchronizeScrolling);
    
    // Usa MutationObserver per rilevare cambiamenti al DOM che richiedono risincronizzazione
    const observer = new MutationObserver((mutations) => {
      const shouldReSync = mutations.some(mutation => {
        const target = mutation.target as Node;
        
        // Verifica se il target è un Element prima di accedere a classList
        if (target instanceof Element) {
          return target.classList.contains('staff-calendar-block') ||
                 target.classList.contains('calendar-grid-body');
        }
        return false;
      });
      
      if (shouldReSync) {
        isInitialSyncDoneRef.current = false;
        synchronizeScrolling();
      }
    });
    
    // Osserva il contenitore principale del calendario per modifiche
    const calendarElement = document.querySelector('.staff-calendar-block');
    if (calendarElement) {
      observer.observe(calendarElement, { 
        childList: true, 
        subtree: true,
        attributes: true,
        attributeFilter: ['class', 'style']
      });
    }
    
    // Pulizia quando il componente viene smontato
    return () => {
      clearTimeout(setupTimer);
      window.removeEventListener('resize', synchronizeScrolling);
      window.removeEventListener('orientationchange', synchronizeScrolling);
      observer.disconnect();
    };
  }, [view, synchronizeScrolling]);
};
