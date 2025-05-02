import { useState } from 'react';
import moment from 'moment';
import { useAppointments, AppointmentFilters } from '@/features/appointments/hooks/useAppointments';
import { StaffCalendar } from '@/features/appointments/components/StaffCalendar';
import { StaffMember } from '@/types/staff';
import { CalendarEvent, ViewTypes } from '@/features/appointments/types';

export const Appointments = () => {
  const { setFilters, appointments, filteredAppointments } = useAppointments();
  const [visibleStaff, setVisibleStaff] = useState<StaffMember[]>([]);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [currentDate, setCurrentDate] = useState(moment());

  const handleViewChange = (view: ViewTypes) => {
    setFilters((prev: AppointmentFilters) => ({ ...prev, view }));
  };

  const handleEventClick = (event: CalendarEvent) => {
    // Handle event click
  };

  const handleDateSelect = (start: string, end: string) => {
    // Handle date select
  };

  return (
    <div className="appointments">
      <StaffCalendar
        visibleStaff={visibleStaff}
        events={events}
        resources={[]}
        currentDate={currentDate}
        onEventClick={handleEventClick}
        onDateSelect={handleDateSelect}
        onViewChange={handleViewChange}
      />
    </div>
  );
};

export default Appointments;
