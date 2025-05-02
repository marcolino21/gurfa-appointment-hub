import { Moment } from 'moment';
import Scheduler, { SchedulerData, ViewTypes as SchedulerViewTypes, View, Event } from 'react-big-scheduler';
import React from 'react';

export interface StaffMember {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  color?: string;
  isActive?: boolean;
}

export type ViewTypes = SchedulerViewTypes;

export interface CalendarEvent extends Event {
  id: number;
  title: string;
  start: string;
  end: string;
  resourceId: string;
  bgColor?: string;
  status?: string;
  staffId: string;
  customerId: string;
  serviceId: string;
  color?: string;
}

export interface StaffResource {
  id: string;
  name: string;
  workingHours?: {
    start: string;
    end: string;
  };
  daysOff?: string[];
  groupOnly?: boolean;
  groupId?: string;
  color?: string;
}

export interface AppointmentEvent {
  id: string;
  title: string;
  start: string;
  end: string;
  resourceId?: string;
  color?: string;
}

export type EventItemTemplateResolver = (
  schedulerData: SchedulerData,
  event: CalendarEvent,
  bgColor: string,
  isStart: boolean,
  isEnd: boolean,
  mustAddCssClass: string,
  mustBeHeight: number,
  agendaMaxEventWidth: number
) => React.ReactNode;

export type EventItemPopoverTemplateResolver = (
  schedulerData: SchedulerData,
  eventItem: CalendarEvent,
  title: string,
  start: Moment,
  end: Moment,
  statusColor: string
) => React.ReactNode;

export interface SchedulerProps {
  schedulerData: SchedulerData;
  prevClick: (schedulerData: SchedulerData) => void;
  nextClick: (schedulerData: SchedulerData) => void;
  onSelectDate: (schedulerData: SchedulerData, date: string) => void;
  onViewChange: (schedulerData: SchedulerData, view: View) => void;
  eventItemClick?: (schedulerData: SchedulerData, event: Event) => void;
  eventItemTemplateResolver?: (
    schedulerData: SchedulerData,
    event: Event,
    bgColor: string,
    isStart: boolean,
    isEnd: boolean,
    mustAddCssClass: string,
    mustBeHeight: number,
    agendaMaxEventWidth: number
  ) => React.ReactNode;
  eventItemPopoverTemplateResolver?: (
    schedulerData: SchedulerData,
    eventItem: Event,
    title: string,
    start: Moment,
    end: Moment,
    statusColor: string
  ) => React.ReactNode;
  viewEventClick?: (schedulerData: SchedulerData, event: Event) => void;
  viewEventText?: string;
  viewEvent2Text?: string;
} 