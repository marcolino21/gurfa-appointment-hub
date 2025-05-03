import React, { useState, useCallback } from 'react';
import { StaffCalendar } from './StaffCalendar';
import { useAppointmentEvents, useStaffResources } from '../hooks';
import { CalendarEvent } from '../types';
import moment from 'moment';
import { useParams } from 'react-router-dom';
import { StaffMember } from '@/types/staff';

type StaffMemberWithName = StaffMember & {
  name: string;
};

export const AppointmentCalendarView: React.FC = () => {
  const { salonId } = useParams<{ salonId: string }>();
  const { events, isLoading: isLoadingEvents, error: eventsError } = useAppointmentEvents();
  const { resources, isLoading: isLoadingResources, error: resourcesError } = useStaffResources(salonId || null);
  const [currentDate, setCurrentDate] = useState(moment());
  const [view, setView] = useState<string>('week');

  const handleEventClick = useCallback((event: CalendarEvent) => {
    console.log('Event clicked:', event);
    // TODO: Implement event click handler
  }, []);

  const handleEventDrop = useCallback(() => Promise.resolve(), []);

  const handleDateChange = useCallback((date: moment.Moment) => {
    setCurrentDate(date);
  }, []);

  const handleViewChange = useCallback((newView: string) => {
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
      view={view}
      onEventClick={handleEventClick}
      onEventDrop={handleEventDrop}
      onViewChange={handleViewChange}
    />
  );
};
