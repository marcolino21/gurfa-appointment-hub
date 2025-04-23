
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { PersonalInfoFields } from './form-fields/PersonalInfoFields';
import { ContactInfoFields } from './form-fields/ContactInfoFields';
import { BusinessInfoFields } from './form-fields/BusinessInfoFields';
import { AddressFields } from './form-fields/AddressFields';
import { freelanceFormSchema } from '../schemas/freelanceFormSchema';
import type { FreelanceFormData } from '../types';

interface FreelanceFormProps {
  onSubmit: (data: FreelanceFormData) => Promise<void>;
  initialData?: Partial<FreelanceFormData>;
  isSubmitting?: boolean;
}

export const FreelanceForm = ({ onSubmit, initialData, isSubmitting }: FreelanceFormProps) => {
  const form = useForm<FreelanceFormData>({
    resolver: zodResolver(freelanceFormSchema),
    defaultValues: initialData || {},
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <PersonalInfoFields form={form} />
        <ContactInfoFields form={form} />
        <BusinessInfoFields form={form} />
        <AddressFields form={form} />
        
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Salvataggio...' : 'Salva'}
        </Button>
      </form>
    </Form>
  );
};
