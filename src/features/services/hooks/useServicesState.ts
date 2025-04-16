
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { MOCK_SERVICES, MOCK_SERVICE_CATEGORIES, MOCK_STAFF } from '@/data/mockData';
import { Service, ServiceCategory, StaffMember } from '@/types';

/**
 * Hook for managing the state of services, categories, and staff data
 */
export const useServicesState = () => {
  const { currentSalonId } = useAuth();
  const [services, setServices] = useState<Service[]>(
    currentSalonId ? MOCK_SERVICES[currentSalonId] || [] : []
  );
  const [categories, setCategories] = useState<ServiceCategory[]>(
    currentSalonId ? MOCK_SERVICE_CATEGORIES[currentSalonId] || [] : []
  );
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>(
    currentSalonId ? MOCK_STAFF[currentSalonId] || [] : []
  );
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [activeTab, setActiveTab] = useState('dettagli');

  return {
    services,
    setServices,
    categories,
    staffMembers,
    searchTerm,
    setSearchTerm,
    isAddDialogOpen,
    setIsAddDialogOpen,
    isEditDialogOpen,
    setIsEditDialogOpen,
    selectedService,
    setSelectedService,
    activeTab,
    setActiveTab,
    currentSalonId
  };
};
