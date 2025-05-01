
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { StaffMember } from '@/types';
import { CalendarEvent } from '@/features/appointments/types';
import { AppointmentCalendarView } from '@/features/appointments/components';
import { useStaffAppointments } from '@/features/appointments/hooks/useStaffAppointments';
import { useAppointmentEvents } from '@/features/appointments/hooks/useAppointmentEvents';
import { useAppointmentHandlers } from '@/features/appointments/hooks/useAppointmentHandlers';

const Calendar = () => {
  const [calendarView, setCalendarView] = useState<'day' | 'week' | 'month'>('week');
  const { toast } = useToast();
  const { currentSalonId } = useAuth();
  
  // Get visible staff members and events
  const { visibleStaff, refreshVisibleStaff, isLoading: staffLoading } = useStaffAppointments();
  const events = useAppointmentEvents();
  
  // Get appointment handlers
  const {
    handleDateSelect,
    handleEventClick,
    handleEventDrop,
    handleEventResize
  } = useAppointmentHandlers(visibleStaff);
  
  // Load staff members on component mount
  useEffect(() => {
    const loadVisibleStaff = async () => {
      try {
        if (currentSalonId) {
          await refreshVisibleStaff();
        }
      } catch (error) {
        console.error("Error loading visible staff:", error);
        toast({
          title: "Errore nel caricamento dello staff",
          description: "Si è verificato un errore durante il caricamento dello staff visibile.",
          variant: "destructive"
        });
      }
    };

    loadVisibleStaff();
  }, [currentSalonId, refreshVisibleStaff, toast]);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold tracking-tight">Calendario</h1>
      
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
    </div>
  );
};

export default Calendar;
