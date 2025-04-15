import { User, Salon, UserRole, Client, Service, ServiceCategory, StaffMember } from '../types';

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

// Mock service categories
export const MOCK_SERVICE_CATEGORIES: Record<string, ServiceCategory[]> = {
  'sa1': [
    { id: 'cat1', name: 'Taglio', color: '#9b87f5', salonId: 'sa1' },
    { id: 'cat2', name: 'Colore', color: '#F97316', salonId: 'sa1' },
    { id: 'cat3', name: 'Trattamenti', color: '#0EA5E9', salonId: 'sa1' },
    { id: 'cat4', name: 'Manicure', color: '#D946EF', salonId: 'sa1' },
    { id: 'cat5', name: 'Pedicure', color: '#F2FCE2', salonId: 'sa1' }
  ]
};

// Mock services
export const MOCK_SERVICES: Record<string, Service[]> = {
  'sa1': [
    {
      id: 's1',
      name: 'Taglio capelli uomo',
      category: 'cat1',
      description: 'Taglio di capelli per uomo',
      duration: 30,
      price: 25,
      color: '#9b87f5',
      salonId: 'sa1',
      assignedStaffIds: ['staff1', 'staff2']
    },
    {
      id: 's2',
      name: 'Taglio capelli donna',
      category: 'cat1',
      description: 'Taglio di capelli per donna',
      duration: 45,
      price: 35,
      color: '#9b87f5',
      salonId: 'sa1',
      assignedStaffIds: ['staff1', 'staff3']
    },
    {
      id: 's3',
      name: 'Colore',
      category: 'cat2',
      description: 'Colorazione capelli',
      duration: 60,
      price: 50,
      color: '#F97316',
      salonId: 'sa1',
      assignedStaffIds: ['staff3']
    },
    {
      id: 's4',
      name: 'Manicure base',
      category: 'cat4',
      description: 'Manicure senza smalto',
      duration: 30,
      price: 20,
      color: '#D946EF',
      salonId: 'sa1',
      assignedStaffIds: ['staff4']
    }
  ]
};

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

export const MOCK_SUBSCRIPTIONS: Record<string, Subscription[]> = {
  'salon-01': [
    {
      id: 'sub-01',
      name: 'Premium Mensile',
      type: 'services',
      serviceIds: ['service-01', 'service-02'],
      includeAllServices: false,
      price: 59.99,
      discount: 10,
      clientId: 'client-01',
      paymentMethod: 'credit_card',
      recurrenceType: 'monthly',
      cancellableImmediately: true,
      minDuration: 3,
      sellOnline: true,
      geolocationEnabled: true,
      geolocationRadius: 10,
      startDate: '2025-04-01',
      status: 'active',
      salonId: 'salon-01',
      createdAt: '2025-03-25'
    },
    {
      id: 'sub-02',
      name: 'Ingressi Standard',
      type: 'entries',
      serviceIds: [],
      includeAllServices: true,
      entriesPerMonth: 2,
      price: 39.99,
      clientId: 'client-02',
      paymentMethod: 'paypal',
      recurrenceType: 'monthly',
      cancellableImmediately: false,
      minDuration: 6,
      maxDuration: 12,
      sellOnline: false,
      geolocationEnabled: false,
      startDate: '2025-02-15',
      status: 'active',
      salonId: 'salon-01',
      createdAt: '2025-02-10'
    }
  ]
};
