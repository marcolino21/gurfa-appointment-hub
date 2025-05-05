import React, { useState, useCallback } from 'react';
import { CalendarView } from '@/features/calendar/components/CalendarView';
import { useAppointmentEvents, useStaffResources } from '../hooks';
import { CalendarEvent } from '../types';
import moment from 'moment';
import { useParams } from 'react-router-dom';
import { StaffMember } from '@/types/staff';

type CalendarView = 'day' | 'week' | 'month';

type StaffMemberWithName = StaffMember & {
  name: string;
};

export const AppointmentCalendarView = () => {
  return <CalendarView />;
};
