import React, { useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import resourceTimelinePlugin from '@fullcalendar/resource-timeline';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import { EventInput } from '@fullcalendar/core';
import { useAppointmentEvents } from '../hooks/useAppointmentEvents';
import { useStaffResources } from '../hooks/useStaffResources';
import { useAppointmentActions } from '../hooks/useAppointmentActions';
import { AppointmentCheckout } from './AppointmentCheckout';
import { CalendarEvent, CalendarView, CalendarConfig, CalendarFilter } from '../types/appointment';
import '../styles/fullcalendar.css';

interface StaffCalendarProps {
  businessId: string;
}

interface Resource {
  id: string;
  title: string;
}

export const StaffCalendar: React.FC<StaffCalendarProps> = ({ businessId }) => {
  const { events, isLoading: isLoadingEvents } = useAppointmentEvents(businessId);
  const { resources, isLoading: isLoadingResources } = useStaffResources(businessId);
  const { handleEventDrop, handleEventClick, handleDateClick } = useAppointmentActions(businessId);
  
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [currentView, setCurrentView] = useState<CalendarView>({
    type: 'resourceTimelineDay',
    title: 'Giorno',
    icon: 'calendar-day'
  });

  const calendarConfig: CalendarConfig = {
    businessHours: {
      daysOfWeek: [1, 2, 3, 4, 5],
      startTime: '08:00',
      endTime: '20:00'
    },
    slotDuration: '00:30:00',
    snapDuration: '00:15:00',
    minTime: '08:00:00',
    maxTime: '20:00:00',
    locale: 'it',
    firstDay: 1,
    views: {
      resourceTimelineDay: {
        slotDuration: '00:30:00',
        slotLabelFormat: {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false
        }
      },
      resourceTimelineWeek: {
        slotDuration: '00:30:00',
        slotLabelFormat: {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false
        }
      },
      dayGridMonth: {
        titleFormat: { year: 'numeric', month: 'long' }
      },
      timeGridWeek: {
        slotDuration: '00:30:00'
      },
      timeGridDay: {
        slotDuration: '00:30:00'
      }
    }
  };

  const handleEventClickWithCheckout = (info: any) => {
    const event = events.find(e => e.id === info.event.id);
    if (event) {
      setSelectedEvent(event);
      if (event.status === 'completed' && !event.payment) {
        setIsCheckoutOpen(true);
      } else {
        handleEventClick(info);
      }
    }
  };

  const handleCheckoutComplete = (paymentDetails: any) => {
    if (selectedEvent) {
      // Update event status and payment details
      const updatedEvent = {
        ...selectedEvent,
        status: 'paid' as const,
        payment: paymentDetails
      };
      // TODO: Implement API call to update appointment
      setIsCheckoutOpen(false);
      setSelectedEvent(null);
    }
  };

  const calendarEvents: EventInput[] = events.map(event => ({
    id: event.id,
    title: event.title,
    start: event.start,
    end: event.end,
    resourceId: event.staffId,
    extendedProps: {
      status: event.status,
      customerName: event.customerName,
      serviceName: event.serviceName,
      price: event.price,
      payment: event.payment
    },
    className: `status-${event.status.toLowerCase()}`
  }));

  const calendarResources: Resource[] = resources.map(resource => ({
    id: resource.id,
    title: resource.title
  }));

  if (isLoadingEvents || isLoadingResources) {
    return <div>Loading calendar...</div>;
  }

  return (
    <div className="calendar-container scheduler-container">
      <div className="calendar-toolbar">
        <div className="view-selector">
          <button
            className={`view-button ${currentView.type === 'resourceTimelineDay' ? 'active' : ''}`}
            onClick={() => setCurrentView({ type: 'resourceTimelineDay', title: 'Giorno', icon: 'calendar-day' })}
          >
            Giorno
          </button>
          <button
            className={`view-button ${currentView.type === 'resourceTimelineWeek' ? 'active' : ''}`}
            onClick={() => setCurrentView({ type: 'resourceTimelineWeek', title: 'Settimana', icon: 'calendar-week' })}
          >
            Settimana
          </button>
          <button
            className={`view-button ${currentView.type === 'dayGridMonth' ? 'active' : ''}`}
            onClick={() => setCurrentView({ type: 'dayGridMonth', title: 'Mese', icon: 'calendar-month' })}
          >
            Mese
          </button>
        </div>
      </div>
      
      <div className="calendar-content">
        <FullCalendar
          plugins={[resourceTimelinePlugin, interactionPlugin, dayGridPlugin, timeGridPlugin]}
          initialView={currentView.type}
          schedulerLicenseKey="GPL-My-Project-Is-Open-Source"
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: ''
          }}
          resources={resources}
          events={calendarEvents}
          editable={true}
          droppable={true}
          eventDrop={handleEventDrop}
          eventClick={handleEventClickWithCheckout}
          dateClick={handleDateClick}
          resourceAreaWidth="20%"
          slotMinTime={calendarConfig.minTime}
          slotMaxTime={calendarConfig.maxTime}
          businessHours={calendarConfig.businessHours}
          height="100%"
          resourceAreaHeaderContent="Staff"
          resourceOrder="title"
          resourceAreaColumns={[
            {
              field: 'title',
              headerContent: 'Staff'
            }
          ]}
          resourceLabelDidMount={({ el, resource }) => {
            el.style.backgroundColor = '#f3f4f6';
            el.style.padding = '0.5rem';
            el.style.fontWeight = '500';
          }}
          eventDidMount={({ el, event }) => {
            const status = event.extendedProps.status;
            el.style.backgroundColor = status === 'confirmed' ? '#10b981' : 
                                     status === 'pending' ? '#f59e0b' : 
                                     status === 'completed' ? '#3b82f6' :
                                     status === 'paid' ? '#8b5cf6' : '#ef4444';
            el.style.borderRadius = '0.25rem';
            el.style.border = 'none';
            el.style.padding = '0.25rem 0.5rem';
            el.style.fontSize = '0.875rem';
            el.style.cursor = 'pointer';
          }}
          eventContent={({ event }) => (
            <div>
              <div className="font-medium">{event.title}</div>
              <div className="text-xs">{event.extendedProps.customerName}</div>
              <div className="text-xs">{event.extendedProps.serviceName}</div>
              {event.extendedProps.price && (
                <div className="text-xs font-bold">€{event.extendedProps.price.toFixed(2)}</div>
              )}
            </div>
          )}
          locale={calendarConfig.locale}
          firstDay={calendarConfig.firstDay}
          slotDuration={calendarConfig.slotDuration}
          nowIndicator={true}
          scrollTime={calendarConfig.minTime}
          snapDuration={calendarConfig.snapDuration}
          slotLabelFormat={{
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
          }}
          resourceLabelContent="Staff"
          resourceGroupField="title"
          resourcesInitiallyExpanded={true}
          views={calendarConfig.views}
          resourceAreaHeaderDidMount={({ el }) => {
            el.style.backgroundColor = '#f3f4f6';
            el.style.padding = '0.5rem';
            el.style.fontWeight = '500';
            el.style.borderBottom = '1px solid #e5e7eb';
          }}
        />
      </div>

      {selectedEvent && (
        <AppointmentCheckout
          appointment={selectedEvent}
          isOpen={isCheckoutOpen}
          onClose={() => {
            setIsCheckoutOpen(false);
            setSelectedEvent(null);
          }}
          onComplete={handleCheckoutComplete}
        />
      )}
    </div>
  );
};
