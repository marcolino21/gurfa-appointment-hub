import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { StaffMember, getStaffMemberName } from '@/types';
import { StaffCalendar } from '@/features/appointments/components/StaffCalendar';
import CalendarErrorBoundary from '@/features/appointments/components/CalendarErrorBoundary';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
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
  
  // Handle tab changes and notify parent component
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    
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
    }
  };

  return (
    <Card className="shadow-md">
      <CardContent className="p-0">
        <Tabs 
          value={activeTab} 
          onValueChange={handleTabChange}
          className="w-full"
        >
          <div className="flex justify-between items-center p-4 border-b">
            <TabsList className="bg-gray-100">
              <TabsTrigger value="day" className="font-medium">Giorno</TabsTrigger>
              <TabsTrigger value="week" className="font-medium">Settimana</TabsTrigger>
              <TabsTrigger value="month" className="font-medium">Mese</TabsTrigger>
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
                    staffMembers={transformedStaff}
                    events={processedEvents}
                    view="day"
                    onEventClick={handleEventClick}
                    onEventDrop={handleEventDrop}
                    onDateSelect={handleDateSelect}
                  />
                </CalendarErrorBoundary>
              </TabsContent>
              
              <TabsContent value="week" className="m-0">
                <CalendarErrorBoundary>
                  <StaffCalendar
                    staffMembers={transformedStaff}
                    events={processedEvents}
                    view="week"
                    onEventClick={handleEventClick}
                    onEventDrop={handleEventDrop}
                    onDateSelect={handleDateSelect}
                  />
                </CalendarErrorBoundary>
              </TabsContent>
              
              <TabsContent value="month" className="m-0">
                <CalendarErrorBoundary>
                  <StaffCalendar
                    staffMembers={transformedStaff}
                    events={processedEvents}
                    view="month"
                    onEventClick={handleEventClick}
                    onEventDrop={handleEventDrop}
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
