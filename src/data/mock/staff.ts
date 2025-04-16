
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
      color: '#9b87f5'
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
      color: '#F97316'
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
      color: '#0EA5E9'
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
      color: '#D946EF'
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
      color: '#F2FCE2'
    }
  ]
};
