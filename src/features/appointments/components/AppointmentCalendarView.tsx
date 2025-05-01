<<<<<<< HEAD

import React, { useState } from 'react';
=======
import React, { useEffect, useState } from 'react';
>>>>>>> 8542f29 (Update dependencies and fix vulnerabilities: - Update antd to latest version - Update vite to latest version - Update react-big-scheduler to latest version - Remove deprecated files and update calendar components)
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { StaffMember, getStaffMemberName } from '@/types';
import { StaffCalendar } from '@/features/appointments/components/StaffCalendar';
import CalendarErrorBoundary from '@/features/appointments/components/CalendarErrorBoundary';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
<<<<<<< HEAD
import CalendarErrorBoundary from './CalendarErrorBoundary';
import '../styles/scheduler.css';

interface AppointmentCalendarViewProps {
  visibleStaff: StaffMember[];
  events: any[];
  handleDateSelect: (selectInfo: any) => void;
  handleEventClick: (clickInfo: any) => void;
  handleEventDrop: (dropInfo: any) => void;
  onViewChange: (view: 'timeGridDay' | 'timeGridWeek' | 'timeGridMonth') => void;
  handleEventResize?: (resizeInfo: any) => void;
=======
import { CalendarEvent } from '../types';

interface EventInfo {
  event: CalendarEvent;
  jsEvent: MouseEvent;
  view: any;
}

interface DateSelectInfo {
  start: Date;
  end: Date;
  allDay: boolean;
  jsEvent: MouseEvent;
  view: any;
}

interface EventDropInfo {
  event: CalendarEvent;
  oldResource: string;
  newResource: string;
  revert: () => void;
}

interface EventResizeInfo {
  event: CalendarEvent;
  startDelta: number;
  endDelta: number;
  revert: () => void;
}

interface AppointmentCalendarViewProps {
  visibleStaff: StaffMember[];
  events: CalendarEvent[];
  handleDateSelect: (selectInfo: DateSelectInfo) => void;
  handleEventClick: (clickInfo: EventInfo) => void;
  handleEventDrop: (dropInfo: EventDropInfo) => void;
  onViewChange: (view: 'day' | 'week' | 'month') => void;
  handleEventResize?: (resizeInfo: EventResizeInfo) => void;
>>>>>>> 8542f29 (Update dependencies and fix vulnerabilities: - Update antd to latest version - Update vite to latest version - Update react-big-scheduler to latest version - Remove deprecated files and update calendar components)
}

const AppointmentCalendarView: React.FC<AppointmentCalendarViewProps> = ({
  visibleStaff,
  events,
  handleDateSelect,
  handleEventClick,
  handleEventDrop,
  onViewChange,
  handleEventResize
}) => {
<<<<<<< HEAD
  const [activeTab, setActiveTab] = useState('week'); // Set week as the default view

=======
  const [activeTab, setActiveTab] = useState('week');

  // Transform staff members to include name property
  const transformedStaff = visibleStaff.map(staff => ({
    ...staff,
    name: getStaffMemberName(staff)
  }));

  // Process events to add staff names for the month view
  const processedEvents = events.map(event => {
    if (!event.extendedProps) {
      event.extendedProps = {};
    }

    // Find associated staff member
    const staffMember = visibleStaff.find(staff => staff.id === event.resourceId);
    if (staffMember) {
      event.extendedProps.staffName = getStaffMemberName(staffMember);
      event.classNames = [...(event.classNames || []), 'has-staff-name'];
    }
    
    return event;
  });
  
>>>>>>> 8542f29 (Update dependencies and fix vulnerabilities: - Update antd to latest version - Update vite to latest version - Update react-big-scheduler to latest version - Remove deprecated files and update calendar components)
  // Handle tab changes and notify parent component
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    
<<<<<<< HEAD
    if (value === 'day') onViewChange('timeGridDay');
    else if (value === 'week') onViewChange('timeGridWeek');
    else onViewChange('timeGridMonth'); // This will be handled by the wrapper function in Appointments.tsx
  };

  // Ensure all events have the necessary properties
  const processedEvents = events.map(event => {
    // Make sure all events have a resourceId (which is staffId)
    if (!event.resourceId && event.extendedProps && event.extendedProps.staffId) {
      event.resourceId = event.extendedProps.staffId;
=======
    if (value === 'day') onViewChange('day');
    else if (value === 'week') onViewChange('week');
    else onViewChange('month');
  };

  // Debug the visible staff to check if they're correctly passed
  useEffect(() => {
    console.log("Visible staff in AppointmentCalendarView:", visibleStaff);
  }, [visibleStaff]);

  // Funzione per gestire il ridimensionamento degli eventi
  const handleAppointmentResize = (resizeInfo: EventResizeInfo) => {
    if (handleEventResize) {
      handleEventResize(resizeInfo);
    } else {
      // Fallback: usa handleEventDrop come ultima risorsa
      handleEventDrop({
        event: resizeInfo.event,
        oldResource: resizeInfo.event.staffId,
        newResource: resizeInfo.event.staffId,
        revert: resizeInfo.revert
      });
>>>>>>> 8542f29 (Update dependencies and fix vulnerabilities: - Update antd to latest version - Update vite to latest version - Update react-big-scheduler to latest version - Remove deprecated files and update calendar components)
    }
    return event;
  });

  return (
    <Card className="shadow-md rounded-xl overflow-hidden">
      <CardContent className="p-0">
        <Tabs 
          value={activeTab} 
          onValueChange={handleTabChange}
          className="w-full"
        >
          <div className="flex justify-between items-center p-4 border-b bg-gradient-to-r from-[#4A00E0] to-[#8E2DE2] text-white">
            <TabsList className="bg-white/10 appointment-tabs">
              <TabsTrigger value="day" className="appointment-tab font-medium">Giorno</TabsTrigger>
              <TabsTrigger value="week" className="appointment-tab font-medium">Settimana</TabsTrigger>
              <TabsTrigger value="month" className="appointment-tab font-medium">Mese</TabsTrigger>
            </TabsList>
          </div>
          
          {visibleStaff.length === 0 ? (
            <Alert className="m-6 border-yellow-300 bg-yellow-50">
              <AlertCircle className="h-5 w-5 text-yellow-600" />
              <AlertTitle className="text-yellow-800">Nessun operatore visibile</AlertTitle>
              <AlertDescription className="text-yellow-700">
                Vai alla pagina Staff e seleziona "Visibile in agenda" per i membri 
                che vuoi visualizzare nel calendario.
              </AlertDescription>
            </Alert>
          ) : (
            <>
              <TabsContent value="day" className="m-0">
                <CalendarErrorBoundary>
                  <StaffCalendar
<<<<<<< HEAD
                    staffMembers={visibleStaff}
                    events={processedEvents}
                    view="timeGridDay"
                    onEventClick={handleEventClick}
                    onEventDrop={handleEventDrop}
                    onEventResize={handleEventResize}
=======
                    staffMembers={transformedStaff}
                    events={processedEvents}
                    view="day"
                    onEventClick={handleEventClick}
                    onEventDrop={handleEventDrop}
>>>>>>> 8542f29 (Update dependencies and fix vulnerabilities: - Update antd to latest version - Update vite to latest version - Update react-big-scheduler to latest version - Remove deprecated files and update calendar components)
                    onDateSelect={handleDateSelect}
                  />
                </CalendarErrorBoundary>
              </TabsContent>
              
              <TabsContent value="week" className="m-0">
                <CalendarErrorBoundary>
                  <StaffCalendar
<<<<<<< HEAD
                    staffMembers={visibleStaff}
                    events={processedEvents}
                    view="timeGridWeek"
                    onEventClick={handleEventClick}
                    onEventDrop={handleEventDrop}
                    onEventResize={handleEventResize}
=======
                    staffMembers={transformedStaff}
                    events={processedEvents}
                    view="week"
                    onEventClick={handleEventClick}
                    onEventDrop={handleEventDrop}
>>>>>>> 8542f29 (Update dependencies and fix vulnerabilities: - Update antd to latest version - Update vite to latest version - Update react-big-scheduler to latest version - Remove deprecated files and update calendar components)
                    onDateSelect={handleDateSelect}
                  />
                </CalendarErrorBoundary>
              </TabsContent>
              
              <TabsContent value="month" className="m-0">
                <CalendarErrorBoundary>
                  <StaffCalendar
<<<<<<< HEAD
                    staffMembers={visibleStaff}
                    events={processedEvents}
                    view="dayGridMonth"
                    onEventClick={handleEventClick}
                    onEventDrop={handleEventDrop}
                    onEventResize={handleEventResize}
=======
                    staffMembers={transformedStaff}
                    events={processedEvents}
                    view="month"
                    onEventClick={handleEventClick}
                    onEventDrop={handleEventDrop}
>>>>>>> 8542f29 (Update dependencies and fix vulnerabilities: - Update antd to latest version - Update vite to latest version - Update react-big-scheduler to latest version - Remove deprecated files and update calendar components)
                    onDateSelect={handleDateSelect}
                  />
                </CalendarErrorBoundary>
              </TabsContent>
            </>
          )}
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default AppointmentCalendarView;
