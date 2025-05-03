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
  event_id: string;
  title: string;
  start: Date;
  end: Date;
  resourceId?: string;
  color?: string;
  description?: string;
  allDay?: boolean;
  draggable?: boolean;
  deletable?: boolean;
  resizable?: boolean;
}

export interface ProcessedEvent extends Omit<CalendarEvent, 'resourceId'> {
  resource_id?: string;
} 