
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
}

const AppointmentCalendarView: React.FC<AppointmentCalendarViewProps> = ({
  visibleStaff,
  events,
  handleDateSelect,
  handleEventClick,
  handleEventDrop,
  onViewChange
}) => {
  const [activeTab, setActiveTab] = useState('day');

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

  return (
    <Card>
      <CardContent className="p-0 sm:p-6">
        <Tabs 
          value={activeTab} 
          onValueChange={handleTabChange}
          className="w-full"
        >
          <div className="flex justify-between items-center p-4 border-b">
            <TabsList>
              <TabsTrigger value="day">Giorno</TabsTrigger>
              <TabsTrigger value="week">Settimana</TabsTrigger>
              <TabsTrigger value="month">Mese</TabsTrigger>
            </TabsList>
          </div>
          
          {visibleStaff.length === 0 ? (
            <Alert className="m-6">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Nessun operatore visibile</AlertTitle>
              <AlertDescription>
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
