
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
import { useToast } from '@/hooks/use-toast';

const Appointments: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const { toast } = useToast();
  
  const { setFilters, currentAppointment, appointments } = useAppointments();
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
  
  // Applica i filtri quando cambiano
  useEffect(() => {
    setFilters({
      search: searchTerm || null,
      status: statusFilter === 'all' ? null : statusFilter
    });
  }, [searchTerm, statusFilter, setFilters]);
  
  // Aggiorna gli staff visibili quando cambia il salone
  useEffect(() => {
    console.log("Appointments component - currentSalonId:", currentSalonId);
    
    if (currentSalonId) {
      refreshVisibleStaff();
    }
  }, [refreshVisibleStaff, currentSalonId]);
  
  // Log per debug
  useEffect(() => {
    console.log("Appointments component - visibleStaff:", visibleStaff);
    console.log("Appointments component - events:", events);
    console.log("Appointments component - appointments:", appointments);
    
    if (visibleStaff.length === 0 && currentSalonId) {
      toast({
        title: "Nessuno staff visibile",
        description: "Vai alla pagina Staff e seleziona 'Visibile in agenda' per i membri che vuoi visualizzare.",
        variant: "default"
      });
    }
  }, [visibleStaff, currentSalonId, toast, events, appointments]);
  
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
