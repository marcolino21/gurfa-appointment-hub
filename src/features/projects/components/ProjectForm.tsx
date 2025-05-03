import React, { useState } from 'react';
import { Client, Project, ProjectCategory, StaffMember, ProjectFormValues } from '@/types';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { projectSchema } from '../schemas/projectSchema';
import { z } from 'zod';
import { format } from 'date-fns';

import { ProjectTitle } from './project-form/ProjectTitle';
import { ClientSelector } from './project-form/ClientSelector';
import { CustomCategoryField } from './CustomCategoryField';
import { ProjectDescription } from './project-form/ProjectDescription';
import { ProjectObjectives } from './project-form/ProjectObjectives';
import { ProjectDates } from './project-form/ProjectDates';
import { ProjectStatus } from './project-form/ProjectStatus';
import { ProjectFeedback } from './project-form/ProjectFeedback';
import { ProjectStaffSelector } from './project-form/ProjectStaffSelector';

interface ProjectFormProps {
  clients: Client[];
  categories: ProjectCategory[];
  getSubcategories: (categoryId: string) => ProjectCategory[];
  staffMembers: StaffMember[];
  selectedProject: Project | null;
  onSubmit: (data: ProjectFormValues) => void;
}

type FormValues = z.infer<typeof projectSchema>;

const ProjectForm: React.FC<ProjectFormProps> = ({
  clients,
  categories,
  getSubcategories,
  staffMembers,
  selectedProject,
  onSubmit
}) => {
  const [useCustomCategory, setUseCustomCategory] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [subcategories, setSubcategories] = useState<ProjectCategory[]>([]);

  const form = useForm<FormValues>({
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

  const handleSubmit = (data: FormValues) => {
    onSubmit(data as ProjectFormValues);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <ScrollArea className="h-[calc(100vh-200px)]">
          <div className="space-y-4 p-4">
            <ProjectTitle form={form} />
            <ClientSelector form={form} clients={clients} />
            <CustomCategoryField 
              form={form} 
              categories={categories}
              useCustomCategory={useCustomCategory}
              setUseCustomCategory={setUseCustomCategory}
              subcategories={subcategories}
            />
            <ProjectDescription form={form} />
            <ProjectObjectives form={form} />
            <ProjectDates form={form} />
            <ProjectStatus form={form} />
            <ProjectFeedback form={form} />
            <ProjectStaffSelector form={form} staffMembers={staffMembers} />
          </div>
        </ScrollArea>
        <div className="flex justify-end space-x-2 p-4">
          <Button type="submit">Salva</Button>
        </div>
      </form>
    </Form>
  );
};

export default ProjectForm;
