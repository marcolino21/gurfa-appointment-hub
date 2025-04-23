
import { useEffect } from 'react';
import { UseFormReset } from 'react-hook-form';
import { Project, ProjectFormValues, ProjectCategory } from '@/types';

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
      reset({
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
      }
    }
  }, [selectedProject, reset, setSelectedCategory, getSubcategories]);
};
