import React, { useState, useCallback } from 'react';
import Scheduler, { SchedulerData, ViewTypes } from 'react-big-scheduler';
import moment from 'moment';
import { CalendarEvent, StaffResource } from '../types';

interface StaffCalendarProps {
  events: CalendarEvent[];
  resources: StaffResource[];
  currentDate: moment.Moment;
  view?: ViewTypes;
  onEventClick?: (event: CalendarEvent) => void;
  onEventDrop?: (event: CalendarEvent, newStart: string, newEnd: string) => void;
  onEventResize?: (event: CalendarEvent, newStart: string, newEnd: string) => void;
  onDateSelect?: (start: string, end: string) => void;
  onDateChange?: (date: moment.Moment) => void;
  onViewChange?: (view: ViewTypes) => void;
}

export const StaffCalendar: React.FC<StaffCalendarProps> = ({
  events,
  resources,
  currentDate,
  view = ViewTypes.Week,
  onEventClick,
  onEventDrop,
  onEventResize,
  onDateSelect,
  onDateChange,
  onViewChange,
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

  const handleDateChange = useCallback((schedulerData: SchedulerData, direction: 'prev' | 'next') => {
    if (onDateChange) {
      const newDate = moment(currentDate).add(direction === 'prev' ? -1 : 1, 'week');
      onDateChange(newDate);
      schedulerData.setDate(newDate.format('YYYY-MM-DD'));
    }
  }, [onDateChange, currentDate]);

  const handleViewChange = useCallback((schedulerData: SchedulerData, newView: ViewTypes) => {
    if (onViewChange) {
      onViewChange(newView);
    }
    schedulerData.setViewType(newView, newView === ViewTypes.Week);
  }, [onViewChange]);

  return (
    <div className="calendar-container">
      <div className="scheduler-container">
        <div className="scheduler-header">
          <div className="scheduler-toolbar">
            <button className="today-button" onClick={() => handleDateChange(schedulerData, 'prev')}>
              Today
            </button>
          </div>
        </div>
        <div className="scheduler-view">
          <Scheduler
            schedulerData={schedulerData}
            prevClick={() => handleDateChange(schedulerData, 'prev')}
            nextClick={() => handleDateChange(schedulerData, 'next')}
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
