
import { useState, useEffect } from 'react';
import { ProjectCategory } from '@/types';

interface UseProjectCategoriesProps {
  getSubcategories: (categoryId: string) => ProjectCategory[];
}

export const useProjectCategories = ({ getSubcategories }: UseProjectCategoriesProps) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [subcategories, setSubcategories] = useState<ProjectCategory[]>([]);
  const [useCustomCategory, setUseCustomCategory] = useState<boolean>(false);

  // Fetch subcategories when category changes
  useEffect(() => {
    if (selectedCategory && !useCustomCategory) {
      const fetchedSubcategories = getSubcategories(selectedCategory);
      setSubcategories(fetchedSubcategories);
    } else {
      setSubcategories([]);
    }
  }, [selectedCategory, getSubcategories, useCustomCategory]);

  return {
    selectedCategory,
    setSelectedCategory,
    subcategories,
    setSubcategories,
    useCustomCategory,
    setUseCustomCategory
  };
};
