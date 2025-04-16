import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { MOCK_SERVICES, MOCK_SERVICE_CATEGORIES, MOCK_STAFF } from '@/data/mockData';
import { Service, ServiceCategory, StaffMember } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { ServiceFormValues } from '../types';

export const useServicesData = () => {
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
  const { toast } = useToast();

  const filteredServices = services.filter(service => {
    return service.name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const getCategoryName = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.name : '';
  };

  const handleAddService = (data: ServiceFormValues) => {
    if (!currentSalonId) return;

    // Create service with required fields explicitly defined
    const newService: Service = {
      id: `s${Math.random().toString(36).substr(2, 9)}`,
      name: data.name,
      category: data.category, 
      duration: data.duration,
      tempoDiPosa: data.tempoDiPosa,
      price: data.price,
      color: data.color,
      salonId: currentSalonId,
      assignedStaffIds: data.assignedStaffIds || [],
      // Optional fields
      description: data.description,
    };

    setServices([...services, newService]);
    toast({
      title: 'Servizio aggiunto',
      description: `${newService.name} è stato aggiunto con successo`,
    });
    setIsAddDialogOpen(false);
  };

  const handleEditService = (data: ServiceFormValues) => {
    if (!selectedService) return;

    const updatedServices = services.map(service => 
      service.id === selectedService.id ? { 
        ...service,
        name: data.name,
        category: data.category,
        duration: data.duration,
        tempoDiPosa: data.tempoDiPosa,
        price: data.price,
        color: data.color,
        description: data.description,
        assignedStaffIds: data.assignedStaffIds,
      } : service
    );

    setServices(updatedServices);
    toast({
      title: 'Servizio modificato',
      description: `${data.name} è stato modificato con successo`,
    });
    setIsEditDialogOpen(false);
  };

  const handleDeleteService = (serviceId: string) => {
    const updatedServices = services.filter(service => service.id !== serviceId);
    setServices(updatedServices);
    toast({
      title: 'Servizio eliminato',
      description: 'Il servizio è stato eliminato con successo',
    });
  };

  return {
    services,
    categories,
    staffMembers,
    filteredServices,
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
    getCategoryName,
    handleAddService,
    handleEditService,
    handleDeleteService
  };
};
