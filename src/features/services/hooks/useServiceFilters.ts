
import { Service, ServiceCategory } from '@/types';

/**
 * Hook for filtering services and getting category info
 */
export const useServiceFilters = (services: Service[], categories: ServiceCategory[], searchTerm: string) => {
  const filteredServices = services.filter(service => {
    return service.name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const getCategoryName = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.name : '';
  };

  return {
    filteredServices,
    getCategoryName
  };
};
