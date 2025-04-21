
import itLocale from '@fullcalendar/core/locales/it';

export const useCalendarConfig = (
  slotMinTime: string,
  slotMaxTime: string,
  hiddenDays: number[],
  onDateSelect: (info: any) => void,
  onEventClick: (info: any) => void,
  onEventDrop: (info: any) => void
) => {
  const commonConfig = {
    locale: 'it',
    locales: [itLocale],
    slotMinTime,
    slotMaxTime,
    allDaySlot: false,
    selectMirror: true,
    dayMaxEvents: true,
    selectable: true,
    select: onDateSelect,
    eventClick: onEventClick,
    editable: true,
    droppable: true,
    eventDrop: onEventDrop,
    headerToolbar: false,
    slotDuration: '00:30:00',
    height: '100%',
    nowIndicator: true,
    stickyHeaderDates: true,
    scrollTimeReset: false,
    hiddenDays,
    timeZone: 'local',
    eventTimeFormat: {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    },
    dayHeaderFormat: { 
      weekday: 'long', 
      month: 'short', 
      day: 'numeric'
    },
    slotLabelFormat: {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    },
    views: {
      timeGridDay: {
        dayHeaderFormat: { 
          weekday: 'long', 
          month: 'short', 
          day: 'numeric'
        }
      },
      timeGridWeek: {
        dayHeaderFormat: { 
          weekday: 'short', 
          month: 'numeric', 
          day: 'numeric'
        }
      },
      dayGridMonth: {
        dayHeaderFormat: { 
          weekday: 'short'
        }
      }
    }
  };

  return commonConfig;
};
