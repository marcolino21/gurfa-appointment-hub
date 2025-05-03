interface StaffCalendarProps {
  staffMembers: StaffMember[];
}
interface DateSelectInfo {
  start: Date;
  end: Date;
  allDay: boolean;
  jsEvent: MouseEvent;
  view: any;
}
interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  end: string;
  resourceId: string;
  bgColor?: string;
  events: CalendarEvent[];
  view?: 'day' | 'week' | 'month';
  onEventClick?: (event: any) => void;
  onEventDrop?: (dropInfo: any) => void;
  onDateSelect?: (selectInfo: any) => void;
  onEventResize?: (resizeInfo: any) => void;
}
export const StaffCalendar: React.FC<StaffCalendarProps> = ({
  staffMembers,
  events,
  view = 'week',
  onEventClick,
  onEventDrop,
  onDateSelect,
  onEventResize
}) => {
  const schedulerRef = useRef<any>(null);
  const [schedulerData, setSchedulerData] = useState(() => {
    const viewType = view === 'day' ? ViewTypes.Day : 
                    view === 'month' ? ViewTypes.Month : ViewTypes.Week               
    const data = new SchedulerData(moment().format(DATE_FORMAT), viewType, false, false, {
      schedulerWidth: '100%',
      schedulerMaxHeight: 0,
      dayStartFrom: 8,
      dayStopTo: 20,
      eventItemHeight: 40,
      eventItemLineHeight: 40,
      nonWorkingTimeBodyBgColor: '#f0f0f0',
      minuteStep: 30,
    }); 
    // Convert staff members to resources
    const resources = staffMembers.map(staff => ({
      id: staff.id,
      name: staff.name || `${staff.firstName || ''} ${staff.lastName || ''}`.trim(),
      color: staff.color || '#4f46e5'
    }));
    data.setResources(resources);
    return data;
  });
  useEffect(() => {
    // Update view type when view prop changes
    const viewType = view === 'day' ? ViewTypes.Day : 
                    view === 'month' ? ViewTypes.Month : ViewTypes.Week;
    schedulerData.setViewType(viewType, false, false);
    setSchedulerData({...schedulerData});
  }, [view]);
useEffect(() => {
    // Update resources when staffMembers change
    const resources = staffMembers.map(staff => ({
      id: staff.id,
      name: staff.name || `${staff.firstName || ''} ${staff.lastName || ''}`.trim(),
      color: staff.color || '#4f46e5'
    }));
    schedulerData.setResources(resources);
    setSchedulerData({...schedulerData});
  }, [staffMembers]);
  useEffect(() => {
    // Convert calendar events to scheduler events
    const schedulerEvents = events.map(event => ({
      id: event.id,
      start: moment(event.start).format('YYYY-MM-DD HH:mm:ss'),
      end: moment(event.end).format('YYYY-MM-DD HH:mm:ss'),
      resourceId: event.staffId || event.resourceId || '',
      title: event.title || 'Appuntamento',
      bgColor: event.backgroundColor || event.color || '#4f46e5',
      status: event.status || 'pending'
    }));
    schedulerData.setEvents(schedulerEvents);
    setSchedulerData({...schedulerData});
  }, [events]);
  const prevClick = () => {
    schedulerData.prev();
    setSchedulerData({...schedulerData});
  };
  const nextClick = () => {
    schedulerData.next();
    setSchedulerData({...schedulerData});
  };
  const onSelectDate = (date: string) => {
    schedulerData.setDate(date);
    setSchedulerData({...schedulerData});
  };
  const onViewChange = (viewType: ViewTypes) => {
    schedulerData.setViewType(viewType, false, false);
    setSchedulerData({...schedulerData});
  };
  const eventClicked = (schedulerData: SchedulerData, event: any) => {
    if (onEventClick) {
      // Convert back to CalendarEvent format
      const calendarEvent = {
        id: event.id,
        title: event.title,
        start: new Date(moment(event.start).toDate()),
        end: new Date(moment(event.end).toDate()),
        staffId: event.resourceId,
        resourceId: event.resourceId,
        backgroundColor: event.bgColor,
        status: event.status,
        event: event, // Pass the original event for additional data
      };
      onEventClick({
        event: calendarEvent,
        jsEvent: {} as MouseEvent, // Simulate jsEvent
        view: schedulerData.viewType, // Pass the current view
      });
    }
  };
  const moveEvent = (schedulerData: SchedulerData, event: any, slotId: string, slotName: string, start: string, end: string) => {
    if (onEventDrop) {
      // Handle event drop
      const calendarEvent = {
        id: event.id,
        title: event.title,
        start: new Date(moment(start).toDate()),
        end: new Date(moment(end).toDate()),
        staffId: slotId,
        resourceId: slotId,
        backgroundColor: event.bgColor,
        status: event.status,
      };
      onEventDrop({
        event: calendarEvent,
        oldResource: event.resourceId,
        newResource: slotId,
        revert: () => {
          // Revert the event by refreshing the view
          schedulerData.setEvents(schedulerData.events);
          setSchedulerData({...schedulerData});
        }
      });
    }
    // Update local data
    schedulerData.moveEvent(event, slotId, slotName, start, end);
    setSchedulerData({...schedulerData});
  };
  const resizeEvent = (schedulerData: SchedulerData, event: any, start: string, end: string) => {
    if (onEventResize) {
      const startDate = moment(start);
      const endDate = moment(end);
      const originalStart = moment(event.start);
      const originalEnd = moment(event.end);
      // Calculate time differences in minutes
      const startDelta = startDate.diff(originalStart, 'minutes');
      const endDelta = endDate.diff(originalEnd, 'minutes');
      const calendarEvent = {
        id: event.id,
        title: event.title,
        start: new Date(startDate.toDate()),
        end: new Date(endDate.toDate()),
        staffId: event.resourceId,
        resourceId: event.resourceId,
        backgroundColor: event.bgColor,
        status: event.status,
      }; 
      onEventResize({
        event: calendarEvent,
        startDelta,
        endDelta,
        revert: () => {
          // Revert the event by refreshing the view
          schedulerData.setEvents(schedulerData.events);
          setSchedulerData({...schedulerData});
        }
      });
    }
    // Update local data
    schedulerData.updateEventEnd(event, end);
    setSchedulerData({...schedulerData});
  };
  const newEvent = (schedulerData: SchedulerData, slotId: string, slotName: string, start: string, end: string, type: string, item: any) => {
    if (onDateSelect) {
      onDateSelect({
        start: new Date(moment(start).toDate()),
        end: new Date(moment(end).toDate()),
        resourceId: slotId,
        resource: { id: slotId, title: slotName },
        startStr: start,
        endStr: end,
        allDay: false,
        view: schedulerData.viewType,
        jsEvent: {} as MouseEvent,
      });
    }
  };
  return (
    <div className="scheduler-container">
    <div className="scheduler-container" ref={schedulerRef}>
      <Scheduler
        schedulerData={schedulerData}
        prevClick={prevClick}
        nextClick={nextClick}
        onSelectDate={onSelectDate}
        onViewChange={onViewChange}
        eventItemClick={eventClicked}
        moveEvent={moveEvent}
        newEvent={newEvent}
        updateEventEnd={resizeEvent}
        viewEventClick={() => {}} // Empty handler to prevent errors
      />
    </div>
  );
};
export default StaffCalendar;
