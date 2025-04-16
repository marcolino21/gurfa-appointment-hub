
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Appointment, StaffMember } from '@/types';
import StaffCalendar from '@/features/appointments/components/StaffCalendar';

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
  return (
    <Card>
      <CardContent className="p-0 sm:p-6">
        <Tabs 
          defaultValue="week" 
          className="w-full"
          onValueChange={(value) => {
            if (value === 'day') onViewChange('timeGridDay');
            else if (value === 'week') onViewChange('timeGridWeek');
            else onViewChange('dayGridMonth');
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
            <StaffCalendar
              staffMembers={visibleStaff}
              events={events}
              view="timeGridDay"
              onEventClick={handleEventClick}
              onEventDrop={handleEventDrop}
              onDateSelect={handleDateSelect}
            />
          </TabsContent>
          
          <TabsContent value="week" className="m-0">
            <StaffCalendar
              staffMembers={visibleStaff}
              events={events}
              view="timeGridWeek"
              onEventClick={handleEventClick}
              onEventDrop={handleEventDrop}
              onDateSelect={handleDateSelect}
            />
          </TabsContent>
          
          <TabsContent value="month" className="m-0">
            <StaffCalendar
              staffMembers={visibleStaff}
              events={events}
              view="dayGridMonth"
              onEventClick={handleEventClick}
              onEventDrop={handleEventDrop}
              onDateSelect={handleDateSelect}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default AppointmentCalendarView;
