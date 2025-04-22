
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

  useEffect(() => {
    if (!calendarApi || view === 'dayGridMonth' || scrollAttemptedRef.current) return;
    
    const now = new Date();
    const hours = now.getHours();
    
    // Scorre automaticamente solo durante l'orario lavorativo
    if (hours >= 8 && hours < 20) {
      // Calcola la posizione di scorrimento basata sull'ora corrente
      // Inizia alle 8:00, ogni ora è circa 80px alta (con slot di 30min a 40px ciascuno)
      const scrollPosition = Math.max(0, (hours - 8) * 80 + ((now.getMinutes() >= 30) ? 40 : 0));
      
      const scrollToCurrentTime = () => {
        try {
          // Trova il contenitore di scorrimento principale - questo controllerà tutto lo scorrimento sincronizzato
          const mainScroller = document.querySelector('.calendar-time-col') as HTMLElement;
          
          if (!mainScroller) {
            console.log('Contenitore di scorrimento primario non trovato, riprovo...');
            return false; // Riproverà
          }
          
          // Prima applica la trasformazione per forzare l'hardware acceleration
          mainScroller.style.transform = 'translateZ(0)';
          
          // Applica uno stile di transizione per uno scorrimento ancora più fluido
          mainScroller.style.transition = 'scrollTop 0.8s ease-out';

          // Esegue l'animazione al prossimo frame per garantire che la transizione funzioni
          requestAnimationFrame(() => {
            // Imposta la posizione di scorrimento con comportamento fluido
            mainScroller.scrollTo({
              top: scrollPosition,
              behavior: 'smooth'
            });
            
            // Rimuove la transizione dopo il completamento
            setTimeout(() => {
              mainScroller.style.transition = '';
            }, 850);
          });
          
          return true; // Scorrimento completato con successo
        } catch (error) {
          console.error("Errore durante lo scroll automatico:", error);
          return false; // Riproverà
        }
      };
      
      // Strategia di retry più sofisticata con intervalli crescenti
      let attempts = 0;
      const maxAttempts = 8; // Più tentativi per garantire il successo
      
      const attemptScroll = () => {
        if (attempts >= maxAttempts) {
          scrollAttemptedRef.current = true;
          return;
        }
        
        const success = scrollToCurrentTime();
        
        if (!success) {
          attempts++;
          // Intervallo esponenziale con jitter per evitare sincronizzazioni problematiche
          const baseDelay = 250;
          const jitter = Math.random() * 50;
          setTimeout(attemptScroll, baseDelay * Math.pow(1.2, attempts) + jitter);
        } else {
          scrollAttemptedRef.current = true;
        }
      };
      
      // Inizia il primo tentativo dopo il rendering iniziale
      setTimeout(attemptScroll, 500); // Ritardo aumentato per garantire il caricamento completo
    }

    return () => {
      // Resetta il flag di tentativo quando il componente viene smontato o la vista cambia
      scrollAttemptedRef.current = false;
    };
  }, [calendarApi, view]);
};
