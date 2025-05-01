import React, { useState, useCallback } from 'react';
import { StaffCalendar } from './StaffCalendar';
import { useAppointmentEvents } from '../hooks/useAppointmentEvents';
import { useStaffResources } from '../hooks/useStaffResources';
import { CalendarEvent } from '../types';
import { ViewTypes } from 'react-big-scheduler';
import moment from 'moment';
import { useParams } from 'react-router-dom';

export const AppointmentCalendarView: React.FC = () => {
  const { salonId } = useParams<{ salonId: string }>();
  const { events, isLoading: isLoadingEvents, error: eventsError } = useAppointmentEvents();
  const { resources, isLoading: isLoadingResources, error: resourcesError } = useStaffResources(salonId);
  const [currentDate, setCurrentDate] = useState(moment());
  const [view, setView] = useState<ViewTypes>(ViewTypes.Week);

  const handleEventClick = useCallback((event: CalendarEvent) => {
    console.log('Event clicked:', event);
    // TODO: Implement event click handler
  }, []);

  const handleEventDrop = useCallback((event: CalendarEvent, newStart: string, newEnd: string) => {
    console.log('Event dropped:', event, newStart, newEnd);
    // TODO: Implement event drop handler
  }, []);

  const handleEventResize = useCallback((event: CalendarEvent, newStart: string, newEnd: string) => {
    console.log('Event resized:', event, newStart, newEnd);
    // TODO: Implement event resize handler
  }, []);

  const handleDateSelect = useCallback((start: string, end: string) => {
    console.log('Date selected:', start, end);
    // TODO: Implement date select handler
  }, []);

  const handleDateChange = useCallback((date: moment.Moment) => {
    setCurrentDate(date);
  }, []);

  const handleViewChange = useCallback((newView: ViewTypes) => {
    setView(newView);
  }, []);

  if (isLoadingEvents || isLoadingResources) {
    return <div>Loading...</div>;
  }

  if (eventsError || resourcesError) {
    return <div>Error: {eventsError?.message || resourcesError?.message}</div>;
  }

  return (
    <StaffCalendar
      events={events}
      resources={resources}
      currentDate={currentDate}
      view={view}
      onEventClick={handleEventClick}
      onEventDrop={handleEventDrop}
      onEventResize={handleEventResize}
      onDateSelect={handleDateSelect}
      onDateChange={handleDateChange}
      onViewChange={handleViewChange}
    />
  );
};
