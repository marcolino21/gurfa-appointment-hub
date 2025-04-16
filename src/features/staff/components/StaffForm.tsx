
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { StaffFormValues, staffSchema } from '../types';
import { Service } from '@/types';
import { Form } from '@/components/ui/form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Import our new components
import { ProfileTab, ServicesTab, SettingsTab, StaffFormActions } from './staff-form';
import WorkScheduleTab from './WorkScheduleTab';

type StaffFormProps = {
  defaultValues?: StaffFormValues;
  services: Service[];
  onSubmit: (data: StaffFormValues) => void;
  isEdit?: boolean;
};

const StaffForm: React.FC<StaffFormProps> = ({ 
  defaultValues,
  services,
  onSubmit,
  isEdit = false
}) => {
  const [activeTab, setActiveTab] = useState('profilo');

  // Initialize default values for work schedule if they don't exist
  const initialWorkSchedule = [
    { day: 'Lunedì', isWorking: false, startTime: '09:00', endTime: '18:00', breakStart: '13:00', breakEnd: '14:00' },
    { day: 'Martedì', isWorking: false, startTime: '09:00', endTime: '18:00', breakStart: '13:00', breakEnd: '14:00' },
    { day: 'Mercoledì', isWorking: false, startTime: '09:00', endTime: '18:00', breakStart: '13:00', breakEnd: '14:00' },
    { day: 'Giovedì', isWorking: false, startTime: '09:00', endTime: '18:00', breakStart: '13:00', breakEnd: '14:00' },
    { day: 'Venerdì', isWorking: false, startTime: '09:00', endTime: '18:00', breakStart: '13:00', breakEnd: '14:00' },
    { day: 'Sabato', isWorking: false, startTime: '09:00', endTime: '18:00', breakStart: '13:00', breakEnd: '14:00' },
    { day: 'Domenica', isWorking: false, startTime: '09:00', endTime: '18:00', breakStart: '13:00', breakEnd: '14:00' },
  ];

  const formDefaultValues = {
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
    workSchedule: initialWorkSchedule,
    ...defaultValues
  };

  const staffForm = useForm<StaffFormValues>({
    resolver: zodResolver(staffSchema),
    defaultValues: formDefaultValues
  });

  return (
    <Form {...staffForm}>
      <form onSubmit={staffForm.handleSubmit(onSubmit)} className="space-y-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-1 md:grid-cols-4">
            <TabsTrigger value="profilo">Profilo</TabsTrigger>
            <TabsTrigger value="servizi">Servizi</TabsTrigger>
            <TabsTrigger value="orario">Orario</TabsTrigger>
            <TabsTrigger value="impostazioni">Impostazioni</TabsTrigger>
          </TabsList>
          
          <TabsContent value="profilo" className="space-y-4 mt-4">
            <ProfileTab staffForm={staffForm} />
          </TabsContent>

          <TabsContent value="servizi" className="space-y-4 mt-4">
            <ServicesTab staffForm={staffForm} services={services} />
          </TabsContent>

          <TabsContent value="orario" className="space-y-4 mt-4">
            <WorkScheduleTab staffForm={staffForm} />
          </TabsContent>

          <TabsContent value="impostazioni" className="space-y-4 mt-4">
            <SettingsTab staffForm={staffForm} />
          </TabsContent>
        </Tabs>

        <StaffFormActions isEdit={isEdit} />
      </form>
    </Form>
  );
};

export default StaffForm;
