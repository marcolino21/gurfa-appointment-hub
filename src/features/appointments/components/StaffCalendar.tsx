<<<<<<< HEAD
import React, { useState, useEffect } from 'react';
import { Scheduler, SchedulerData, ViewTypes, DATE_FORMAT } from 'react-big-scheduler';
import 'react-big-scheduler/lib/css/style.css';
=======
<<<<<<< HEAD

import React, { useEffect } from 'react';
import BigSchedulerCalendar from './BigSchedulerCalendar';
import { StaffMember } from '@/types';
import CalendarErrorBoundary from './CalendarErrorBoundary';

// Import the custom css for our scheduler
>>>>>>> 863cd2f (Update dependencies and fix package.json conflicts)
import '../styles/scheduler.css';
import moment from 'moment';
import { useStaffBlockTime } from '../hooks/useStaffBlockTime';
import { useBusinessHours } from '../hooks/useBusinessHours';
import { useAppointmentEvents } from '../hooks/useAppointmentEvents';
import { StaffMember, getStaffMemberName } from '../../../types/staff';
import { Appointment } from '../../../types/appointments';

interface StaffCalendarProps {
  staffMembers: StaffMember[];
<<<<<<< HEAD
  appointments: Appointment[];
  onDateSelect: (info: DateSelectInfo) => void;
  onEventClick: (event: CalendarEvent) => void;
=======
  events: any[];
  view?: 'timeGridDay' | 'timeGridWeek' | 'dayGridMonth';
  onEventClick?: (clickInfo: any) => void;
  onEventDrop?: (dropInfo: any) => void;
  onEventResize?: (resizeInfo: any) => void;
  onDateSelect?: (selectInfo: any) => void;
=======
import React, { useState, useEffect } from 'react';
import { Scheduler, SchedulerData, ViewTypes, DATE_FORMAT } from 'react-big-scheduler';
import 'react-big-scheduler/lib/css/style.css';
import '../styles/scheduler.css';
import moment from 'moment';
import { useStaffBlockTime } from '../hooks/useStaffBlockTime';
import { useBusinessHours } from '../hooks/useBusinessHours';
import { useAppointmentEvents } from '../hooks/useAppointmentEvents';
import { StaffMember, getStaffMemberName } from '../../../types/staff';
import { Appointment } from '../../../types/appointments';

interface StaffCalendarProps {
  staffMembers: StaffMember[];
  appointments: Appointment[];
  onDateSelect: (info: DateSelectInfo) => void;
  onEventClick: (event: CalendarEvent) => void;
>>>>>>> 8542f29 (Update dependencies and fix vulnerabilities: - Update antd to latest version - Update vite to latest version - Update react-big-scheduler to latest version - Remove deprecated files and update calendar components)
>>>>>>> 863cd2f (Update dependencies and fix package.json conflicts)
}

interface DateSelectInfo {
  start: Date;
  end: Date;
  allDay: boolean;
  jsEvent: MouseEvent;
  view: any;
}
<<<<<<< HEAD
=======

interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  end: string;
  resourceId: string;
  bgColor?: string;
}

export const StaffCalendar: React.FC<StaffCalendarProps> = ({
  staffMembers,
<<<<<<< HEAD
  events,
  view = 'timeGridWeek',
  onEventClick,
  onEventDrop,
  onEventResize,
  onDateSelect
}) => {
  // Map our internal view types to the BigScheduler view types
  const mapViewType = (viewType: string): 'day' | 'week' | 'month' => {
    switch (viewType) {
      case 'timeGridDay':
        return 'day';
      case 'dayGridMonth':
        return 'month';
      case 'timeGridWeek':
      default:
        return 'week';
    }
  };
>>>>>>> 863cd2f (Update dependencies and fix package.json conflicts)

interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  end: string;
  resourceId: string;
  bgColor?: string;
}

export const StaffCalendar: React.FC<StaffCalendarProps> = ({
  staffMembers,
  appointments,
  onDateSelect,
  onEventClick,
}) => {
  const [schedulerData, setSchedulerData] = useState(() => {
    const data = new SchedulerData(moment().format(DATE_FORMAT), ViewTypes.Week, false, false, {
      schedulerWidth: '100%',
      schedulerMaxHeight: 0,
      dayStartFrom: 8,
      dayStopTo: 20,
      eventItemHeight: 40,
      eventItemLineHeight: 40,
      nonWorkingTimeBodyBgColor: '#f0f0f0',
      minuteStep: 30,
    });
    
    // Convert staff members to resources
    const resources = staffMembers.map(staff => ({
      id: staff.id,
      name: getStaffMemberName(staff),
      color: staff.color || '#4f46e5'
    }));
    
    data.setResources(resources);
    return data;
  });

  useEffect(() => {
    // Convert appointments to events
    const events = appointments.map(appointment => ({
      id: appointment.id,
      start: moment(appointment.start).format('YYYY-MM-DD HH:mm:ss'),
      end: moment(appointment.end).format('YYYY-MM-DD HH:mm:ss'),
      resourceId: appointment.staffId || '',
      title: appointment.title || 'Appuntamento',
      bgColor: '#4f46e5'
    }));

    schedulerData.setEvents(events);
    setSchedulerData(schedulerData);
  }, [appointments, staffMembers]);

  const prevClick = () => {
    schedulerData.prev();
    setSchedulerData(schedulerData);
  };

  const nextClick = () => {
    schedulerData.next();
    setSchedulerData(schedulerData);
  };

  const onSelectDate = (date: string) => {
    schedulerData.setDate(date);
    setSchedulerData(schedulerData);
  };

  const onViewChange = (viewType: ViewTypes) => {
    schedulerData.setViewType(viewType, false, false);
    setSchedulerData(schedulerData);
  };

  const eventClicked = (schedulerData: SchedulerData, event: CalendarEvent) => {
    onEventClick(event);
  };

  return (
<<<<<<< HEAD
=======
    <div className="staff-scheduler">
      <CalendarErrorBoundary>
        <BigSchedulerCalendar
          staffMembers={staffMembers}
          events={processedEvents}
          view={mapViewType(view)}
          onEventClick={onEventClick}
          onEventDrop={onEventDrop}
          onEventResize={onEventResize}
          onDateSelect={onDateSelect}
        />
      </CalendarErrorBoundary>
=======
  appointments,
  onDateSelect,
  onEventClick,
}) => {
  const [schedulerData, setSchedulerData] = useState(() => {
    const data = new SchedulerData(moment().format(DATE_FORMAT), ViewTypes.Week, false, false, {
      schedulerWidth: '100%',
      schedulerMaxHeight: 0,
      dayStartFrom: 8,
      dayStopTo: 20,
      eventItemHeight: 40,
      eventItemLineHeight: 40,
      nonWorkingTimeBodyBgColor: '#f0f0f0',
      minuteStep: 30,
    });
    
    // Convert staff members to resources
    const resources = staffMembers.map(staff => ({
      id: staff.id,
      name: getStaffMemberName(staff),
      color: staff.color || '#4f46e5'
    }));
    
    data.setResources(resources);
    return data;
  });

  useEffect(() => {
    // Convert appointments to events
    const events = appointments.map(appointment => ({
      id: appointment.id,
      start: moment(appointment.start).format('YYYY-MM-DD HH:mm:ss'),
      end: moment(appointment.end).format('YYYY-MM-DD HH:mm:ss'),
      resourceId: appointment.staffId || '',
      title: appointment.title || 'Appuntamento',
      bgColor: '#4f46e5'
    }));

    schedulerData.setEvents(events);
    setSchedulerData(schedulerData);
  }, [appointments, staffMembers]);

  const prevClick = () => {
    schedulerData.prev();
    setSchedulerData(schedulerData);
  };

  const nextClick = () => {
    schedulerData.next();
    setSchedulerData(schedulerData);
  };

  const onSelectDate = (date: string) => {
    schedulerData.setDate(date);
    setSchedulerData(schedulerData);
  };

  const onViewChange = (viewType: ViewTypes) => {
    schedulerData.setViewType(viewType, false, false);
    setSchedulerData(schedulerData);
  };

  const eventClicked = (schedulerData: SchedulerData, event: CalendarEvent) => {
    onEventClick(event);
  };

  return (
>>>>>>> 863cd2f (Update dependencies and fix package.json conflicts)
    <div className="scheduler-container">
      <Scheduler
        schedulerData={schedulerData}
        prevClick={prevClick}
        nextClick={nextClick}
        onSelectDate={onSelectDate}
        onViewChange={onViewChange}
        eventItemClick={eventClicked}
      />
<<<<<<< HEAD
=======
>>>>>>> 8542f29 (Update dependencies and fix vulnerabilities: - Update antd to latest version - Update vite to latest version - Update react-big-scheduler to latest version - Remove deprecated files and update calendar components)
>>>>>>> 863cd2f (Update dependencies and fix package.json conflicts)
    </div>
  );
};
