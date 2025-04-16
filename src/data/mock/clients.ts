
import { Client } from '@/types';

// Mock clients for development
export const MOCK_CLIENTS: Record<string, Client[]> = {
  'sa1': [
    {
      id: 'c1',
      firstName: 'Adriana',
      lastName: 'Darie',
      phone: '+393442223386',
      email: 'adriana.darie@example.com',
      gender: 'F',
      salonId: 'sa1',
      dateOfBirth: '1985-06-15',
      isPrivate: true,
      appointmentsCount: 10,
      lastAppointment: '2025-04-24',
      averageSpending: 71.67,
      visitFrequency: 'ogni 151 giorni'
    },
    {
      id: 'c2',
      firstName: 'Alessandro',
      lastName: 'Falasca',
      phone: '+393442223387',
      email: 'alessandro.falasca@example.com',
      gender: 'M',
      salonId: 'sa1',
      isPrivate: true
    },
    {
      id: 'c3',
      firstName: 'Alessandra',
      lastName: 'Pasquini',
      phone: '+393442223388',
      email: 'alessandra.pasquini@example.com',
      gender: 'F',
      salonId: 'sa1',
      isPrivate: true
    }
  ],
  'a1': [
    {
      id: 'c4',
      firstName: 'Marco',
      lastName: 'Rossi',
      phone: '+393442223389',
      email: 'marco.rossi@example.com',
      gender: 'M',
      salonId: 'a1',
      isPrivate: true
    }
  ],
  'a2': [
    {
      id: 'c5',
      firstName: 'Giulia',
      lastName: 'Bianchi',
      phone: '+393442223390',
      email: 'giulia.bianchi@example.com',
      gender: 'F',
      salonId: 'a2',
      isPrivate: false
    }
  ],
  'f1': [
    {
      id: 'c6',
      firstName: 'Paolo',
      lastName: 'Verdi',
      phone: '+393442223391',
      email: 'paolo.verdi@example.com',
      gender: 'M',
      salonId: 'f1',
      isPrivate: true
    }
  ]
};
