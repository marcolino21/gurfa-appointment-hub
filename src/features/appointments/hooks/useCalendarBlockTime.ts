
import { useEffect } from 'react';
import { useStaffBlockTime } from '../hooks/useStaffBlockTime';

export const useCalendarBlockTime = () => {
  const { getBlockTimeEvents } = useStaffBlockTime();
  const blockTimeEvents = getBlockTimeEvents();

  const enhancedBlockTimeEvents = blockTimeEvents.map(event => ({
    ...event,
    display: 'background',
    rendering: 'background',
    className: 'blocked-time-event',
    classNames: ['blocked-time-event'],
    overlap: false,
    backgroundColor: 'rgba(211, 211, 211, 0.7)'
  }));

  useEffect(() => {
    if (blockTimeEvents.length > 0) {
      setTimeout(() => {
        try {
          document.querySelectorAll('.fc-bg-event').forEach(el => {
            el.classList.add('blocked-time-event');
          });
        } catch (error) {
          console.error("Error applying block time styling:", error);
        }
      }, 100);
    }
  }, [blockTimeEvents]);

  return { enhancedBlockTimeEvents };
};
