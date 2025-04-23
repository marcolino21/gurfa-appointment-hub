
import { useState } from 'react';
import { ProjectCategory } from '@/types';

interface UseProjectCategoriesProps {
  getSubcategories: (categoryId: string) => ProjectCategory[];
}

export const useProjectCategories = ({ getSubcategories }: UseProjectCategoriesProps) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [subcategories, setSubcategories] = useState<ProjectCategory[]>([]);
  const [useCustomCategory, setUseCustomCategory] = useState(false);

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setSubcategories(getSubcategories(categoryId));
  };

  return {
    selectedCategory,
    setSelectedCategory: handleCategoryChange,
    subcategories,
    setSubcategories,
    useCustomCategory,
    setUseCustomCategory,
  };
};
