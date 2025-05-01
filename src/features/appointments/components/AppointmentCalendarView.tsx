import React, { useState } from 'react';
import { ViewTypes } from 'react-big-scheduler';
import StaffCalendar from './StaffCalendar';
import { CalendarEvent } from '../types';
import { useAppointmentEvents } from '../hooks/useAppointmentEvents';
import { useStaffResources } from '../hooks/useStaffResources';

interface AppointmentCalendarViewProps {
  onEventClick?: (event: CalendarEvent) => void;
  onEventDrop?: (event: CalendarEvent) => void;
  onEventResize?: (event: CalendarEvent) => void;
  onEventAdd?: (event: CalendarEvent) => void;
  onEventDelete?: (event: CalendarEvent) => void;
}

const AppointmentCalendarView: React.FC<AppointmentCalendarViewProps> = ({
  onEventClick,
  onEventDrop,
  onEventResize,
  onEventAdd,
  onEventDelete,
}) => {
  const [view, setView] = useState<ViewTypes>(ViewTypes.Week);
  const { events, isLoading } = useAppointmentEvents();
  const { resources, isLoading: isLoadingResources } = useStaffResources();

  const handleViewChange = (newView: ViewTypes) => {
    setView(newView);
  };

  const handleDateSelect = (date: string) => {
    // Handle date selection if needed
  };

  const handleEventDrop = (event: CalendarEvent) => {
    if (onEventDrop) {
      onEventDrop(event);
    }
  };

  const handleEventResize = (event: CalendarEvent) => {
    if (onEventResize) {
      onEventResize(event);
    }
  };

  if (isLoading || isLoadingResources) {
    return <div>Loading...</div>;
  }

  return (
    <StaffCalendar
      events={events}
      resources={resources}
      view={view}
      onEventClick={onEventClick}
      onEventDrop={handleEventDrop}
      onEventResize={handleEventResize}
      onEventAdd={onEventAdd}
      onEventDelete={onEventDelete}
      onViewChange={handleViewChange}
      onDateSelect={handleDateSelect}
    />
  );
};

export default AppointmentCalendarView;
