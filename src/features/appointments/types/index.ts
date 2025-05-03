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
