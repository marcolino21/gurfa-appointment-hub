import React, { useState, useCallback } from 'react';
import Scheduler, { SchedulerData, ViewTypes, Event } from 'react-big-scheduler';
import moment from 'moment';
import { DndProvider } from './DndProvider';
import { DraggableEvent } from './DraggableEvent';
import { DroppableStaffColumn } from './DroppableStaffColumn';
import { CalendarEvent, StaffResource } from '../types';

interface StaffCalendarProps {
  events: CalendarEvent[];
  resources: StaffResource[];
  onEventClick?: (event: CalendarEvent) => void;
  onEventDrop?: (event: CalendarEvent, newStart: string, newEnd: string, newResourceId: string) => void;
  onEventResize?: (event: CalendarEvent, newStart: string, newEnd: string) => void;
  onDateSelect?: (date: string) => void;
  view?: ViewTypes;
}

export const StaffCalendar: React.FC<StaffCalendarProps> = ({
  events,
  resources,
  onEventClick,
  onEventDrop,
  onEventResize,
  onDateSelect,
  view = ViewTypes.Week
}) => {
  const [currentDate, setCurrentDate] = useState(moment().format('YYYY-MM-DD'));
  const [schedulerData] = useState(new SchedulerData(
    currentDate,
    view,
    false,
    false,
    {
      schedulerWidth: '100%',
      schedulerMaxHeight: 600,
      nonWorkingTimeBodyBgColor: '#f8fafc',
    }
  ));

  const handleDragEnd = useCallback(({ active, over }) => {
    if (!over || !onEventDrop) return;

    const event = active.data.current as CalendarEvent;
    const newResource = over.data.current as StaffResource;
    const newStart = moment(event.start).format('YYYY-MM-DD HH:mm');
    const newEnd = moment(event.end).format('YYYY-MM-DD HH:mm');

    onEventDrop(event, newStart, newEnd, newResource.id);
  }, [onEventDrop]);

  const handleEventClick = useCallback((schedulerData: SchedulerData, event: Event) => {
    if (onEventClick) {
      onEventClick(event as CalendarEvent);
    }
  }, [onEventClick]);

  const handleDateSelect = useCallback((schedulerData: SchedulerData) => {
    const newDate = moment(currentDate).add(1, 'day').format('YYYY-MM-DD');
    schedulerData.setDate(newDate);
    setCurrentDate(newDate);
    if (onDateSelect) {
      onDateSelect(newDate);
    }
  }, [currentDate, onDateSelect]);

  const handleViewChange = useCallback((schedulerData: SchedulerData) => {
    // Aggiorna la vista se necessario
  }, []);

  return (
    <DndProvider onDragEnd={handleDragEnd}>
      <div className="staff-calendar">
        <Scheduler
          schedulerData={schedulerData}
          prevClick={handleDateSelect}
          nextClick={handleDateSelect}
          onSelectDate={handleDateSelect}
          onViewChange={handleViewChange}
          eventItemClick={handleEventClick}
          viewType={view}
          showAgenda={false}
          isEventPerspective={false}
          customEvent={({ event }) => (
            <DraggableEvent event={event as CalendarEvent}>
              <div className="calendar-event-content">
                <div className="calendar-event-time">
                  {moment(event.start).format('HH:mm')} - {moment(event.end).format('HH:mm')}
                </div>
                <div className="calendar-event-title">{event.title}</div>
                {(event as CalendarEvent).clientName && (
                  <div className="calendar-event-client">{(event as CalendarEvent).clientName}</div>
                )}
              </div>
            </DraggableEvent>
          )}
          customResource={({ resource }) => (
            <DroppableStaffColumn resource={resource as StaffResource}>
              <div className="staff-column-header">
                <div className="staff-name">{resource.name}</div>
              </div>
            </DroppableStaffColumn>
          )}
        />
      </div>
    </DndProvider>
  );
};
