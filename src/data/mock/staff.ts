
import { StaffMember } from '@/types';

// Mock staff members
export const MOCK_STAFF: Record<string, StaffMember[]> = {
  'sa1': [
    {
      id: 'staff1',
      firstName: 'Marco',
      lastName: 'Silvestrelli',
      email: 'silvestrellimmarco@gmail.com',
      phone: '+39 339 277 4104',
      salonId: 'sa1',
      isActive: true,
      showInCalendar: true,
      assignedServiceIds: ['s1', 's2'],
      color: '#9b87f5',
      workSchedule: [
        { day: 'Lunedì', isWorking: true, startTime: '09:00', endTime: '18:00', breakStart: '13:00', breakEnd: '14:00' },
        { day: 'Martedì', isWorking: true, startTime: '09:00', endTime: '18:00', breakStart: '13:00', breakEnd: '14:00' },
        { day: 'Mercoledì', isWorking: true, startTime: '09:00', endTime: '18:00', breakStart: '13:00', breakEnd: '14:00' },
        { day: 'Giovedì', isWorking: true, startTime: '09:00', endTime: '18:00', breakStart: '13:00', breakEnd: '14:00' },
        { day: 'Venerdì', isWorking: true, startTime: '09:00', endTime: '18:00', breakStart: '13:00', breakEnd: '14:00' },
        { day: 'Sabato', isWorking: false, startTime: '09:00', endTime: '13:00', breakStart: '', breakEnd: '' },
        { day: 'Domenica', isWorking: false, startTime: '', endTime: '', breakStart: '', breakEnd: '' },
      ]
    },
    {
      id: 'staff2',
      firstName: 'Fabrizio',
      lastName: 'Scopigno',
      email: 'fabrizio.scopigno@example.com',
      salonId: 'sa1',
      isActive: true,
      showInCalendar: true,
      assignedServiceIds: ['s1'],
      color: '#F97316',
      workSchedule: [
        { day: 'Lunedì', isWorking: true, startTime: '09:00', endTime: '18:00', breakStart: '13:00', breakEnd: '14:00' },
        { day: 'Martedì', isWorking: true, startTime: '09:00', endTime: '18:00', breakStart: '13:00', breakEnd: '14:00' },
        { day: 'Mercoledì', isWorking: true, startTime: '09:00', endTime: '18:00', breakStart: '13:00', breakEnd: '14:00' },
        { day: 'Giovedì', isWorking: true, startTime: '09:00', endTime: '18:00', breakStart: '13:00', breakEnd: '14:00' },
        { day: 'Venerdì', isWorking: true, startTime: '09:00', endTime: '18:00', breakStart: '13:00', breakEnd: '14:00' },
        { day: 'Sabato', isWorking: false, startTime: '09:00', endTime: '13:00', breakStart: '', breakEnd: '' },
        { day: 'Domenica', isWorking: false, startTime: '', endTime: '', breakStart: '', breakEnd: '' },
      ]
    },
    {
      id: 'staff3',
      firstName: 'Flavia',
      lastName: 'Luconi',
      email: 'flavia.luconi@example.com',
      salonId: 'sa1',
      isActive: true,
      showInCalendar: true,
      assignedServiceIds: ['s2', 's3'],
      color: '#0EA5E9',
      workSchedule: [
        { day: 'Lunedì', isWorking: true, startTime: '10:00', endTime: '19:00', breakStart: '14:00', breakEnd: '15:00' },
        { day: 'Martedì', isWorking: true, startTime: '10:00', endTime: '19:00', breakStart: '14:00', breakEnd: '15:00' },
        { day: 'Mercoledì', isWorking: true, startTime: '10:00', endTime: '19:00', breakStart: '14:00', breakEnd: '15:00' },
        { day: 'Giovedì', isWorking: true, startTime: '10:00', endTime: '19:00', breakStart: '14:00', breakEnd: '15:00' },
        { day: 'Venerdì', isWorking: true, startTime: '10:00', endTime: '19:00', breakStart: '14:00', breakEnd: '15:00' },
        { day: 'Sabato', isWorking: true, startTime: '10:00', endTime: '15:00', breakStart: '', breakEnd: '' },
        { day: 'Domenica', isWorking: false, startTime: '', endTime: '', breakStart: '', breakEnd: '' },
      ]
    },
    {
      id: 'staff4',
      firstName: 'Greta',
      lastName: '',
      email: 'greta@example.com',
      salonId: 'sa1',
      isActive: true,
      showInCalendar: false,
      assignedServiceIds: ['s4'],
      color: '#D946EF',
      workSchedule: [
        { day: 'Lunedì', isWorking: false, startTime: '09:00', endTime: '18:00', breakStart: '13:00', breakEnd: '14:00' },
        { day: 'Martedì', isWorking: false, startTime: '09:00', endTime: '18:00', breakStart: '13:00', breakEnd: '14:00' },
        { day: 'Mercoledì', isWorking: true, startTime: '09:00', endTime: '18:00', breakStart: '13:00', breakEnd: '14:00' },
        { day: 'Giovedì', isWorking: true, startTime: '09:00', endTime: '18:00', breakStart: '13:00', breakEnd: '14:00' },
        { day: 'Venerdì', isWorking: true, startTime: '09:00', endTime: '18:00', breakStart: '13:00', breakEnd: '14:00' },
        { day: 'Sabato', isWorking: false, startTime: '', endTime: '', breakStart: '', breakEnd: '' },
        { day: 'Domenica', isWorking: false, startTime: '', endTime: '', breakStart: '', breakEnd: '' },
      ]
    },
    {
      id: 'staff5',
      firstName: 'Simona',
      lastName: 'Rapagnani',
      email: 'simogiufa@gmail.com',
      phone: '+39 393 134 2628',
      salonId: 'sa1',
      isActive: false,
      showInCalendar: false,
      assignedServiceIds: [],
      color: '#F2FCE2',
      workSchedule: [
        { day: 'Lunedì', isWorking: false, startTime: '09:00', endTime: '18:00', breakStart: '13:00', breakEnd: '14:00' },
        { day: 'Martedì', isWorking: false, startTime: '09:00', endTime: '18:00', breakStart: '13:00', breakEnd: '14:00' },
        { day: 'Mercoledì', isWorking: false, startTime: '09:00', endTime: '18:00', breakStart: '13:00', breakEnd: '14:00' },
        { day: 'Giovedì', isWorking: false, startTime: '09:00', endTime: '18:00', breakStart: '13:00', breakEnd: '14:00' },
        { day: 'Venerdì', isWorking: false, startTime: '09:00', endTime: '18:00', breakStart: '13:00', breakEnd: '14:00' },
        { day: 'Sabato', isWorking: false, startTime: '', endTime: '', breakStart: '', breakEnd: '' },
        { day: 'Domenica', isWorking: false, startTime: '', endTime: '', breakStart: '', breakEnd: '' },
      ]
    }
  ]
};
