
import React from 'react';
import Calendar from '@/components/calendar/Calendar';
import CalendarHeader from '@/components/calendar/CalendarHeader';
import AppointmentModal from '@/components/calendar/AppointmentModal';
import { useAppointmentStore } from '@/store/appointmentStore';

const CalendarPage = () => {
  const { openModal } = useAppointmentStore();

  return (
    <div className="space-y-4 p-4">
      <h1 className="text-2xl font-bold tracking-tight">Agenda</h1>
      <CalendarHeader onCreateAppointment={() => openModal()} />
      <Calendar />
      <AppointmentModal />
    </div>
  );
};

export default CalendarPage;
