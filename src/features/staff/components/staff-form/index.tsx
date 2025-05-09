
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { StaffFormValues, staffSchema } from '../../types';
import { Form } from '@/components/ui/form';
import FormTabs from './FormTabs';
import FormFooter from './FormFooter';
import { StaffFormProps } from './types';

const StaffForm: React.FC<StaffFormProps> = ({ 
  defaultValues,
  services,
  onSubmit,
  isEdit = false
}) => {
  const [activeTab, setActiveTab] = useState('profilo');

  const staffForm = useForm<StaffFormValues>({
    resolver: zodResolver(staffSchema),
    defaultValues: defaultValues || {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      additionalPhone: '',
      country: 'Italia',
      birthDate: '',
      position: '',
      color: '#9b87f5',
      isActive: true,
      showInCalendar: true,
      assignedServiceIds: [],
    },
    mode: 'onChange' // Enable validation on change
  });

  const handleSubmit = async (data: StaffFormValues) => {
    console.log('Submitting form with data:', data);
    await onSubmit(data);
  };

  return (
    <Form {...staffForm}>
      <form onSubmit={staffForm.handleSubmit(handleSubmit)} className="space-y-4">
        <FormTabs 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          form={staffForm} 
          services={services} 
        />
        <FormFooter isEdit={isEdit} form={staffForm} />
      </form>
    </Form>
  );
};

export default StaffForm;
