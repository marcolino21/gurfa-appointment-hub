
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { projectSchema } from '../schemas/projectSchema';
import { Client, Project, ProjectCategory, ProjectFormValues } from '@/types';
import { useProjectCategories } from './useProjectCategories';
import { useProjectUrlParams } from './useProjectUrlParams';
import { useProjectFormInit } from './useProjectFormInit';

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

  const {
    selectedCategory,
    setSelectedCategory,
    subcategories,
    setSubcategories,
    useCustomCategory,
    setUseCustomCategory
  } = useProjectCategories({ getSubcategories });

  useProjectUrlParams(form.setValue);

  useProjectFormInit({
    selectedProject,
    reset: form.reset,
    setSelectedCategory,
    getSubcategories
  });

  const handleSubmit = (data: ProjectFormValues) => {
    if (useCustomCategory && data.customCategory) {
      data.categoryId = data.customCategory;
    }
    onSubmit(data);
  };

  return {
    form,
    handleSubmit,
    useCustomCategory,
    setUseCustomCategory,
    selectedCategory,
    setSelectedCategory,
    subcategories,
    setSubcategories
  };
};
