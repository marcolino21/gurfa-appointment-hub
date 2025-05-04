
import React, { useState, useRef, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import itLocale from '@fullcalendar/core/locales/it';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAppointments } from '@/contexts/AppointmentContext';
import { useAuth } from '@/contexts/AuthContext';
import AppointmentDialog from '@/components/AppointmentDialog';
import { CalendarPlus, Search, Filter } from 'lucide-react';
import { Appointment } from '@/types';

const Appointments: React.FC = () => {
  const calendarRef = useRef<any>(null);
  const [isAppointmentDialogOpen, setIsAppointmentDialogOpen] = useState(false);
  const [calendarView, setCalendarView] = useState<'timeGridWeek' | 'timeGridDay' | 'dayGridMonth'>('timeGridWeek');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  const { 
    filteredAppointments, 
    currentAppointment,
    setCurrentAppointment, 
    setFilters,
    loading
  } = useAppointments();
  
  const { currentSalonId } = useAuth();
  
  useEffect(() => {
    // Applica i filtri quando cambiano i valori di ricerca o stato
    setFilters({
      search: searchTerm,
      status: statusFilter === 'all' ? null : statusFilter
    });
  }, [searchTerm, statusFilter, setFilters]);
  
  const handleDateSelect = (selectInfo: any) => {
    if (currentSalonId) {
      const newAppointment: Partial<Appointment> = {
        title: '',
        start: selectInfo.startStr,
        end: selectInfo.endStr,
        clientName: '',
        salonId: currentSalonId,
        status: 'pending'
      };
      
      setCurrentAppointment(newAppointment as Appointment);
      setIsAppointmentDialogOpen(true);
    }
  };
  
  const handleEventClick = (clickInfo: any) => {
    const appointment = filteredAppointments.find(app => app.id === clickInfo.event.id);
    if (appointment) {
      setCurrentAppointment(appointment);
      setIsAppointmentDialogOpen(true);
    }
  };
  
  const handleEventDrop = (dropInfo: any) => {
    const appointment = filteredAppointments.find(app => app.id === dropInfo.event.id);
    if (appointment) {
      const updatedAppointment = {
        ...appointment,
        start: dropInfo.event.startStr,
        end: dropInfo.event.endStr
      };
      setCurrentAppointment(updatedAppointment);
      setIsAppointmentDialogOpen(true);
    }
  };
  
  const handleAddAppointment = () => {
    if (!currentSalonId) return;
    
    const calendarApi = calendarRef.current?.getApi();
    let start = new Date();
    let end = new Date(start.getTime() + 60 * 60 * 1000); // +1 ora
    
    if (calendarApi) {
      // Ottieni la data attualmente visualizzata nel calendario
      const currentDate = calendarApi.getDate();
      
      // Imposta l'orario di inizio alle 9:00 della data corrente del calendario
      start = new Date(currentDate);
      start.setHours(9, 0, 0, 0);
      
      // Imposta l'orario di fine alle 10:00 della stessa data
      end = new Date(start);
      end.setHours(10, 0, 0, 0);
    }
    
    const newAppointment: Partial<Appointment> = {
      title: '',
      start: start.toISOString(),
      end: end.toISOString(),
      clientName: '',
      salonId: currentSalonId,
      status: 'pending'
    };
    
    setCurrentAppointment(newAppointment as Appointment);
    setIsAppointmentDialogOpen(true);
  };
  
  const getEventColor = (status: string) => {
    switch (status) {
      case 'confirmed': return '#2563eb'; // blue
      case 'completed': return '#16a34a'; // green
      case 'pending': return '#ea580c';   // orange
      case 'cancelled': return '#dc2626'; // red
      default: return '#2563eb';          // default blue
    }
  };
  
  // Prepara gli eventi per il calendario
  const events = filteredAppointments.map(appointment => ({
    id: appointment.id,
    title: `${appointment.clientName} - ${appointment.service || ''}`,
    start: appointment.start,
    end: appointment.end,
    backgroundColor: getEventColor(appointment.status),
    borderColor: getEventColor(appointment.status),
    extendedProps: {
      status: appointment.status
    }
  }));
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Appuntamenti</h1>
          <p className="text-muted-foreground">
            Gestisci tutti i tuoi appuntamenti
          </p>
        </div>
        
        <Button onClick={handleAddAppointment}>
          <CalendarPlus className="mr-2 h-4 w-4" /> Nuovo Appuntamento
        </Button>
      </div>
      
      <div className="flex flex-col md:flex-row gap-4 md:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Cerca per cliente, servizio..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-gray-500" />
          <span className="text-sm text-gray-500">Stato:</span>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Tutti gli stati" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tutti gli stati</SelectItem>
              <SelectItem value="pending">In attesa</SelectItem>
              <SelectItem value="confirmed">Confermati</SelectItem>
              <SelectItem value="completed">Completati</SelectItem>
              <SelectItem value="cancelled">Cancellati</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <Card>
        <CardContent className="p-0 sm:p-6">
          <Tabs 
            defaultValue="week" 
            className="w-full"
            onValueChange={(value) => {
              if (value === 'day') setCalendarView('timeGridDay');
              else if (value === 'week') setCalendarView('timeGridWeek');
              else setCalendarView('dayGridMonth');
            }}
          >
            <div className="flex justify-between items-center p-4 border-b">
              <TabsList>
                <TabsTrigger value="day">Giorno</TabsTrigger>
                <TabsTrigger value="week">Settimana</TabsTrigger>
                <TabsTrigger value="month">Mese</TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="day" className="m-0">
              <div className="h-[calc(100vh-320px)]">
                <FullCalendar
                  ref={calendarRef}
                  plugins={[timeGridPlugin, dayGridPlugin, interactionPlugin]}
                  initialView="timeGridDay"
                  headerToolbar={{
                    left: 'prev,next today',
                    center: 'title',
                    right: ''
                  }}
                  locale={itLocale}
                  events={events}
                  slotMinTime="08:00:00"
                  slotMaxTime="20:00:00"
                  allDaySlot={false}
                  selectMirror={true}
                  dayMaxEvents={true}
                  weekends={true}
                  selectable={true}
                  select={handleDateSelect}
                  eventClick={handleEventClick}
                  editable={true}
                  droppable={true}
                  eventDrop={handleEventDrop}
                />
              </div>
            </TabsContent>
            <TabsContent value="week" className="m-0">
              <div className="h-[calc(100vh-320px)]">
                <FullCalendar
                  ref={calendarRef}
                  plugins={[timeGridPlugin, dayGridPlugin, interactionPlugin]}
                  initialView="timeGridWeek"
                  headerToolbar={{
                    left: 'prev,next today',
                    center: 'title',
                    right: ''
                  }}
                  locale={itLocale}
                  events={events}
                  slotMinTime="08:00:00"
                  slotMaxTime="20:00:00"
                  allDaySlot={false}
                  selectMirror={true}
                  dayMaxEvents={true}
                  weekends={true}
                  selectable={true}
                  select={handleDateSelect}
                  eventClick={handleEventClick}
                  editable={true}
                  droppable={true}
                  eventDrop={handleEventDrop}
                />
              </div>
            </TabsContent>
            <TabsContent value="month" className="m-0">
              <div className="h-[calc(100vh-320px)]">
                <FullCalendar
                  ref={calendarRef}
                  plugins={[dayGridPlugin, interactionPlugin]}
                  initialView="dayGridMonth"
                  headerToolbar={{
                    left: 'prev,next today',
                    center: 'title',
                    right: ''
                  }}
                  locale={itLocale}
                  events={events}
                  selectMirror={true}
                  dayMaxEvents={true}
                  weekends={true}
                  selectable={true}
                  select={handleDateSelect}
                  eventClick={handleEventClick}
                />
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
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
