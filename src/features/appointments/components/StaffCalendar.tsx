import React, { useState, useEffect } from 'react';
import Scheduler, { SchedulerData, ViewTypes, DATE_FORMAT } from 'react-big-scheduler';
import 'react-big-scheduler/lib/css/style.css';
import '../styles/scheduler.css';
import moment from 'moment';
import { StaffMember, getStaffMemberName } from '../../../types/staff';
import { Appointment } from '../../../types/appointments';

interface StaffCalendarProps {
  staffMembers: StaffMember[];
  appointments: Appointment[];
  onDateSelect: (info: DateSelectInfo) => void;
  onEventClick: (event: CalendarEvent) => void;
}

interface DateSelectInfo {
  start: Date;
  end: Date;
  allDay: boolean;
  jsEvent: MouseEvent;
  view: {
    type: ViewTypes;
    startDate: moment.Moment;
    endDate: moment.Moment;
    baseViewType?: ViewTypes;
  };
}

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
  const [schedulerData, setSchedulerData] = useState<SchedulerData>(() => {
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
      resourceId: typeof appointment.staffId === 'string' ? appointment.staffId : appointment.staffId?.value || '',
      title: appointment.title || 'Appuntamento',
      bgColor: '#4f46e5'
    }));

    const newSchedulerData = schedulerData.clone();
    newSchedulerData.setEvents(events);
    setSchedulerData(newSchedulerData);
  }, [appointments, schedulerData]);

  useEffect(() => {
    // Update resources when staff members change
    const resources = staffMembers.map(staff => ({
      id: staff.id,
      name: getStaffMemberName(staff),
      color: staff.color || '#4f46e5'
    }));
    
    const newSchedulerData = schedulerData.clone();
    newSchedulerData.setResources(resources);
    setSchedulerData(newSchedulerData);
  }, [staffMembers, schedulerData]);

  const prevClick = (schedulerData: SchedulerData) => {
    const newSchedulerData = schedulerData.clone();
    newSchedulerData.prev();
    setSchedulerData(newSchedulerData);
  };

  const nextClick = (schedulerData: SchedulerData) => {
    const newSchedulerData = schedulerData.clone();
    newSchedulerData.next();
    setSchedulerData(newSchedulerData);
  };

  const onSelectDate = (schedulerData: SchedulerData, date: string) => {
    const newSchedulerData = schedulerData.clone();
    newSchedulerData.setDate(date);
    setSchedulerData(newSchedulerData);
  };

  const onViewChange = (schedulerData: SchedulerData, view: ViewTypes) => {
    const newSchedulerData = schedulerData.clone();
    newSchedulerData.setViewType(view, false, false);
    setSchedulerData(newSchedulerData);
  };

  const eventClicked = (schedulerData: SchedulerData, event: CalendarEvent) => {
    onEventClick(event);
  };

  return (
    <div className="scheduler-container">
      <Scheduler
        schedulerData={schedulerData}
        prevClick={prevClick}
        nextClick={nextClick}
        onSelectDate={onSelectDate}
        onViewChange={onViewChange}
        eventItemClick={eventClicked}
      />
    </div>
  );
};
