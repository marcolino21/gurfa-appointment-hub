export * from './appointmentContext';

export interface BlockTimeFormData {
  staffId: string;
  startTime: string;
  endTime: string;
  blockType: 'today' | 'period';
  startDate?: Date;
  endDate?: Date;
  reason?: string;
}

export interface CalendarEvent {
  event_id: string | number;
  title: string;
  start: Date;
  end: Date;
  resource_id?: string | number;
  color?: string;
  description?: string;
  allDay?: boolean;
  draggable?: boolean;
  deletable?: boolean;
  resizable?: boolean;
}
