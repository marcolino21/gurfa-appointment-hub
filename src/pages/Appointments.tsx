
import React, { useState, useEffect, useCallback } from 'react';
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
import { Skeleton } from '@/components/ui/skeleton';

const Appointments: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  
  const { setFilters, currentAppointment, appointments } = useAppointments();
  const { currentSalonId } = useAuth();
  const { visibleStaff, refreshVisibleStaff, isLoading: staffLoading } = useStaffAppointments();
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
  
  // Effetto per mostrare lo stato di caricamento
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Applica i filtri quando cambiano
  useEffect(() => {
    setFilters({
      search: searchTerm || null,
      status: statusFilter === 'all' ? null : statusFilter
    });
  }, [searchTerm, statusFilter, setFilters]);
  
  // Aggiorna gli staff visibili quando cambia il salone
  const handleRefreshStaff = useCallback(() => {
    console.log("Appointments component - Explicitly refreshing staff");
    refreshVisibleStaff();
  }, [refreshVisibleStaff]);
  
  useEffect(() => {
    console.log("Appointments component - currentSalonId:", currentSalonId);
    
    if (currentSalonId) {
      handleRefreshStaff();
    }
  }, [handleRefreshStaff, currentSalonId]);
  
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
  
  if (isLoading || staffLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-[calc(100vh-320px)] w-full" />
      </div>
    );
  }
  
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
