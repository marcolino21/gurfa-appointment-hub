
import { useServicesState } from './useServicesState';
import { useServiceOperations } from './useServiceOperations';
import { useServiceFilters } from './useServiceFilters';
import { ServiceFormValues } from '../types';

export const useServicesData = () => {
  const {
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
    currentSalonId,
    isLoading
  } = useServicesState();

  const { filteredServices, getCategoryName } = useServiceFilters(services, categories, searchTerm);

  const { handleAddService: addService, handleEditService: editService, handleDeleteService } = 
    useServiceOperations(services, setServices, currentSalonId, setIsAddDialogOpen, setIsEditDialogOpen);

  const handleAddService = async (data: ServiceFormValues) => {
    console.log('Handling add service in useServicesData:', data);
    
    if (!currentSalonId) {
      console.error('No salon ID available when trying to add a service');
      return;
    }
    
    await addService(data);
  };

  const handleEditService = async (data: ServiceFormValues) => {
    console.log('Handling edit service in useServicesData:', data);
    
    if (!currentSalonId) {
      console.error('No salon ID available when trying to edit a service');
      return;
    }
    
    if (selectedService) {
      await editService(data, selectedService);
    }
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
    handleDeleteService,
    isLoading,
    currentSalonId
  };
};
