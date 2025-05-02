import { SchedulerData as OriginalSchedulerData } from 'react-big-scheduler';
import { Moment } from 'moment';

declare module 'react-big-scheduler' {
  export interface SchedulerData extends OriginalSchedulerData {
    clone(): SchedulerData;
    setViewType(viewType: ViewTypes): void;
  }

  export interface View {
    viewType: ViewTypes;
  }

  export interface Event {
    id: number | string;
    title: string;
    start: Date | string;
    end: Date | string;
    resourceId: string;
    bgColor?: string;
    [key: string]: any;
  }

  export enum ViewTypes {
    Day = 0,
    Week = 1,
    Month = 2,
    Quarter = 3,
    Year = 4,
    Custom = 5,
    Custom1 = 6,
    Custom2 = 7
  }

  export interface SchedulerProps {
    schedulerData: SchedulerData;
    viewType?: ViewTypes;
    showAgenda?: boolean;
    isEventPerspective?: boolean;
    prevClick?: (schedulerData: SchedulerData) => void;
    nextClick?: (schedulerData: SchedulerData) => void;
    onViewChange?: (schedulerData: SchedulerData, view: View) => void;
    onSelectDate?: (schedulerData: SchedulerData, date: string) => void;
    onEventClick?: (schedulerData: SchedulerData, event: Event) => void;
    eventItemTemplateResolver?: (
      schedulerData: SchedulerData,
      event: Event,
      bgColor: string,
      isStart: boolean,
      isEnd: boolean,
      mustAddCssClass: string,
      mustBeHeight: number,
      agendaMaxEventWidth: number
    ) => React.ReactNode;
    eventItemPopoverTemplateResolver?: (
      schedulerData: SchedulerData,
      eventItem: Event,
      title: string,
      start: Moment,
      end: Moment,
      statusColor: string
    ) => React.ReactNode;
  }

  const Scheduler: React.FC<SchedulerProps>;
  export default Scheduler;
} 