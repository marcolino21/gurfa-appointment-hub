
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Service, ServiceCategory, StaffMember } from '@/types';
import { ServiceFormValues, serviceSchema } from '../../types';
import { Form } from '@/components/ui/form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ServiceBasicDetailsTab } from './ServiceBasicDetailsTab';
import { ServiceStaffTab } from './ServiceStaffTab';
import { ServiceFormFooter } from './ServiceFormFooter';

export { ServiceBasicDetailsTab } from './ServiceBasicDetailsTab';
export { ServiceStaffTab } from './ServiceStaffTab';
export { ServiceFormFooter } from './ServiceFormFooter';

interface ServiceFormProps {
  categories: ServiceCategory[];
  staffMembers: StaffMember[];
  selectedService: Service | null;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onSubmit: (data: ServiceFormValues) => void;
}

export const ServiceForm: React.FC<ServiceFormProps> = ({ 
  categories, 
  staffMembers, 
  selectedService, 
  activeTab,
  setActiveTab,
  onSubmit 
}) => {
  const [useCustomCategory, setUseCustomCategory] = useState(false);

  const serviceForm = useForm<ServiceFormValues>({
    resolver: zodResolver(serviceSchema),
    defaultValues: selectedService ? {
      name: selectedService.name,
      category: selectedService.category,
      description: selectedService.description || '',
      duration: selectedService.duration,
      tempoDiPosa: selectedService.tempoDiPosa || 0,
      price: selectedService.price,
      color: selectedService.color,
      assignedStaffIds: selectedService.assignedStaffIds || [],
      customCategory: '',
    } : {
      name: '',
      category: categories.length > 0 ? categories[0].id : '',
      description: '',
      duration: 30,
      tempoDiPosa: 0,
      price: 0,
      color: categories.length > 0 ? categories[0].color : '#9b87f5',
      assignedStaffIds: [],
      customCategory: '',
    }
  });

  return (
    <Form {...serviceForm}>
      <form onSubmit={serviceForm.handleSubmit(onSubmit)} className="space-y-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-1 md:grid-cols-2">
            <TabsTrigger value="dettagli">Dettagli di base</TabsTrigger>
            <TabsTrigger value="staff">Membri del team</TabsTrigger>
          </TabsList>
          
          <TabsContent value="dettagli" className="space-y-4 mt-4">
            <ServiceBasicDetailsTab 
              serviceForm={serviceForm} 
              categories={categories}
              useCustomCategory={useCustomCategory}
              setUseCustomCategory={setUseCustomCategory}
            />
          </TabsContent>

          <TabsContent value="staff" className="space-y-4 mt-4">
            <ServiceStaffTab 
              serviceForm={serviceForm} 
              staffMembers={staffMembers}
            />
          </TabsContent>
        </Tabs>

        <ServiceFormFooter isEditing={!!selectedService} />
      </form>
    </Form>
  );
};

export default ServiceForm;
