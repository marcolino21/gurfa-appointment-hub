
import { useEffect } from 'react';
import { UseFormReset } from 'react-hook-form';
import { Project, ProjectCategory, ProjectFormValues } from '@/types';

interface UseProjectFormInitProps {
  selectedProject: Project | null;
  reset: UseFormReset<ProjectFormValues>;
  setSelectedCategory: (categoryId: string) => void;
  getSubcategories: (categoryId: string) => ProjectCategory[];
}

export const useProjectFormInit = ({
  selectedProject,
  reset,
  setSelectedCategory,
  getSubcategories
}: UseProjectFormInitProps) => {
  
  useEffect(() => {
    if (selectedProject) {
      // Reset form with selected project values
      reset({
        title: selectedProject.title,
        clientId: selectedProject.clientId,
        categoryId: selectedProject.categoryId,
        subcategoryId: selectedProject.subcategoryId || '',
        description: selectedProject.description || '',
        objectives: selectedProject.objectives.map(obj => ({
          description: obj.description,
          isCompleted: obj.isCompleted
        })),
        startDate: selectedProject.startDate,
        endDate: selectedProject.endDate || '',
        status: selectedProject.status,
        progress: selectedProject.progress,
        feedback: selectedProject.feedback || '',
        staffIds: selectedProject.staffIds,
        customFields: selectedProject.customFields || [],
        customCategory: ''
      });
      
      // Set selected category for subcategory loading
      setSelectedCategory(selectedProject.categoryId);
    }
  }, [selectedProject, reset, setSelectedCategory, getSubcategories]);
};
