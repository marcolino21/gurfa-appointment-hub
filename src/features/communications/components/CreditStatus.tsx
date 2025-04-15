
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreditPackage } from '../types';
import { useToast } from '@/hooks/use-toast';
import CreditPackageCard from './CreditPackageCard';

// Mock data for credit packages
const creditPackages: CreditPackage[] = [
  {
    id: 'email-basic',
    name: 'Base Email',
    description: '1000 email con tracciamento lettura',
    type: 'email',
    credits: 1000,
    price: 29,
  },
  {
    id: 'email-premium',
    name: 'Premium Email',
    description: '5000 email con tracciamento completo',
    type: 'email',
    credits: 5000,
    price: 99,
    discount: 30,
  },
  {
    id: 'sms-base',
    name: 'SMS Base',
    description: '100 SMS semplici',
    type: 'sms',
    credits: 100,
    price: 9.90,
  },
  {
    id: 'sms-pro',
    name: 'SMS Pro',
    description: '500 SMS con report consegna',
    type: 'sms',
    credits: 500,
    price: 39.90,
    discount: 20,
  },
  {
    id: 'whatsapp-base',
    name: 'WhatsApp Base',
    description: '100 messaggi WhatsApp Business',
    type: 'whatsapp',
    credits: 100,
    price: 19.90,
  },
  {
    id: 'whatsapp-pro',
    name: 'WhatsApp Pro',
    description: '500 messaggi con statistiche complete',
    type: 'whatsapp',
    credits: 500,
    price: 79.90,
    discount: 20,
  },
];

const CreditStatus: React.FC = () => {
  const { toast } = useToast();
  const [selectedPackage, setSelectedPackage] = React.useState<CreditPackage | null>(null);
  
  // Mock credit data
  const credits = {
    email: { used: 650, total: 1000 },
    sms: { used: 45, total: 100 },
    whatsapp: { used: 20, total: 100 },
  };

  const handlePurchase = () => {
    if (!selectedPackage) return;
    
    toast({
      title: "Acquisto effettuato",
      description: `Hai acquistato il pacchetto ${selectedPackage.name}. I crediti sono stati aggiunti al tuo account.`,
    });
  };

  return (
    <div>
      <div className="grid grid-cols-3 gap-4">
        <CreditTypeStatus 
          type="email" 
          icon="📧" 
          used={credits.email.used} 
          total={credits.email.total} 
        />
        <CreditTypeStatus 
          type="sms" 
          icon="💬" 
          used={credits.sms.used} 
          total={credits.sms.total} 
        />
        <CreditTypeStatus 
          type="whatsapp" 
          icon="📱" 
          used={credits.whatsapp.used} 
          total={credits.whatsapp.total} 
        />
      </div>

      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" className="w-full mt-4">
            <Plus className="w-4 h-4 mr-2" /> Acquista crediti
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Acquista Crediti</DialogTitle>
            <DialogDescription>
              Scegli un pacchetto per inviare comunicazioni ai tuoi clienti
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="email" className="mt-4">
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="email">Email</TabsTrigger>
              <TabsTrigger value="sms">SMS</TabsTrigger>
              <TabsTrigger value="whatsapp">WhatsApp</TabsTrigger>
            </TabsList>
            
            <TabsContent value="email">
              <div className="grid md:grid-cols-2 gap-4">
                {creditPackages.filter(pkg => pkg.type === 'email').map(pkg => (
                  <CreditPackageCard 
                    key={pkg.id}
                    package={pkg}
                    isSelected={selectedPackage?.id === pkg.id}
                    onSelect={() => setSelectedPackage(pkg)}
                  />
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="sms">
              <div className="grid md:grid-cols-2 gap-4">
                {creditPackages.filter(pkg => pkg.type === 'sms').map(pkg => (
                  <CreditPackageCard 
                    key={pkg.id}
                    package={pkg}
                    isSelected={selectedPackage?.id === pkg.id}
                    onSelect={() => setSelectedPackage(pkg)}
                  />
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="whatsapp">
              <div className="grid md:grid-cols-2 gap-4">
                {creditPackages.filter(pkg => pkg.type === 'whatsapp').map(pkg => (
                  <CreditPackageCard 
                    key={pkg.id}
                    package={pkg}
                    isSelected={selectedPackage?.id === pkg.id}
                    onSelect={() => setSelectedPackage(pkg)}
                  />
                ))}
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter>
            <Button 
              onClick={handlePurchase} 
              disabled={!selectedPackage}
            >
              {selectedPackage 
                ? `Acquista a €${selectedPackage.price.toFixed(2)}`
                : 'Seleziona un pacchetto'
              }
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

interface CreditTypeStatusProps {
  type: string;
  icon: string;
  used: number;
  total: number;
}

const CreditTypeStatus: React.FC<CreditTypeStatusProps> = ({ type, icon, used, total }) => {
  const percentage = Math.round((used / total) * 100);
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center">
            <span className="mr-2">{icon}</span>
            <span className="text-sm font-medium capitalize">{type}</span>
          </div>
          <span className="text-xs text-muted-foreground">{used}/{total}</span>
        </div>
        <Progress value={percentage} className="h-2" />
      </CardContent>
    </Card>
  );
};

export default CreditStatus;
