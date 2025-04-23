
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns'; // Add this import
import { projectSchema } from '../schemas/projectSchema';
import { Client, Project, ProjectCategory, StaffMember, ProjectFormValues } from '@/types';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { useLocation } from 'react-router-dom';

import { ProjectTitle } from './project-form/ProjectTitle';
import { ClientSelector } from './project-form/ClientSelector';
import { CustomCategoryField } from './CustomCategoryField';
import { ProjectDescription } from './project-form/ProjectDescription';
import { ProjectObjectives } from './project-form/ProjectObjectives';
import { ProjectDates } from './project-form/ProjectDates';
import { ProjectStatus } from './project-form/ProjectStatus';
import { ProjectFeedback } from './project-form/ProjectFeedback';

interface ProjectFormProps {
  clients: Client[];
  categories: ProjectCategory[];
  getSubcategories: (categoryId: string) => ProjectCategory[];
  staffMembers: StaffMember[];
  selectedProject: Project | null;
  onSubmit: (data: ProjectFormValues) => void;
}

const ProjectForm: React.FC<ProjectFormProps> = ({
  clients,
  categories,
  getSubcategories,
  staffMembers,
  selectedProject,
  onSubmit
}) => {
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
      startDate: selectedProject?.startDate || format(new Date(), 'yyyy-MM-dd'), // Corrected this line
      endDate: selectedProject?.endDate || '',
      status: selectedProject?.status || 'planning',
      progress: selectedProject?.progress || 0,
      feedback: selectedProject?.feedback || '',
      staffIds: selectedProject?.staffIds || [],
      customFields: selectedProject?.customFields || [],
      customCategory: '',
    }
  });

  // Check for clientId in URL query params
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

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <ProjectTitle form={form} />
        <ClientSelector form={form} clients={clients} />
        <CustomCategoryField
          form={form}
          categories={categories}
          useCustomCategory={useCustomCategory}
          setUseCustomCategory={setUseCustomCategory}
        />
        <ProjectDescription form={form} />
        <ProjectObjectives form={form} />
        <ProjectDates form={form} />
        <ProjectStatus form={form} />
        <ProjectFeedback form={form} />
        
        <div className="flex justify-end space-x-2">
          <Button type="submit">
            {selectedProject ? 'Aggiorna Progetto' : 'Crea Progetto'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ProjectForm;
