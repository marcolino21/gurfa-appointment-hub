
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
    slotDuration: '00:30:00',
    slotMinTime,
    slotMaxTime,
    snapDuration: '00:30:00',
    slotLabelInterval: '00:30',
    slotLabelFormat: {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    },
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
    dayCellBorderColor: '#e5e7eb',
    slotLaneClassNames: 'border-r border-gray-200 bg-white',
    slotLabelClassNames: 'text-sm font-medium text-gray-500 pr-2',
    slotLabelContent: (arg) => {
      // Display hours and minutes for each slot
      const hour = arg.date.getHours().toString().padStart(2, '0');
      const minute = arg.date.getMinutes().toString().padStart(2, '0');
      return `${hour}:${minute}`;
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
        type: 'timeGrid',
        duration: { days: 1 }
      }
    }
  };

  return commonConfig;
};
