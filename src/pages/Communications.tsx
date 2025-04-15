
import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import { Plus, Mail, MessageSquare, Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import CommunicationsList from '@/features/communications/components/CommunicationsList';
import NewCommunicationDialog from '@/features/communications/components/NewCommunicationDialog';
import CommunicationStats from '@/features/communications/components/CommunicationStats';

const Communications = () => {
  const [isNewCommunicationOpen, setIsNewCommunicationOpen] = useState(false);
  const { toast } = useToast();
  
  const handleNewCommunication = () => {
    setIsNewCommunicationOpen(true);
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Comunicazioni</h1>
        <Button onClick={handleNewCommunication}>
          <Plus className="h-4 w-4 mr-2" /> Nuova Comunicazione
        </Button>
      </div>

      <div className="grid gap-6 mb-6">
        <CommunicationStats />
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">Tutte</TabsTrigger>
          <TabsTrigger value="email">Email</TabsTrigger>
          <TabsTrigger value="sms">SMS</TabsTrigger>
          <TabsTrigger value="whatsapp">WhatsApp</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all">
          <Card>
            <CardHeader>
              <CardTitle>Tutte le comunicazioni</CardTitle>
            </CardHeader>
            <CardContent>
              <CommunicationsList type="all" />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="email">
          <Card>
            <CardHeader>
              <CardTitle>Comunicazioni Email</CardTitle>
            </CardHeader>
            <CardContent>
              <CommunicationsList type="email" />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="sms">
          <Card>
            <CardHeader>
              <CardTitle>Comunicazioni SMS</CardTitle>
            </CardHeader>
            <CardContent>
              <CommunicationsList type="sms" />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="whatsapp">
          <Card>
            <CardHeader>
              <CardTitle>Comunicazioni WhatsApp</CardTitle>
            </CardHeader>
            <CardContent>
              <CommunicationsList type="whatsapp" />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <NewCommunicationDialog 
        open={isNewCommunicationOpen} 
        onOpenChange={setIsNewCommunicationOpen} 
      />
    </div>
  );
};

export default Communications;
