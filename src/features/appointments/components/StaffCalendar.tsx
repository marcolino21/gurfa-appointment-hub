import React, { useState, useEffect } from 'react';
import Scheduler, { SchedulerData, ViewTypes } from 'react-big-scheduler';
import { CalendarEvent } from '../types';
import { useScrollSystemSetup } from '../hooks/calendar-sync/useScrollSystemSetup';
import moment from 'moment';

interface StaffCalendarProps {
  events: CalendarEvent[];
  resources: Array<{ id: string; name: string }>;
  view: ViewTypes;
  onEventClick?: (event: CalendarEvent) => void;
  onEventDrop?: (event: CalendarEvent) => void;
  onEventResize?: (event: CalendarEvent) => void;
  onEventAdd?: (event: CalendarEvent) => void;
  onEventDelete?: (event: CalendarEvent) => void;
  onViewChange?: (view: ViewTypes) => void;
  onDateSelect?: (date: string) => void;
}

const StaffCalendar: React.FC<StaffCalendarProps> = ({
  events,
  resources,
  view,
  onEventClick,
  onEventDrop,
  onEventResize,
  onEventAdd,
  onEventDelete,
  onViewChange,
  onDateSelect,
}) => {
  const [currentDate, setCurrentDate] = useState(moment());
  const [schedulerData, setSchedulerData] = useState<SchedulerData>(
    new SchedulerData(
      currentDate.format('YYYY-MM-DD'),
      view,
      false,
      false,
      {
        schedulerWidth: '100%',
        schedulerMaxHeight: 600,
        nonWorkingTimeBodyBgColor: '#f8fafc',
      }
    )
  );
  const { setupMasterSlaveScrollSystem } = useScrollSystemSetup();

  useEffect(() => {
    setupMasterSlaveScrollSystem();
  }, [setupMasterSlaveScrollSystem]);

  useEffect(() => {
    const newSchedulerData = new SchedulerData(
      currentDate.format('YYYY-MM-DD'),
      view,
      false,
      false,
      {
        schedulerWidth: '100%',
        schedulerMaxHeight: 600,
        nonWorkingTimeBodyBgColor: '#f8fafc',
      }
    );
    newSchedulerData.setResources(resources);
    newSchedulerData.setEvents(events);
    setSchedulerData(newSchedulerData);
  }, [events, resources, view, currentDate]);

  const handleEventClick = (schedulerData: SchedulerData, event: any) => {
    if (onEventClick) {
      onEventClick(event as CalendarEvent);
    }
  };

  const handleEventDrop = (schedulerData: SchedulerData, event: any) => {
    if (onEventDrop) {
      onEventDrop(event as CalendarEvent);
    }
  };

  const handleEventResize = (schedulerData: SchedulerData, event: any) => {
    if (onEventResize) {
      onEventResize(event as CalendarEvent);
    }
  };

  const handleViewChange = (schedulerData: SchedulerData, newView: ViewTypes) => {
    if (onViewChange) {
      onViewChange(newView);
    }
  };

  const handleDateSelect = (schedulerData: SchedulerData) => {
    const newDate = moment(currentDate).add(1, 'day').format('YYYY-MM-DD');
    setCurrentDate(moment(newDate));
    if (onDateSelect) {
      onDateSelect(newDate);
    }
  };

  const eventItemTemplateResolver = (schedulerData: SchedulerData, event: any) => (
    <div className="calendar-event">
      <div className="calendar-event-time">
        {moment(event.start).format('HH:mm')} - {moment(event.end).format('HH:mm')}
      </div>
      <div className="calendar-event-title">{event.title}</div>
    </div>
  );

  return (
    <div className="staff-calendar-block">
      <div className="calendar-header-toolbar">
        <div className="calendar-toolbar-chunk">
          <button
            className="calendar-today-button"
            onClick={() => {
              const today = moment().format('YYYY-MM-DD');
              setCurrentDate(moment(today));
              const newSchedulerData = new SchedulerData(
                today,
                view,
                false,
                false,
                {
                  schedulerWidth: '100%',
                  schedulerMaxHeight: 600,
                  nonWorkingTimeBodyBgColor: '#f8fafc',
                }
              );
              newSchedulerData.setResources(resources);
              newSchedulerData.setEvents(events);
              setSchedulerData(newSchedulerData);
            }}
          >
            Oggi
          </button>
        </div>
        <div className="calendar-toolbar-title">
          {currentDate.format('MMMM YYYY')}
        </div>
      </div>
      <div className="calendar-view-container">
        <Scheduler
          schedulerData={schedulerData}
          prevClick={handleDateSelect}
          nextClick={handleDateSelect}
          onViewChange={handleViewChange}
          onSelectDate={handleDateSelect}
          eventItemClick={handleEventClick}
          eventItemTemplateResolver={eventItemTemplateResolver}
          onEventDrop={handleEventDrop}
          onEventResize={handleEventResize}
        />
      </div>
    </div>
  );
};

export default StaffCalendar;
