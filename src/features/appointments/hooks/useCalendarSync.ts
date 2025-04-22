
import { useEffect, useRef, useCallback } from 'react';

/**
 * Hook che gestisce la sincronizzazione perfetta dello scorrimento tra 
 * tutte le colonne del calendario multi-operatore utilizzando transform per hardware acceleration
 */
export const useCalendarSync = (view: 'timeGridDay' | 'timeGridWeek' | 'dayGridMonth') => {
  // Riferimenti per tracciare lo stato dello scorrimento
  const isScrollingRef = useRef<boolean>(false);
  const lastScrollPositionRef = useRef<number>(0);
  const rafIdRef = useRef<number | null>(null);
  const masterScrollerRef = useRef<HTMLElement | null>(null);
  const slaveScrollersRef = useRef<HTMLElement[]>([]);
  const isInitializedRef = useRef<boolean>(false);
  
  // Funzione ottimizzata per applicare trasformazioni tramite requestAnimationFrame
  const synchronizeViaTransform = useCallback((scrollTop: number) => {
    // Cancella qualsiasi frame di animazione pendente per evitare accumulo
    if (rafIdRef.current !== null) {
      cancelAnimationFrame(rafIdRef.current);
    }
    
    // Applica le trasformazioni nel prossimo frame di rendering
    rafIdRef.current = requestAnimationFrame(() => {
      // Aggiorna tutte le colonne slave con la stessa trasformazione
      slaveScrollersRef.current.forEach(slaveScroller => {
        // Usiamo translateY che è ottimizzato per hardware acceleration
        slaveScroller.style.transform = `translate3d(0, -${scrollTop}px, 0)`;
      });
      
      // Resetta il riferimento del frame
      rafIdRef.current = null;
    });
  }, []);
  
  // Funzione principale per configurare il sistema master-slave
  const setupMasterSlaveScrollSystem = useCallback(() => {
    // Pulisci riferimenti precedenti
    slaveScrollersRef.current = [];
    masterScrollerRef.current = null;
    
    // Seleziona il master scroller (colonna tempo)
    const masterScroller = document.querySelector('.calendar-time-col') as HTMLElement;
    if (!masterScroller) return;
    
    // Salva il riferimento al master
    masterScrollerRef.current = masterScroller;
    
    // Trova tutti i potenziali slave scrollers
    const staffColumns = document.querySelectorAll('.calendar-staff-col .fc-scroller');
    if (staffColumns.length === 0) return;
    
    // Configura ciascuno slave
    staffColumns.forEach(staffCol => {
      const slaveScroller = staffCol as HTMLElement;
      
      // Blocca lo scrolling nativo del slave e prepara per transform
      slaveScroller.style.overflow = 'hidden';
      slaveScroller.style.willChange = 'transform';
      slaveScroller.style.transform = 'translate3d(0, 0, 0)';
      slaveScroller.style.transition = 'transform 0ms linear';
      
      // Aggiungi alla lista degli slave
      slaveScrollersRef.current.push(slaveScroller);
      
      // Disabilita gli eventi di scroll nativi per prevenire interferenze
      slaveScroller.addEventListener('scroll', (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (masterScrollerRef.current) {
          masterScrollerRef.current.scrollTop = slaveScroller.scrollTop;
        }
        return false;
      }, { passive: false });
    });
    
    // Ottimizza il master scroller
    masterScroller.style.willChange = 'scroll-position';
    masterScroller.style.overscrollBehavior = 'contain';
    
    // Aggiungi l'handler di scroll al master
    const handleMasterScroll = () => {
      if (!masterScrollerRef.current) return;
      
      // Evita aggiornamenti ridondanti
      const currentScrollTop = masterScrollerRef.current.scrollTop;
      if (currentScrollTop === lastScrollPositionRef.current) return;
      
      // Aggiorna la posizione di riferimento
      lastScrollPositionRef.current = currentScrollTop;
      
      // Segnala che stiamo scrollando per ottimizzazioni UI
      if (!isScrollingRef.current) {
        document.body.classList.add('is-scrolling');
        isScrollingRef.current = true;
      }
      
      // Sincronizza gli slave via transform
      synchronizeViaTransform(currentScrollTop);
      
      // Pulizia della classe dopo breve ritardo
      clearTimeout(window.setTimeout(() => {
        document.body.classList.remove('is-scrolling');
        isScrollingRef.current = false;
      }, 100));
    };
    
    // Ottimizza l'evento di scroll con passive: true per prestazioni
    masterScroller.addEventListener('scroll', handleMasterScroll, { passive: true });
    
    // Sincronizzazione iniziale
    lastScrollPositionRef.current = masterScroller.scrollTop;
    synchronizeViaTransform(masterScroller.scrollTop);
    
    // Restituisci funzione di pulizia
    return () => {
      if (masterScrollerRef.current) {
        masterScrollerRef.current.removeEventListener('scroll', handleMasterScroll);
      }
      
      // Resetta i riferimenti
      slaveScrollersRef.current = [];
      masterScrollerRef.current = null;
    };
  }, [synchronizeViaTransform]);
  
  // Effect principale che configura il sistema quando la vista cambia
  useEffect(() => {
    // Salta per la vista mese che non richiede sincronizzazione
    if (view === 'dayGridMonth') {
      isInitializedRef.current = false;
      return;
    }
    
    // Configurazione con ritardo per assicurarsi che il DOM sia pronto
    const setupTimer = setTimeout(() => {
      // Applica classi di ottimizzazione al container principale
      const calendarBody = document.querySelector('.calendar-grid-body');
      if (calendarBody) {
        calendarBody.classList.add('hardware-accelerated');
      }
      
      // Configura il sistema master-slave
      const cleanup = setupMasterSlaveScrollSystem();
      isInitializedRef.current = true;
      
      return cleanup;
    }, 250);
    
    // Observer per riconfigurare in caso di cambiamenti al DOM
    const observer = new MutationObserver(() => {
      if (isInitializedRef.current) {
        // Riconfigura solo se già inizializzato, altrimenti aspetta il timer
        setupMasterSlaveScrollSystem();
      }
    });
    
    // Osserva il container del calendario
    const calendarContainer = document.querySelector('.staff-calendar-block');
    if (calendarContainer) {
      observer.observe(calendarContainer, { 
        childList: true, 
        subtree: true,
        attributes: false
      });
    }
    
    // Aggiungi listener per reinizializzare su cambiamenti di finestra
    window.addEventListener('resize', setupMasterSlaveScrollSystem, { passive: true });
    window.addEventListener('orientationchange', setupMasterSlaveScrollSystem);
    
    // Pulizia
    return () => {
      clearTimeout(setupTimer);
      observer.disconnect();
      window.removeEventListener('resize', setupMasterSlaveScrollSystem);
      window.removeEventListener('orientationchange', setupMasterSlaveScrollSystem);
      
      // Pulisci qualsiasi transform applicata
      slaveScrollersRef.current.forEach(slaveScroller => {
        slaveScroller.style.transform = '';
        slaveScroller.style.overflow = '';
      });
      
      // Resetta lo stato
      isInitializedRef.current = false;
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
    };
  }, [view, setupMasterSlaveScrollSystem]);
};
