import { useState, useCallback } from 'react';
import { Calendar as BigCalendar, dateFnsLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import it from 'date-fns/locale/it';
import { useAppointments } from '@/features/appointments/hooks/useAppointments';
import { AppointmentModal } from './AppointmentModal';
import { CalendarHeader } from './CalendarHeader';
import { Box, useDisclosure } from '@chakra-ui/react';

const locales = {
  'it': it
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

export const Calendar = () => {
  const { appointments, loading, error, createAppointment, updateAppointment } = useAppointments();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);

  const handleSelectEvent = useCallback((event) => {
    setSelectedAppointment(event);
    onOpen();
  }, [onOpen]);

  const handleSelectSlot = useCallback((slotInfo) => {
    setSelectedSlot(slotInfo);
    setSelectedAppointment(null);
    onOpen();
  }, [onOpen]);

  const handleEventDrop = useCallback(({ event, start, end }) => {
    updateAppointment(event.id, {
      start: new Date(start),
      end: new Date(end)
    });
  }, [updateAppointment]);

  const handleEventResize = useCallback(({ event, start, end }) => {
    updateAppointment(event.id, {
      start: new Date(start),
      end: new Date(end)
    });
  }, [updateAppointment]);

  const handleSaveAppointment = async (appointmentData) => {
    if (selectedAppointment) {
      await updateAppointment(selectedAppointment.id, appointmentData);
    } else {
      await createAppointment({
        ...appointmentData,
        start: selectedSlot.start,
        end: selectedSlot.end
      });
    }
    onClose();
  };

  if (loading) return <Box>Caricamento...</Box>;
  if (error) return <Box color="red.500">Errore: {error}</Box>;

  return (
    <Box p={4}>
      <CalendarHeader />
      <Box height="80vh" mt={4}>
        <BigCalendar
          localizer={localizer}
          events={appointments}
          startAccessor="start"
          endAccessor="end"
          style={{ height: '100%' }}
          onSelectEvent={handleSelectEvent}
          onSelectSlot={handleSelectSlot}
          onEventDrop={handleEventDrop}
          onEventResize={handleEventResize}
          selectable
          resizable
          defaultView="week"
          views={['day', 'week', 'month']}
          messages={{
            next: 'Prossimo',
            previous: 'Precedente',
            today: 'Oggi',
            month: 'Mese',
            week: 'Settimana',
            day: 'Giorno',
            agenda: 'Agenda',
            date: 'Data',
            time: 'Ora',
            event: 'Appuntamento',
          }}
        />
      </Box>
      <AppointmentModal
        isOpen={isOpen}
        onClose={onClose}
        appointment={selectedAppointment}
        onSave={handleSaveAppointment}
        defaultStart={selectedSlot?.start}
        defaultEnd={selectedSlot?.end}
      />
    </Box>
  );
}; 