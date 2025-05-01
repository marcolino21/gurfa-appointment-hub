import { useCallback } from 'react';

/**
 * Hook for setting up the master-slave scroll system
 * and configuring all scroll event listeners
 */
export const useScrollSystemSetup = () => {
  const setupMasterSlaveScrollSystem = useCallback(() => {
    const masterScroller = document.querySelector('.calendar-time-col .calendar-scroller');
    const slaveScrollers = document.querySelectorAll('.calendar-staff-col .calendar-scroller');
    const viewContainer = document.querySelector('.calendar-view-container');
    const view = document.querySelector('.calendar-view');

    if (!masterScroller || !viewContainer || !view) {
      console.warn('Required elements not found for scroll sync');
      return () => {};
    }

    const handleMasterScroll = () => {
      slaveScrollers.forEach((slaveScroller) => {
        if (slaveScroller instanceof HTMLElement) {
          slaveScroller.scrollTop = masterScroller.scrollTop;
        }
      });
    };

    masterScroller.addEventListener('scroll', handleMasterScroll);

    return () => {
      masterScroller.removeEventListener('scroll', handleMasterScroll);
    };
  }, []);

  return { setupMasterSlaveScrollSystem };
};
