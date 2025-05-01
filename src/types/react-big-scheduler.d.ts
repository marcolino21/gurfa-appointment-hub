declare module 'react-big-scheduler' {
  import { Component } from 'react';
  import { Moment } from 'moment';

  export class SchedulerData {
    constructor(
      date: string,
      viewType: ViewTypes,
      showAgenda: boolean,
      isEventPerspective: boolean,
      config?: SchedulerConfig
    );

    setResources(resources: Resource[]): void;
    setEvents(events: Event[]): void;
    prev(): void;
    next(): void;
    setDate(date: string): void;
    setViewType(viewType: ViewTypes, showAgenda?: boolean, isEventPerspective?: boolean): void;
    clone(): SchedulerData;
  }

  export interface Resource {
    id: string;
    name: string;
    color?: string;
  }

  export interface Event {
    id: string;
    start: string;
    end: string;
    resourceId: string;
    title: string;
    bgColor?: string;
    [key: string]: any;
  }

  export interface SchedulerConfig {
    schedulerWidth?: string;
    schedulerMaxHeight?: number;
    dayStartFrom?: number;
    dayStopTo?: number;
    eventItemHeight?: number;
    eventItemLineHeight?: number;
    nonWorkingTimeBodyBgColor?: string;
    minuteStep?: number;
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

  export const DATE_FORMAT: string;

  export interface SchedulerProps {
    schedulerData: SchedulerData;
    prevClick?: (schedulerData: SchedulerData) => void;
    nextClick?: (schedulerData: SchedulerData) => void;
    onSelectDate?: (schedulerData: SchedulerData, date: string) => void;
    onViewChange?: (schedulerData: SchedulerData, view: ViewTypes) => void;
    eventItemClick?: (schedulerData: SchedulerData, event: Event) => void;
    [key: string]: any;
  }

  export default class Scheduler extends Component<SchedulerProps> {}
} 