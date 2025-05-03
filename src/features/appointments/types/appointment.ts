export type AppointmentStatus = 'confirmed' | 'pending' | 'cancelled' | 'completed' | 'paid';

export interface PaymentDetails {
  amount: number;
  currency: string;
  paymentMethod: 'cash' | 'card' | 'stripe';
  stripePaymentIntentId?: string;
  paymentStatus: 'pending' | 'completed' | 'failed';
  paymentDate?: Date;
}

export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  staffId: string;
  status: AppointmentStatus;
  customerName: string;
  serviceName: string;
  customerId: string;
  serviceId: string;
  price: number;
  notes?: string;
  payment?: PaymentDetails;
  metadata?: Record<string, any>;
}

export interface StaffResource {
  id: string;
  title: string;
  email?: string;
  phone?: string;
  availability?: {
    daysOfWeek: number[];
    startTime: string;
    endTime: string;
  };
  permissions?: string[];
  group?: string;
}

export interface CalendarView {
  type: 'resourceTimelineDay' | 'resourceTimelineWeek' | 'dayGridMonth' | 'timeGridWeek' | 'timeGridDay';
  title: string;
  icon: string;
}

export interface CalendarConfig {
  businessHours: {
    daysOfWeek: number[];
    startTime: string;
    endTime: string;
  };
  slotDuration: string;
  snapDuration: string;
  minTime: string;
  maxTime: string;
  locale: string;
  firstDay: number;
  views: Record<string, any>;
}

export interface CalendarFilter {
  status?: AppointmentStatus[];
  staff?: string[];
  services?: string[];
  dateRange?: {
    start: Date;
    end: Date;
  };
  search?: string;
}

export interface CalendarExportOptions {
  format: 'pdf' | 'excel' | 'csv';
  dateRange: {
    start: Date;
    end: Date;
  };
  include: string[];
} 