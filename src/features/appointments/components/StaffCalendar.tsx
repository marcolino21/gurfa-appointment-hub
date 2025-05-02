import React from 'react';
import { Scheduler } from '@aldabil/react-scheduler';

interface StaffCalendarProps {
  events: any[];
  resources: any[];
  view?: any;
  onEventClick?: (event: any) => void;
  onEventDrop?: (...args: any[]) => Promise<void>;
  onEventResize?: (...args: any[]) => Promise<void>;
  onViewChange?: (view: any) => void;
}

export const StaffCalendar: React.FC<StaffCalendarProps> = ({
  events,
  resources,
  view = 'week',
  onEventClick,
  onEventDrop,
  onViewChange,
}) => (
  <div style={{ width: '100%', height: '100%' }}>
    <Scheduler
      events={events}
      resources={resources}
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
  </div>
);

export default StaffCalendar;
