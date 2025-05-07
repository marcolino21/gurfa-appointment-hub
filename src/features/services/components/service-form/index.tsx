
import React, { useState, useEffect } from 'react';
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
  // Check if the selected service uses a custom category (not found in categories list)
  const isCustomCategory = selectedService && 
    categories.every(cat => cat.id !== selectedService.category);

  const [useCustomCategory, setUseCustomCategory] = useState(!!isCustomCategory);

  const serviceForm = useForm<ServiceFormValues>({
    resolver: zodResolver(serviceSchema),
    defaultValues: selectedService ? {
      name: selectedService.name,
      category: isCustomCategory ? '' : selectedService.category,
      customCategory: isCustomCategory ? selectedService.category : '',
      description: selectedService.description || '',
      duration: selectedService.duration,
      tempoDiPosa: selectedService.tempoDiPosa || 0,
      price: selectedService.price,
      color: selectedService.color,
      assignedStaffIds: selectedService.assignedStaffIds || [],
    } : {
      name: '',
      category: categories.length > 0 ? categories[0].id : '',
      customCategory: '',
      description: '',
      duration: 30,
      tempoDiPosa: 0,
      price: 0,
      color: categories.length > 0 ? categories[0].color : '#9b87f5',
      assignedStaffIds: [],
    }
  });

  // When changing between custom/non-custom, update validation
  useEffect(() => {
    if (useCustomCategory) {
      serviceForm.clearErrors('category');
    } else {
      serviceForm.clearErrors('customCategory');
    }
  }, [useCustomCategory, serviceForm]);

  const handleSubmit = (data: ServiceFormValues) => {
    onSubmit(data);
  };

  return (
    <Form {...serviceForm}>
      <form onSubmit={serviceForm.handleSubmit(handleSubmit)} className="space-y-4">
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
