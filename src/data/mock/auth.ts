
import { User, Salon, UserRole } from '@/types';

// Mock users for development
export const MOCK_USERS: Record<string, User & { password: string }> = {
  'super_admin@gurfa.com': {
    id: '1',
    email: 'super_admin@gurfa.com',
    name: 'Super Admin',
    password: 'admin123',
    role: 'super_admin' as UserRole,
    isActive: true
  },
  'admin@gurfa.app': {
    id: '4',
    email: 'admin@gurfa.app',
    name: 'Admin Demo',
    password: 'password',
    role: 'super_admin' as UserRole,
    isActive: true
  },
  'azienda@gurfa.com': {
    id: '2',
    email: 'azienda@gurfa.com',
    name: 'Azienda Demo',
    password: 'azienda123',
    role: 'azienda' as UserRole,
    isActive: true
  },
  'freelance@gurfa.com': {
    id: '3',
    email: 'freelance@gurfa.com',
    name: 'Freelance Demo',
    password: 'freelance123',
    role: 'freelance' as UserRole,
    isActive: true
  }
};

// Mock salons for development
export const MOCK_SALONS: Record<string, Salon[]> = {
  '1': [
    { id: 'sa1', name: 'Salone Admin', ownerId: '1' }
  ],
  '2': [
    { id: 'a1', name: 'Salone Roma Centro', ownerId: '2', address: 'Via Roma 123, Roma', phone: '06123456' },
    { id: 'a2', name: 'Salone Milano Centro', ownerId: '2', address: 'Via Milano 456, Milano', phone: '02123456' }
  ],
  '3': [
    { id: 'f1', name: 'Studio Personale', ownerId: '3', address: 'Via Napoli 789, Napoli', phone: '081123456' }
  ]
};
