
import itLocale from '@fullcalendar/core/locales/it';

export const useCalendarConfig = (
  slotMinTime: string,
  slotMaxTime: string,
  hiddenDays: number[],
  onDateSelect: (info: any) => void,
  onEventClick: (info: any) => void,
  onEventDrop: (info: any) => void
) => {
  return {
    locale: 'it',
    locales: [itLocale],
    initialView: 'timeGridWeek',
    slotDuration: '00:15:00',
    slotMinTime,
    slotMaxTime,
    snapDuration: '00:15:00',
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
    height: '100%',
    handleWindowResize: true,
    stickyHeaderDates: true,
    expandRows: true,
    dayMinWidth: 100,
    themeSystem: 'standard',
    headerToolbar: false,
    eventDisplay: 'block',
    eventOverlap: false,
    eventResizableFromStart: true,
    eventDragMinDistance: 5,
    nowIndicator: true,
    scrollTimeReset: false,
    hiddenDays,
    timeZone: 'local',
    views: {
      timeGridDay: {
        dayHeaderFormat: { weekday: 'long', month: 'short', day: 'numeric' }
      },
      timeGridWeek: {
        type: 'timeGrid',
        duration: { days: 7 },
        dayHeaderFormat: { weekday: 'long', month: 'short', day: 'numeric' }
      }
    },
    eventTimeFormat: {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    },
    eventClassNames: 'calendar-event',
    slotLaneClassNames: 'calendar-slot-lane',
    dayCellClassNames: 'calendar-day-cell',
    slotLabelClassNames: 'calendar-slot-label'
  };
};
