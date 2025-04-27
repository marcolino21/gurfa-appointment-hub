
import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { StaffMember } from '@/types';
import StaffCalendar from '@/features/appointments/components/StaffCalendar';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import '../styles/index.css';

interface AppointmentCalendarViewProps {
  visibleStaff: StaffMember[];
  events: any[];
  handleDateSelect: (selectInfo: any) => void;
  handleEventClick: (clickInfo: any) => void;
  handleEventDrop: (dropInfo: any) => void;
  onViewChange: (view: 'timeGridDay' | 'timeGridWeek' | 'dayGridMonth') => void;
  handleEventResize?: (resizeInfo: any) => void;
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
  const [activeTab, setActiveTab] = useState('week'); // Imposta la settimana come vista predefinita

  // Process events to add staff names for the month view
  const processedEvents = events.map(event => {
    if (!event.extendedProps) {
      event.extendedProps = {};
    }

    // Find associated staff member
    const staffMember = visibleStaff.find(staff => staff.id === event.resourceId);
    if (staffMember) {
      event.extendedProps.staffName = `${staffMember.firstName} ${staffMember.lastName}`;
      // This will be used by CSS to display staff name in month view
      event.classNames = [...(event.classNames || []), 'has-staff-name'];
    }
    
    return event;
  });
  
  // Handle tab changes and notify parent component
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    
    if (value === 'day') onViewChange('timeGridDay');
    else if (value === 'week') onViewChange('timeGridWeek');
    else onViewChange('dayGridMonth');
  };

  // Debug the visible staff to check if they're correctly passed
  useEffect(() => {
    console.log("Visible staff in AppointmentCalendarView:", visibleStaff);
  }, [visibleStaff]);

  // Funzione per gestire il ridimensionamento degli eventi
  const handleAppointmentResize = (resizeInfo: any) => {
    if (handleEventResize) {
      handleEventResize(resizeInfo);
    } else {
      // Fallback: usa handleEventDrop come ultima risorsa
      handleEventDrop(resizeInfo);
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
                <StaffCalendar
                  staffMembers={visibleStaff}
                  events={processedEvents}
                  view="timeGridDay"
                  onEventClick={handleEventClick}
                  onEventDrop={handleEventDrop}
                  onDateSelect={handleDateSelect}
                />
              </TabsContent>
              
              <TabsContent value="week" className="m-0">
                <StaffCalendar
                  staffMembers={visibleStaff}
                  events={processedEvents}
                  view="timeGridWeek"
                  onEventClick={handleEventClick}
                  onEventDrop={handleEventDrop}
                  onDateSelect={handleDateSelect}
                />
              </TabsContent>
              
              <TabsContent value="month" className="m-0">
                <StaffCalendar
                  staffMembers={visibleStaff}
                  events={processedEvents}
                  view="dayGridMonth"
                  onEventClick={handleEventClick}
                  onEventDrop={handleEventDrop}
                  onDateSelect={handleDateSelect}
                />
              </TabsContent>
            </>
          )}
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default AppointmentCalendarView;
