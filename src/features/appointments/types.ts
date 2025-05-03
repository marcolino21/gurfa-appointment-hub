
export interface StaffMember {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  color?: string;
  isActive?: boolean;
  firstName?: string;
  lastName?: string;
  showInCalendar?: boolean;
}

export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  staffId: string;
  extendedProps?: {
    staffName?: string;
    [key: string]: any;
  };
  classNames?: string[];
  resourceId?: string;
  color?: string;
  backgroundColor?: string;
  description?: string;
  status?: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  event?: any; // For passing original event data
} 
