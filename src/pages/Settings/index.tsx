
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import ProfileSettings from './ProfileSettings';
import BillingSettings from './BillingSettings';
import GeneralSettings from './GeneralSettings';
import ShowcaseSettings from './ShowcaseSettings';
import UsersSettings from './UsersSettings';
import { useAuth } from '@/contexts/AuthContext';
import ActivityDialog from '@/components/ActivityDialog';

const Settings = () => {
  const { user } = useAuth();
  const [isActivityDialogOpen, setIsActivityDialogOpen] = useState(false);
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Impostazioni</h1>
        <p className="text-muted-foreground">
          Gestisci il profilo, fatturazione, impostazioni generali, vetrina e utenti.
        </p>
      </div>

      <Card>
        <CardContent className="p-0">
          <Tabs defaultValue="activity" className="w-full">
            <TabsList className="w-full justify-start border-b rounded-none px-4 bg-transparent h-auto">
              <Button 
                variant="ghost" 
                className="mr-4 py-3" 
                onClick={() => setIsActivityDialogOpen(true)}
              >
                <PlusCircle className="mr-2 h-4 w-4" /> Aggiungi attività
              </Button>
              <TabsTrigger value="profile" className="py-3 data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none">
                Profilo
              </TabsTrigger>
              <TabsTrigger value="billing" className="py-3 data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none">
                Fatturazione
              </TabsTrigger>
              <TabsTrigger value="general" className="py-3 data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none">
                Impostazioni
              </TabsTrigger>
              <TabsTrigger value="showcase" className="py-3 data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none">
                Vetrina
              </TabsTrigger>
              <TabsTrigger value="users" className="py-3 data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none">
                Utenti
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="activity" className="p-6">
              <div className="text-center py-12">
                <p className="text-muted-foreground">Clicca sul pulsante "Aggiungi attività" per iniziare</p>
              </div>
            </TabsContent>

            <TabsContent value="profile" className="p-6">
              <ProfileSettings />
            </TabsContent>
            
            <TabsContent value="billing" className="p-6">
              <BillingSettings />
            </TabsContent>
            
            <TabsContent value="general" className="p-6">
              <GeneralSettings />
            </TabsContent>
            
            <TabsContent value="showcase" className="p-6">
              <ShowcaseSettings />
            </TabsContent>
            
            <TabsContent value="users" className="p-6">
              <UsersSettings />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <ActivityDialog 
        open={isActivityDialogOpen} 
        onOpenChange={setIsActivityDialogOpen} 
      />
    </div>
  );
};

export default Settings;
