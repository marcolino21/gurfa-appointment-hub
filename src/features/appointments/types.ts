import { Event } from 'react-big-scheduler';
import { StaffResource } from './types';

export interface StaffMember {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  color?: string;
  isActive?: boolean;
}

export interface CalendarEvent {
  id: string;
  title: string;
  start: string; // Format: 'YYYY-MM-DD HH:mm'
  end: string; // Format: 'YYYY-MM-DD HH:mm'
  resourceId: string;
  bgColor?: string;
  status: 'confirmed' | 'pending' | 'cancelled';
  staffId: string;
  customerId: string;
  serviceId: string;
  notes?: string;
  clientName?: string;
  service?: string;
  color?: string;
  isDraggable?: boolean;
  isResizable?: boolean;
  isAllDay?: boolean;
  recurrenceRule?: string;
  recurrenceId?: string;
  recurrenceException?: string;
}

export interface StaffResource {
  id: string;
  name: string;
  workingHours?: {
    start: string;
    end: string;
  };
  daysOff?: string[];
  color?: string;
} 