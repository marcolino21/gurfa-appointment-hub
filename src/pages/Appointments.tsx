
import React, { useState, useEffect } from 'react';
import { useAppointments } from '@/contexts/AppointmentContext';
import { useStaffAppointments } from '@/features/appointments/hooks/useStaffAppointments';
import { 
  AppointmentHeader, 
  AppointmentFilters,
  AppointmentCalendarView,
  AppointmentDialog
} from '@/features/appointments/components';
import { useAppointmentEvents } from '@/features/appointments/hooks/useAppointmentEvents';
import { useAppointmentHandlers } from '@/features/appointments/hooks/useAppointmentHandlers';
import { useAuth } from '@/contexts/AuthContext';

const Appointments: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  const { setFilters, currentAppointment } = useAppointments();
  const { currentSalonId } = useAuth();
  const { visibleStaff, refreshVisibleStaff } = useStaffAppointments();
  const { events } = useAppointmentEvents();
  
  const {
    isAppointmentDialogOpen,
    setIsAppointmentDialogOpen,
    calendarView,
    setCalendarView,
    handleDateSelect,
    handleEventClick,
    handleEventDrop,
    handleAddAppointment
  } = useAppointmentHandlers(visibleStaff);
  
  // Apply filters when search term or status filter changes
  useEffect(() => {
    setFilters({
      search: searchTerm || null,
      status: statusFilter === 'all' ? null : statusFilter
    });
  }, [searchTerm, statusFilter, setFilters]);
  
  // Refresh staff visibility when component mounts or currentSalonId changes
  useEffect(() => {
    console.log("Appointments component - currentSalonId:", currentSalonId);
    console.log("Appointments component - visibleStaff:", visibleStaff);
    refreshVisibleStaff();
  }, [refreshVisibleStaff, currentSalonId]);
  
  return (
    <div className="space-y-4">
      <AppointmentHeader handleAddAppointment={handleAddAppointment} />
      
      <AppointmentFilters 
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
      />
      
      <AppointmentCalendarView 
        visibleStaff={visibleStaff}
        events={events}
        handleDateSelect={handleDateSelect}
        handleEventClick={handleEventClick}
        handleEventDrop={handleEventDrop}
        onViewChange={setCalendarView}
      />
      
      {currentAppointment && (
        <AppointmentDialog
          open={isAppointmentDialogOpen}
          onOpenChange={setIsAppointmentDialogOpen}
        />
      )}
    </div>
  );
};

export default Appointments;
