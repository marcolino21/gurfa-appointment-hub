import React, { useState, useCallback } from 'react';
import Scheduler, { SchedulerData, ViewTypes } from 'react-big-scheduler';
import moment from 'moment';
import { CalendarEvent, StaffResource } from '../types';

interface StaffCalendarProps {
  events: CalendarEvent[];
  resources: StaffResource[];
  currentDate: moment.Moment;
  onEventClick?: (event: CalendarEvent) => void;
  onEventDrop?: (event: CalendarEvent, newStart: string, newEnd: string) => void;
  onEventResize?: (event: CalendarEvent, newStart: string, newEnd: string) => void;
  onDateSelect?: (start: string, end: string) => void;
  onDateChange?: (date: moment.Moment) => void;
  view?: ViewTypes;
}

export const StaffCalendar: React.FC<StaffCalendarProps> = ({
  events,
  resources,
  currentDate,
  onEventClick,
  onEventDrop,
  onEventResize,
  onDateSelect,
  onDateChange,
  view = ViewTypes.Week,
}) => {
  const [schedulerData] = useState(() => {
    const data = new SchedulerData(
      currentDate.format('YYYY-MM-DD'),
      view,
      false,
      false,
      {
        dayMaxEvents: true,
        weekMaxEvents: true,
        monthMaxEvents: true,
        schedulerWidth: '100%',
        schedulerMaxHeight: 600,
        nonWorkingTimeBodyBgColor: '#f8fafc',
      }
    );
    data.setResources(resources);
    data.setEvents(events);
    return data;
  });

  const handleEventClick = useCallback((schedulerData: SchedulerData, event: CalendarEvent) => {
    if (onEventClick) {
      onEventClick(event);
    }
  }, [onEventClick]);

  const handleEventDrop = useCallback((schedulerData: SchedulerData, event: CalendarEvent, newStart: string, newEnd: string) => {
    if (onEventDrop) {
      onEventDrop(event, newStart, newEnd);
    }
  }, [onEventDrop]);

  const handleEventResize = useCallback((schedulerData: SchedulerData, event: CalendarEvent, newStart: string, newEnd: string) => {
    if (onEventResize) {
      onEventResize(event, newStart, newEnd);
    }
  }, [onEventResize]);

  const handleDateSelect = useCallback((schedulerData: SchedulerData, date: string) => {
    if (onDateSelect) {
      const start = moment(date).startOf('day').format('YYYY-MM-DD HH:mm');
      const end = moment(date).endOf('day').format('YYYY-MM-DD HH:mm');
      onDateSelect(start, end);
    }
  }, [onDateSelect]);

  const handleDateChange = useCallback((schedulerData: SchedulerData) => {
    if (onDateChange) {
      onDateChange(moment(schedulerData.startDate));
    }
  }, [onDateChange]);

  const handleViewChange = useCallback((schedulerData: SchedulerData, view: ViewTypes) => {
    schedulerData.setViewType(view, view === ViewTypes.Week);
  }, []);

  return (
    <div className="calendar-container">
      <div className="scheduler-container">
        <div className="scheduler-header">
          <div className="scheduler-toolbar">
            <button className="today-button" onClick={() => handleDateChange(schedulerData)}>
              Today
            </button>
          </div>
        </div>
        <div className="scheduler-view">
          <Scheduler
            schedulerData={schedulerData}
            prevClick={handleDateChange}
            nextClick={handleDateChange}
            onSelectDate={handleDateSelect}
            onViewChange={handleViewChange}
            eventItemClick={handleEventClick}
            eventItemDrop={handleEventDrop}
            eventItemResize={handleEventResize}
            viewType={view}
            showAgenda={false}
            isEventPerspective={false}
          />
        </div>
      </div>
    </div>
  );
};
