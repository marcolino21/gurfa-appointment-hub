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

type CalendarView = 'day' | 'week' | 'month';
type AppointmentStatus = 'all' | 'pending' | 'confirmed' | 'completed' | 'cancelled';

interface AppointmentFiltersProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  statusFilter: string;
  setStatusFilter: (value: string) => void;
}

const Appointments: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const { toast } = useToast();
  
  const { setFilters, currentAppointment, appointments, filteredAppointments } = useAppointments();
  const { currentSalonId } = useAuth();
  const { visibleStaff, refreshVisibleStaff, isLoading: staffLoading } = useStaffAppointments();
  const events = useAppointmentEvents();
  
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
    try {
      console.log("Applying filters:", {
        search: searchTerm || null,
        status: statusFilter === 'all' ? null : statusFilter
      });
      
      setFilters({
        search: searchTerm || null,
        status: statusFilter === 'all' ? null : statusFilter
      });
    } catch (error) {
      console.error("Error applying filters:", error);
      toast({
        title: "Errore nell'applicazione dei filtri",
        description: "Si è verificato un errore durante l'applicazione dei filtri. Riprova più tardi.",
        variant: "destructive"
      });
    }
  }, [searchTerm, statusFilter, setFilters, toast]);
  
  // Caricamento dello staff visibile quando cambia il salone
  useEffect(() => {
    const loadVisibleStaff = async () => {
      try {
        console.log("Appointments component - currentSalonId:", currentSalonId);
        
        if (currentSalonId) {
          await refreshVisibleStaff();
        }
      } catch (error) {
        console.error("Error loading visible staff:", error);
        toast({
          title: "Errore nel caricamento dello staff",
          description: "Si è verificato un errore durante il caricamento dello staff visibile. Riprova più tardi.",
          variant: "destructive"
        });
      }
    };

    loadVisibleStaff();
  }, [refreshVisibleStaff, currentSalonId, toast]);
  
  // All'apertura della pagina, forza il caricamento dei dati necessari
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        if (currentSalonId) {
          await refreshVisibleStaff(); 
        }
      } catch (error) {
        console.error("Error loading initial data:", error);
        toast({
          title: "Errore nel caricamento dei dati iniziali",
          description: "Si è verificato un errore durante il caricamento dei dati iniziali. Riprova più tardi.",
          variant: "destructive"
        });
      }
    };

    loadInitialData();
  }, [currentSalonId, refreshVisibleStaff, toast]);
  
  // Debug e validazione delle visualizzazioni
  useEffect(() => {
    try {
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
    } catch (error) {
      console.error("Error in debug validation:", error);
    }
  }, [visibleStaff, currentSalonId, toast, events, appointments, filteredAppointments, searchTerm, statusFilter, staffLoading]);
  
  const handleAddAppointmentWithError = async () => {
    try {
      await handleAddAppointment();
    } catch (error) {
      console.error("Error adding appointment:", error);
      toast({
        title: "Errore nell'aggiunta dell'appuntamento",
        description: "Si è verificato un errore durante l'aggiunta dell'appuntamento. Riprova più tardi.",
        variant: "destructive"
      });
    }
  };
  
  return (
    <div className="space-y-4">
      <AppointmentHeader handleAddAppointment={handleAddAppointmentWithError} />
      
      <AppointmentFilters 
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
      />
      
      <div className="min-h-[600px]">
        <AppointmentCalendarView 
          visibleStaff={visibleStaff}
          events={events}
          handleDateSelect={handleDateSelect}
          handleEventClick={handleEventClick}
          handleEventDrop={handleEventDrop}
          handleEventResize={handleEventResize}
          onViewChange={setCalendarView}
        />
      </div>
      
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
