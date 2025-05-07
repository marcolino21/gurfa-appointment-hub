
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

  const handleAddService = (data: ServiceFormValues) => {
    addService(data);
  };

  const handleEditService = (data: ServiceFormValues) => {
    if (selectedService) {
      editService(data, selectedService);
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
    isLoading
  };
};
