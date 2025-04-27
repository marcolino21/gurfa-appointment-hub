
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
  
  const { setFilters, currentAppointment, appointments, filteredAppointments } = useAppointments();
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
    handleEventResize,
    handleAddAppointment
  } = useAppointmentHandlers(visibleStaff);
  
  // Applicazione dei filtri quando cambiano
  useEffect(() => {
    console.log("Applying filters:", {
      search: searchTerm || null,
      status: statusFilter === 'all' ? null : statusFilter
    });
    
    setFilters({
      search: searchTerm || null,
      status: statusFilter === 'all' ? null : statusFilter
    });
  }, [searchTerm, statusFilter, setFilters]);
  
  // Caricamento dello staff visibile quando cambia il salone
  useEffect(() => {
    console.log("Appointments component - currentSalonId:", currentSalonId);
    
    if (currentSalonId) {
      refreshVisibleStaff();
    }
  }, [refreshVisibleStaff, currentSalonId]);
  
  // All'apertura della pagina, forza il caricamento dei dati necessari
  useEffect(() => {
    if (currentSalonId) {
      refreshVisibleStaff(); 
    }
  }, [currentSalonId, refreshVisibleStaff]);
  
  // Debug e validazione delle visualizzazioni
  useEffect(() => {
    console.log("Debug appuntamenti e staff:", {
      allAppointments: appointments.length,
      filteredAppointments: filteredAppointments.length,
      visibleStaff: visibleStaff.length,
      eventsGenerated: events.length,
      staffLoading
    });
    
    if (appointments.length > 0 && filteredAppointments.length === 0) {
      console.warn("ATTENZIONE: Ci sono appuntamenti ma nessuno è filtrato/visibile");
      console.log("Filtri attuali:", {
        search: searchTerm || null,
        status: statusFilter === 'all' ? null : statusFilter
      });
    }
    
    // Riepilogo appuntamenti per monitoraggio
    const appointmentsByStatus = appointments.reduce((acc, app) => {
      acc[app.status] = (acc[app.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    console.log("Appuntamenti per stato:", appointmentsByStatus);
    
    // Notifica se non ci sono staff visibili
    if (visibleStaff.length === 0 && currentSalonId && !staffLoading) {
      toast({
        title: "Nessuno staff visibile",
        description: "Vai alla pagina Staff e seleziona 'Visibile in agenda' per i membri che vuoi visualizzare.",
        variant: "default"
      });
    }
  }, [visibleStaff, currentSalonId, toast, events, appointments, filteredAppointments, searchTerm, statusFilter, staffLoading]);
  
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
        handleEventResize={handleEventResize}
        onViewChange={setCalendarView}
      />
      
      {isAppointmentDialogOpen && (
        <AppointmentDialog
          open={isAppointmentDialogOpen}
          onOpenChange={setIsAppointmentDialogOpen}
        />
      )}
    </div>
  );
};

export default Appointments;
