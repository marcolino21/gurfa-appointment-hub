import React from 'react';

export interface StaffMember {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  color?: string;
  isActive?: boolean;
}

export interface CalendarEvent {
  event_id: string;
  title: string;
  start: Date | string;
  end: Date | string;
  resourceId?: string;
  staffId?: string;
  customerId?: string;
  serviceId?: string;
  status?: string;
  color?: string;
}

export interface StaffResource {
  id: string;
  name: string;
  color?: string;
  workingHours?: {
    start: string;
    end: string;
  };
  daysOff?: string[];
  groupOnly?: boolean;
  groupId?: string;
} 