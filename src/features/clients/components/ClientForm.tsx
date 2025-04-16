
import React, { useState } from 'react';
import { Form } from '@/components/ui/form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UseFormReturn } from 'react-hook-form';
import { ClientFormValues } from '../types';

import { 
  ClientTypeSelector,
  BusinessInformation,
  PersonalInformation,
  AdditionalDetails,
  FormActions
} from './client-form';

interface ClientFormProps {
  clientForm: UseFormReturn<ClientFormValues>;
  onSubmit: (data: ClientFormValues, createProject?: boolean) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedClient: any | null;
}

const ClientForm: React.FC<ClientFormProps> = ({
  clientForm,
  onSubmit,
  activeTab,
  setActiveTab,
  selectedClient
}) => {
  // Get the current value of isPrivate to conditionally render fields
  const isPrivate = clientForm.watch('isPrivate');
  const [connectProject, setConnectProject] = useState(false);
  
  const handleSubmit = (data: ClientFormValues) => {
    onSubmit(data, connectProject);
    setConnectProject(false);
  };
  
  return (
    <Form {...clientForm}>
      <form onSubmit={clientForm.handleSubmit(handleSubmit)} className="space-y-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-1 md:grid-cols-2">
            <TabsTrigger value="dati-personali">Dati Personali</TabsTrigger>
            <TabsTrigger value="dettagli-aggiuntivi">Dettagli Aggiuntivi</TabsTrigger>
          </TabsList>
          
          <TabsContent value="dati-personali" className="space-y-4 mt-4">
            <ClientTypeSelector clientForm={clientForm} />

            <div className="space-y-4">
              {!isPrivate && <BusinessInformation clientForm={clientForm} />}
              <PersonalInformation clientForm={clientForm} isPrivate={isPrivate} />
            </div>
          </TabsContent>

          <TabsContent value="dettagli-aggiuntivi" className="space-y-4 mt-4">
            <AdditionalDetails clientForm={clientForm} isPrivate={isPrivate} />
          </TabsContent>
        </Tabs>

        <FormActions 
          selectedClient={selectedClient} 
          onConnectProject={() => setConnectProject(true)}
        />
      </form>
    </Form>
  );
};

export default ClientForm;
