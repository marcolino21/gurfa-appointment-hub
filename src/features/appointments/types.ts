import { Event } from 'react-big-scheduler';

export interface StaffMember {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  color?: string;
  isActive?: boolean;
}

export interface CalendarEvent extends Event {
  status: 'confirmed' | 'pending' | 'cancelled';
  staffId: string;
  customerId: string;
  serviceId: string;
  notes?: string;
  clientName?: string;
  service?: string;
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