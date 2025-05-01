import React from 'react';
import { AppointmentCalendarView } from '@/features/appointments/components/AppointmentCalendarView';

const Calendar: React.FC = () => {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Calendario Appuntamenti</h1>
      <AppointmentCalendarView />
    </div>
  );
};

export default Calendar; 