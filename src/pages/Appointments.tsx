import { useState } from 'react';
import { useAppointments } from '@/features/appointments/hooks/useAppointments';
import { CalendarView } from '@/features/calendar/components/CalendarView';

export const Appuntamenti = () => {
  return <CalendarView />;
};
