
import { useEffect, useRef } from 'react';

/**
 * Hook per gestire lo scroll automatico del calendario alla posizione corrente
 * con ottimizzazioni per prestazioni e fluidità
 */
export const useAutoScroll = (
  calendarApi: any, 
  view: 'timeGridDay' | 'timeGridWeek' | 'dayGridMonth'
) => {
  const scrollAttemptedRef = useRef(false);
  const userHasScrolledRef = useRef(false);

  // Effetto che gestisce solo lo scroll iniziale - non interferisce con lo scroll manuale
  useEffect(() => {
    if (!calendarApi || view === 'dayGridMonth' || scrollAttemptedRef.current) return;
    
    const now = new Date();
    const hours = now.getHours();
    
    // Scorre automaticamente solo durante l'orario lavorativo e solo al caricamento iniziale
    if (hours >= 8 && hours < 20 && !userHasScrolledRef.current) {
      // Calcola la posizione di scorrimento basata sull'ora corrente
      const scrollPosition = Math.max(0, (hours - 8) * 80 + ((now.getMinutes() >= 30) ? 40 : 0));
      
      const scrollToCurrentTime = () => {
        try {
          // Trova il contenitore di scorrimento principale
          const masterScroller = document.querySelector('.calendar-time-col') as HTMLElement;
          
          if (!masterScroller) {
            console.log('Contenitore di scorrimento primario non trovato, riprovo...');
            return false;
          }
          
          // Applica uno stile di transizione per uno scorrimento fluido
          masterScroller.style.scrollBehavior = 'smooth';
          
          // Esegue lo scrolling iniziale
          masterScroller.scrollTop = scrollPosition;
          
          // Resetta lo stile dopo l'animazione
          setTimeout(() => {
            masterScroller.style.scrollBehavior = 'auto';
          }, 800);
          
          // Aggiungi listener per rilevare quando l'utente fa scroll manuale
          const handleUserScroll = () => {
            userHasScrolledRef.current = true;
            // Rimuovi il listener dopo il primo scroll dell'utente
            masterScroller.removeEventListener('wheel', handleUserScroll);
            masterScroller.removeEventListener('touchmove', handleUserScroll);
          };
          
          masterScroller.addEventListener('wheel', handleUserScroll, { passive: true });
          masterScroller.addEventListener('touchmove', handleUserScroll, { passive: true });
          
          return true; // Scorrimento completato con successo
        } catch (error) {
          console.error("Errore durante lo scroll automatico:", error);
          return false; // Riproverà
        }
      };
      
      // Un solo tentativo con delay breve
      setTimeout(() => {
        const success = scrollToCurrentTime();
        if (success) {
          scrollAttemptedRef.current = true;
        }
      }, 500);
    }

    return () => {
      // Resetta il flag di tentativo quando il componente viene smontato o la vista cambia
      scrollAttemptedRef.current = false;
    };
  }, [calendarApi, view]);
};
