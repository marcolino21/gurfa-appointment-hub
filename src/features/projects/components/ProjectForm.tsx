import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { projectSchema } from '../schemas/projectSchema';
import { Client, Project, ProjectCategory, StaffMember, ProjectFormValues } from '@/types';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { ScrollArea } from '@/components/ui/scroll-area';

import { ProjectTitle } from './project-form/ProjectTitle';
import { ClientSelector } from './project-form/ClientSelector';
import { CustomCategoryField } from './CustomCategoryField';
import { ProjectDescription } from './project-form/ProjectDescription';
import { ProjectObjectives } from './project-form/ProjectObjectives';
import { ProjectDates } from './project-form/ProjectDates';
import { ProjectStatus } from './project-form/ProjectStatus';
import { ProjectFeedback } from './project-form/ProjectFeedback';
import { ProjectStaffSelector } from './project-form/ProjectStaffSelector';
import { useProjectForm } from '../hooks/useProjectForm';

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
  const { form, handleSubmit, useCustomCategory, setUseCustomCategory } = useProjectForm({
    clients,
    categories,
    getSubcategories,
    selectedProject,
    onSubmit
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="relative">
        <ScrollArea className="h-[calc(100vh-12rem)] px-1">
          <div className="space-y-6 pb-6">
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
            <ProjectStaffSelector form={form} staffMembers={staffMembers} />
            <ProjectFeedback form={form} />
          </div>
        </ScrollArea>
        
        <div className="sticky bottom-0 flex justify-end mt-4 py-4 px-1 bg-background border-t">
          <Button type="submit">
            {selectedProject ? 'Aggiorna Progetto' : 'Crea Progetto'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ProjectForm;
