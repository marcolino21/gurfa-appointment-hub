
import { Service, ServiceCategory } from '@/types';

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
      tempoDiPosa: 15,
      price: 25,
      color: '#9b87f5',
      salonId: 'sa1',
      assignedStaffIds: ['staff1', 'staff2'],
      assignedServiceIds: []
    },
    {
      id: 's2',
      name: 'Taglio capelli donna',
      category: 'cat1',
      description: 'Taglio di capelli per donna',
      duration: 45,
      tempoDiPosa: 30,
      price: 35,
      color: '#9b87f5',
      salonId: 'sa1',
      assignedStaffIds: ['staff1', 'staff3'],
      assignedServiceIds: []
    },
    {
      id: 's3',
      name: 'Colore',
      category: 'cat2',
      description: 'Colorazione capelli',
      duration: 60,
      tempoDiPosa: 45,
      price: 50,
      color: '#F97316',
      salonId: 'sa1',
      assignedStaffIds: ['staff3'],
      assignedServiceIds: []
    },
    {
      id: 's4',
      name: 'Manicure base',
      category: 'cat4',
      description: 'Manicure senza smalto',
      duration: 30,
      tempoDiPosa: 15,
      price: 20,
      color: '#D946EF',
      salonId: 'sa1',
      assignedStaffIds: ['staff4'],
      assignedServiceIds: []
    }
  ]
};
