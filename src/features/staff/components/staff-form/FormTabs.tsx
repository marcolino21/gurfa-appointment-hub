
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ProfileTab from './ProfileTab';
import ServicesTab from './ServicesTab';
import SettingsTab from './SettingsTab';
import { StaffFormProps } from './types';

const FormTabs: React.FC<{
  activeTab: string;
  setActiveTab: (tab: string) => void;
  form: any;
  services: any[];
}> = ({ activeTab, setActiveTab, form, services }) => {
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full grid-cols-1 md:grid-cols-3">
        <TabsTrigger value="profilo">Profilo</TabsTrigger>
        <TabsTrigger value="servizi">Servizi</TabsTrigger>
        <TabsTrigger value="impostazioni">Impostazioni</TabsTrigger>
      </TabsList>
      
      <TabsContent value="profilo" className="space-y-4 mt-4">
        <ProfileTab form={form} />
      </TabsContent>

      <TabsContent value="servizi" className="space-y-4 mt-4">
        <ServicesTab form={form} services={services} />
      </TabsContent>

      <TabsContent value="impostazioni" className="space-y-4 mt-4">
        <SettingsTab form={form} />
      </TabsContent>
    </Tabs>
  );
};

export default FormTabs;
