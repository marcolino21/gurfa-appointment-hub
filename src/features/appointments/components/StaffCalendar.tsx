import React, { useState, useCallback } from 'react';
import Scheduler, { SchedulerData, ViewTypes } from 'react-big-scheduler';
import moment from 'moment';
import { CalendarEvent, StaffResource } from '../types';
import 'react-big-scheduler/lib/css/style.css';
import 'antd/dist/reset.css';

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
  const [schedulerData, setSchedulerData] = useState(() => {
    const data = new SchedulerData(
      currentDate.format('YYYY-MM-DD'),
      view,
      false,
      false,
      {
        dayMaxEvents: 2,
        weekMaxEvents: 4,
        monthMaxEvents: 4,
        quarterMaxEvents: 4,
        yearMaxEvents: 4,
      }
    );
    data.setResources(resources);
    data.setEvents(events);
    return data;
  });

  const handlePrevClick = useCallback(() => {
    const newDate = moment(schedulerData.startDate);
    newDate.subtract(1, 'week');
    setSchedulerData(prev => {
      const newData = prev.clone();
      newData.setDate(newDate.format('YYYY-MM-DD'));
      return newData;
    });
    onDateChange?.(newDate);
  }, [schedulerData, onDateChange]);

  const handleNextClick = useCallback(() => {
    const newDate = moment(schedulerData.startDate);
    newDate.add(1, 'week');
    setSchedulerData(prev => {
      const newData = prev.clone();
      newData.setDate(newDate.format('YYYY-MM-DD'));
      return newData;
    });
    onDateChange?.(newDate);
  }, [schedulerData, onDateChange]);

  const handleTodayClick = useCallback(() => {
    const today = moment();
    setSchedulerData(prev => {
      const newData = prev.clone();
      newData.setDate(today.format('YYYY-MM-DD'));
      return newData;
    });
    onDateChange?.(today);
  }, [onDateChange]);

  const handleViewChange = useCallback((schedulerData: SchedulerData, newView: ViewTypes) => {
    setSchedulerData(prev => {
      const newData = prev.clone();
      newData.setViewType(newView);
      return newData;
    });
    onViewChange?.(newView);
  }, [onViewChange]);

  const handleEventClick = useCallback((schedulerData: SchedulerData, event: any) => {
    onEventClick?.(event as CalendarEvent);
  }, [onEventClick]);

  const handleDateSelect = useCallback((schedulerData: SchedulerData, date: string) => {
    const start = moment(date).startOf('day').format('YYYY-MM-DD HH:mm');
    const end = moment(date).endOf('day').format('YYYY-MM-DD HH:mm');
    onDateSelect?.(start, end);
  }, [onDateSelect]);

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
            eventItemTemplateResolver={null}
            eventItemPopoverTemplateResolver={null}
            scrollToSpecialMomentEnabled={true}
            nonAgendaCellHeaderTemplateResolver={null}
            nonAgendaCellBodyTemplateResolver={null}
          />
        </div>
      </div>
    </div>
  );
};
