import React from 'react';
import { Scheduler } from '@aldabil/react-scheduler';
import { StaffMember } from '@/types/staff';
import { CalendarEvent } from '../types';

interface StaffResource {
  id: string;
  name: string;
  color?: string;
}

interface StaffCalendarProps {
  events: CalendarEvent[];
  resources: StaffResource[];
  view?: 'day' | 'week' | 'month';
  onEventClick?: (event: CalendarEvent) => void;
  onEventDrop?: (...args: any[]) => Promise<void>;
  onEventResize?: (...args: any[]) => Promise<void>;
  onViewChange?: (view: 'day' | 'week' | 'month') => void;
}

export const StaffCalendar: React.FC<StaffCalendarProps> = ({
  events,
  resources,
  view = 'week',
  onEventClick,
  onEventDrop,
  onViewChange,
}) => {
  return (
    <Scheduler
      events={events}
      resources={resources.map(resource => ({
        resource_id: resource.id,
        title: resource.name,
        color: resource.color,
      }))}
      view={view}
      onEventClick={onEventClick}
      onEventDrop={onEventDrop}
      onViewChange={onViewChange}
      resourceFields={{
        idField: 'id',
        textField: 'name',
        colorField: 'color',
      }}
      draggable
      editable
      deletable={false}
      week={{
        weekStartOn: 1,
        startHour: 8,
        endHour: 20,
        step: 60,
        weekDays: [1, 2, 3, 4, 5, 6, 0],
      }}
      translations={{
        navigation: {
          week: 'Settimana',
          day: 'Giorno',
          month: 'Mese',
          today: 'Oggi',
          agenda: 'Agenda',
        },
        form: {
          addTitle: 'Aggiungi evento',
          editTitle: 'Modifica evento',
          confirm: 'Conferma',
          delete: 'Elimina',
          cancel: 'Annulla',
        },
        event: {
          title: 'Titolo',
          subtitle: 'Sottotitolo',
          start: 'Inizio',
          end: 'Fine',
          allDay: 'Tutto il giorno',
        },
        moreEvents: 'Altri eventi',
        noDataToDisplay: 'Nessun dato da mostrare',
        loading: 'Caricamento...',
      }}
    />
  );
};

export default StaffCalendar;
