
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { projectSchema } from '../schemas/projectSchema';
import { Client, Project, ProjectCategory, ProjectFormValues } from '@/types';
import { useProjectUrlParams } from './useProjectUrlParams';
import { useProjectFormInit } from './useProjectFormInit';
import { useState, useEffect } from 'react';

interface UseProjectFormProps {
  clients: Client[];
  categories: ProjectCategory[];
  getSubcategories: (categoryId: string) => ProjectCategory[];
  selectedProject: Project | null;
  onSubmit: (data: ProjectFormValues) => void;
}

export const useProjectForm = ({
  clients,
  categories,
  getSubcategories,
  selectedProject,
  onSubmit
}: UseProjectFormProps) => {
  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: '',
      clientId: '',
      categoryId: '',
      subcategoryId: '',
      description: '',
      objectives: [{ description: '', isCompleted: false }],
      startDate: format(new Date(), 'yyyy-MM-dd'),
      endDate: '',
      status: 'planning',
      progress: 0,
      feedback: '',
      staffIds: [],
      customFields: [],
      customCategory: '',
    }
  });

  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [subcategories, setSubcategories] = useState<ProjectCategory[]>([]);
  const [useCustomCategory, setUseCustomCategory] = useState<boolean>(false);

  // Fetch subcategories when category changes
  useEffect(() => {
    if (selectedCategory && !useCustomCategory) {
      const categorySubcategories = getSubcategories(selectedCategory);
      setSubcategories(categorySubcategories);
    } else {
      setSubcategories([]);
    }
  }, [selectedCategory, getSubcategories, useCustomCategory]);

  // Update selectedCategory when form's categoryId changes
  useEffect(() => {
    const categoryId = form.watch('categoryId');
    if (categoryId) {
      setSelectedCategory(categoryId);
    }
  }, [form.watch('categoryId')]);

  useProjectUrlParams(form.setValue);

  useProjectFormInit({
    selectedProject,
    reset: form.reset,
    setSelectedCategory,
    getSubcategories
  });

  const handleSubmit = () => {
    form.handleSubmit((data: ProjectFormValues) => {
      if (useCustomCategory && data.customCategory) {
        data.categoryId = data.customCategory;
      }
      onSubmit(data);
    })();
  };

  return {
    form,
    handleSubmit,
    useCustomCategory,
    setUseCustomCategory,
    selectedCategory,
    setSelectedCategory,
    subcategories,
  };
};
