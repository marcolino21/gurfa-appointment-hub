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
  id: string;
  title: string;
  start: string;
  end: string;
  resourceId: string;
  bgColor?: string;
  status?: 'confirmed' | 'pending' | 'cancelled';
  staffId?: string;
  customerId?: string;
  serviceId?: string;
  notes?: string;
  clientName?: string;
  service?: string;
  color?: string;
} 