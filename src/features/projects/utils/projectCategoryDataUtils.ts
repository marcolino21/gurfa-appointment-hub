
import { MOCK_PROJECT_CATEGORIES, MOCK_PROJECT_SUBCATEGORIES } from '@/data/mock/projects';
import { ProjectCategory } from '@/types';

/**
 * Retrieves project categories for a specific salon
 * @param salonId The ID of the salon
 * @returns Array of project categories for the specified salon
 */
export const getSalonProjectCategories = async (salonId: string): Promise<ProjectCategory[]> => {
  // In a real application, this would be an API call to a backend
  // For now, we're using mock data
  return MOCK_PROJECT_CATEGORIES[salonId] || [];
};

/**
 * Retrieves subcategories for a specific project category
 * @param categoryId The ID of the parent category
 * @returns Array of subcategories for the specified category
 */
export const getProjectCategorySubcategories = async (categoryId: string): Promise<ProjectCategory[]> => {
  // In a real application, this would be an API call to a backend
  // For now, we're using mock data
  return MOCK_PROJECT_SUBCATEGORIES[categoryId] || [];
};
