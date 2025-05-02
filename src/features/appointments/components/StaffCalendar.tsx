import React, { useState, useCallback, useEffect } from 'react';
import Scheduler, { SchedulerData, ViewTypes, View, Event } from 'react-big-scheduler';
import moment from 'moment';
import { CalendarEvent, StaffResource, EventItemTemplateResolver, EventItemPopoverTemplateResolver } from '../types';
import { StaffMember } from '@/types/staff';
import 'react-big-scheduler/lib/css/style.css';
import 'antd/dist/reset.css';
import '../styles/scheduler.css';

const styles = {
  calendarContainer: {
    width: '100%',
    height: '100%',
    padding: '1rem',
  },
  schedulerContainer: {
    width: '100%',
    height: '100%',
    border: '1px solid #e2e8f0',
    borderRadius: '0.5rem',
    overflow: 'hidden',
  },
  schedulerHeader: {
    padding: '0.5rem',
    borderBottom: '1px solid #e2e8f0',
  },
  schedulerToolbar: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '0.5rem',
  },
  todayButton: {
    padding: '0.5rem 1rem',
    backgroundColor: '#3b82f6',
    color: 'white',
    border: 'none',
    borderRadius: '0.25rem',
    cursor: 'pointer',
  },
  schedulerView: {
    height: 'calc(100% - 3rem)',
  },
};

interface StaffCalendarProps {
  visibleStaff: StaffMember[];
  events: CalendarEvent[];
  resources: StaffResource[];
  currentDate: moment.Moment;
  view?: ViewTypes;
  onEventClick?: (event: CalendarEvent) => void;
  onEventDrop?: (event: CalendarEvent, newStart: string, newEnd: string) => void;
  onEventResize?: (event: CalendarEvent, newStart: string, newEnd: string) => void;
  onDateSelect?: (start: string, end: string) => void;
  onDateChange?: (date: moment.Moment) => void;
  onViewChange: (view: ViewTypes) => void;
}

export const StaffCalendar: React.FC<StaffCalendarProps> = ({
  visibleStaff,
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
  const [schedulerData, setSchedulerData] = useState(() => {
    const data = new SchedulerData(currentDate.format('YYYY-MM-DD'), view);
    data.setResources(resources);
    data.setEvents(events);
    return data;
  });

  useEffect(() => {
    const newData = schedulerData.clone();
    newData.setResources(resources);
    newData.setEvents(events);
    setSchedulerData(newData);
  }, [resources, events]);

  useEffect(() => {
    const newData = schedulerData.clone();
    newData.setDate(currentDate.format('YYYY-MM-DD'));
    setSchedulerData(newData);
  }, [currentDate]);

  const handlePrevClick = useCallback(() => {
    const newDate = moment(schedulerData.startDate).subtract(1, 'week');
    const newData = schedulerData.clone();
    newData.setDate(newDate.format('YYYY-MM-DD'));
    setSchedulerData(newData);
    onDateChange?.(newDate);
  }, [schedulerData, onDateChange]);

  const handleNextClick = useCallback(() => {
    const newDate = moment(schedulerData.startDate).add(1, 'week');
    const newData = schedulerData.clone();
    newData.setDate(newDate.format('YYYY-MM-DD'));
    setSchedulerData(newData);
    onDateChange?.(newDate);
  }, [schedulerData, onDateChange]);

  const handleTodayClick = useCallback(() => {
    const today = moment();
    const newData = schedulerData.clone();
    newData.setDate(today.format('YYYY-MM-DD'));
    setSchedulerData(newData);
    onDateChange?.(today);
  }, [schedulerData, onDateChange]);

  const handleViewChange = useCallback((schedulerData: SchedulerData, view: View) => {
    const newData = schedulerData.clone();
    newData.setViewType(view.viewType);
    setSchedulerData(newData);
    onViewChange(view.viewType);
  }, [onViewChange]);

  const handleEventClick = useCallback((schedulerData: SchedulerData, event: Event) => {
    onEventClick?.(event as CalendarEvent);
  }, [onEventClick]);

  const handleEventDrop = useCallback((schedulerData: SchedulerData, event: Event, slotId: string, slotName: string, start: string, end: string) => {
    onEventDrop?.(event as CalendarEvent, start, end);
  }, [onEventDrop]);

  const handleEventResize = useCallback((schedulerData: SchedulerData, event: Event, start: string, end: string) => {
    onEventResize?.(event as CalendarEvent, start, end);
  }, [onEventResize]);

  const handleDateSelect = useCallback((schedulerData: SchedulerData, date: string) => {
    if (onDateSelect) {
      const start = moment(date).startOf('day').format('YYYY-MM-DD HH:mm');
      const end = moment(date).endOf('day').format('YYYY-MM-DD HH:mm');
      onDateSelect(start, end);
    }
  }, [onDateSelect]);

  const eventItemTemplateResolver = useCallback((
    schedulerData: SchedulerData,
    event: Event,
    bgColor: string,
    isStart: boolean,
    isEnd: boolean,
    mustAddCssClass: string,
    mustBeHeight: number,
    agendaMaxEventWidth: number
  ) => {
    const calendarEvent = event as CalendarEvent;
    const statusClass = calendarEvent.status ? `status-${calendarEvent.status.toLowerCase()}` : '';
    return (
      <div 
        className={`scheduler-event ${statusClass} ${mustAddCssClass}`} 
        style={{ backgroundColor: calendarEvent.color || bgColor, height: mustBeHeight }}
      >
        <div className="event-title">{calendarEvent.title}</div>
        <div className="event-time">
          {moment(calendarEvent.start).format('HH:mm')} - {moment(calendarEvent.end).format('HH:mm')}
        </div>
      </div>
    );
  }, []);

  const eventItemPopoverTemplateResolver = useCallback((
    schedulerData: SchedulerData,
    eventItem: Event,
    title: string,
    start: moment.Moment,
    end: moment.Moment,
    statusColor: string
  ) => {
    const calendarEvent = eventItem as CalendarEvent;
    return (
      <div className="event-popover">
        <h3 className="event-title">{title}</h3>
        <div className="event-details">
          <p>Inizio: {start.format('HH:mm')}</p>
          <p>Fine: {end.format('HH:mm')}</p>
          {calendarEvent.status && <p>Stato: {calendarEvent.status}</p>}
        </div>
      </div>
    );
  }, []);

  return (
    <div style={styles.calendarContainer}>
      <div style={styles.schedulerContainer}>
        <div style={styles.schedulerHeader}>
          <div style={styles.schedulerToolbar}>
            <button style={styles.todayButton} onClick={handleTodayClick}>
              Oggi
            </button>
            <button style={styles.todayButton} onClick={handlePrevClick}>
              &lt;
            </button>
            <button style={styles.todayButton} onClick={handleNextClick}>
              &gt;
            </button>
          </div>
        </div>
        <div style={styles.schedulerView}>
          <Scheduler
            schedulerData={schedulerData}
            prevClick={handlePrevClick}
            nextClick={handleNextClick}
            onSelectDate={handleDateSelect}
            onViewChange={handleViewChange}
            eventItemClick={handleEventClick}
            eventItemTemplateResolver={eventItemTemplateResolver}
            eventItemPopoverTemplateResolver={eventItemPopoverTemplateResolver}
          />
        </div>
      </div>
    </div>
  );
};

export default StaffCalendar;
