
import { StaffMember } from '@/types';

// Costanti per identificare gli operatori di test
export const TEST_OPERATOR_IDS = ['TEST_OPERATOR_1', 'TEST_OPERATOR_2'];

// Operatori di test permanenti
export const TEST_OPERATORS: StaffMember[] = [
  {
    id: 'TEST_OPERATOR_1',
    firstName: 'Test',
    lastName: 'Operatore1',
    email: 'test.operatore1@example.com',
    phone: '+39 111 111 1111',
    salonId: 'sa1',
    isActive: true,
    showInCalendar: true,
    assignedServiceIds: [],
    color: '#10b981',
    workSchedule: [
      { day: 'Lunedì', isWorking: true, startTime: '09:00', endTime: '17:00', breakStart: '', breakEnd: '' },
      { day: 'Martedì', isWorking: true, startTime: '09:00', endTime: '17:00', breakStart: '', breakEnd: '' },
      { day: 'Mercoledì', isWorking: true, startTime: '09:00', endTime: '17:00', breakStart: '', breakEnd: '' },
      { day: 'Giovedì', isWorking: true, startTime: '09:00', endTime: '17:00', breakStart: '', breakEnd: '' },
      { day: 'Venerdì', isWorking: true, startTime: '09:00', endTime: '17:00', breakStart: '', breakEnd: '' },
      { day: 'Sabato', isWorking: false, startTime: '', endTime: '', breakStart: '', breakEnd: '' },
      { day: 'Domenica', isWorking: false, startTime: '', endTime: '', breakStart: '', breakEnd: '' },
    ]
  },
  {
    id: 'TEST_OPERATOR_2',
    firstName: 'Test',
    lastName: 'Operatore2',
    email: 'test.operatore2@example.com',
    phone: '+39 222 222 2222',
    salonId: 'sa1',
    isActive: true,
    showInCalendar: true,
    assignedServiceIds: [],
    color: '#f59e42',
    workSchedule: [
      { day: 'Lunedì', isWorking: true, startTime: '10:00', endTime: '18:00', breakStart: '', breakEnd: '' },
      { day: 'Martedì', isWorking: true, startTime: '10:00', endTime: '18:00', breakStart: '', breakEnd: '' },
      { day: 'Mercoledì', isWorking: true, startTime: '10:00', endTime: '18:00', breakStart: '', breakEnd: '' },
      { day: 'Giovedì', isWorking: true, startTime: '10:00', endTime: '18:00', breakStart: '', breakEnd: '' },
      { day: 'Venerdì', isWorking: true, startTime: '10:00', endTime: '18:00', breakStart: '', breakEnd: '' },
      { day: 'Sabato', isWorking: false, startTime: '', endTime: '', breakStart: '', breakEnd: '' },
      { day: 'Domenica', isWorking: false, startTime: '', endTime: '', breakStart: '', breakEnd: '' },
    ]
  }
];

// Mock staff members
export const MOCK_STAFF: Record<string, StaffMember[]> = {
  'sa1': [
    ...TEST_OPERATORS,
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

/**
 * Funzione helper per eliminare gli operatori di test dal mock staff.
 * Utilizzala per la pulizia dopo i test!
 */
export function deleteTestOperators(salonId: string = 'sa1') {
  if (!MOCK_STAFF[salonId]) return;
  MOCK_STAFF[salonId] = MOCK_STAFF[salonId].filter(
    (member) => !TEST_OPERATOR_IDS.includes(member.id)
  );
}
