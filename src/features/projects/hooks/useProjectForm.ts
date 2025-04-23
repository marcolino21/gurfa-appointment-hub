
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { useLocation } from 'react-router-dom';
import { projectSchema } from '../schemas/projectSchema';
import { Client, Project, ProjectCategory, ProjectFormValues } from '@/types';

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
  const location = useLocation();
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [subcategories, setSubcategories] = useState<ProjectCategory[]>([]);
  const [useCustomCategory, setUseCustomCategory] = useState(false);

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: selectedProject?.title || '',
      clientId: selectedProject?.clientId || '',
      categoryId: selectedProject?.categoryId || '',
      subcategoryId: selectedProject?.subcategoryId || '',
      description: selectedProject?.description || '',
      objectives: selectedProject?.objectives.map(obj => ({
        description: obj.description,
        isCompleted: obj.isCompleted
      })) || [{ description: '', isCompleted: false }],
      startDate: selectedProject?.startDate || format(new Date(), 'yyyy-MM-dd'),
      endDate: selectedProject?.endDate || '',
      status: selectedProject?.status || 'planning',
      progress: selectedProject?.progress || 0,
      feedback: selectedProject?.feedback || '',
      staffIds: selectedProject?.staffIds || [],
      customFields: selectedProject?.customFields || [],
      customCategory: '',
    }
  });

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const clientId = params.get('clientId');
    
    if (clientId) {
      form.setValue('clientId', clientId);
    }
  }, [location.search, form]);

  useEffect(() => {
    if (selectedProject) {
      form.reset({
        title: selectedProject.title,
        clientId: selectedProject.clientId,
        categoryId: selectedProject.categoryId,
        subcategoryId: selectedProject.subcategoryId,
        description: selectedProject.description,
        objectives: selectedProject.objectives.map(obj => ({
          description: obj.description,
          isCompleted: obj.isCompleted
        })),
        startDate: selectedProject.startDate,
        endDate: selectedProject.endDate,
        status: selectedProject.status,
        progress: selectedProject.progress,
        feedback: selectedProject.feedback,
        staffIds: selectedProject.staffIds,
        customFields: selectedProject.customFields,
        customCategory: '',
      });
      
      if (selectedProject.categoryId) {
        setSelectedCategory(selectedProject.categoryId);
        setSubcategories(getSubcategories(selectedProject.categoryId));
      }
    }
  }, [selectedProject, form, getSubcategories]);

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
