
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Pencil, Download } from "lucide-react";
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const ProfileSettings = () => {
  const { user, currentSalonId, salons } = useAuth();
  const currentSalon = salons.find(salon => salon.id === currentSalonId);
  
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="flex-shrink-0">
          <Avatar className="w-24 h-24">
            <AvatarImage src="/lovable-uploads/af963a36-81dd-4b66-ae94-4567f5f8d150.png" alt={currentSalon?.name} />
            <AvatarFallback>{currentSalon?.name?.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
        </div>
        
        <div className="flex-1 space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h2 className="text-2xl font-semibold">{currentSalon?.name || "Gurfa Beauty Concept"}</h2>
              <p className="text-sm text-muted-foreground">
                Via Fiume Giallo, 405, 00144 Roma, Italia
              </p>
              <a href="#" className="text-sm text-blue-500 hover:underline">VEDI PROFILO ONLINE</a>
            </div>
            <div className="flex items-center gap-2 mt-4 md:mt-0">
              <Button variant="outline" size="icon">
                <Pencil className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon">
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="ragione-sociale">RAGIONE SOCIALE</Label>
              <Input id="ragione-sociale" value="Terea Srls" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="telefono">TELEFONO</Label>
              <Input id="telefono" value="+390654218124" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">EMAIL</Label>
              <Input id="email" value="silvestrellimaro@hotmail.it" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="piva">P.IVA</Label>
              <Input id="piva" value="17187741008" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="iban">IBAN</Label>
              <Input id="iban" placeholder="Inserisci IBAN" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="codice-fiscale">CODICE FISCALE</Label>
              <Input id="codice-fiscale" placeholder="Inserisci codice fiscale" />
            </div>
            <div className="space-y-2 col-span-2">
              <Label htmlFor="sede-legale">SEDE LEGALE</Label>
              <Input id="sede-legale" value="Via Fiume Giallo, 405, 00143 Roma RM, Italy" />
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <h3 className="text-xl font-semibold">Piani Attivi</h3>
        <Card className="bg-blue-500 text-white">
          <CardContent className="p-6 flex justify-between items-center">
            <div>
              <p className="text-sm font-medium opacity-80">SERVIZIO BASE</p>
              <h4 className="text-2xl font-bold mt-1">IT PREMIUM</h4>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium opacity-80">ATTIVAZIONE</p>
              <p className="text-lg font-semibold">30/06/2023</p>
            </div>
            <Button variant="secondary" size="sm" className="bg-green-400 hover:bg-green-500 text-white border-none rounded-full">
              ATTIVO
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-white">
          <CardContent className="p-6 flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="bg-blue-100 p-3 rounded-lg">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect width="24" height="24" rx="4" fill="#E5DEFF"/>
                  <path d="M6 12L10 16L18 8" stroke="#8B5CF6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">SERVIZIO AGGIUNTIVO</p>
                <h4 className="text-lg font-semibold">Credito SMS</h4>
              </div>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground">ATTIVAZIONE</p>
              <p className="font-medium">10/03/2023</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground">DISPONIBILI</p>
              <p className="font-medium">2375 sms / 3.000</p>
            </div>
            <Button variant="secondary" size="sm" className="bg-green-400 hover:bg-green-500 text-white border-none rounded-full">
              ATTIVO
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-white">
          <CardContent className="p-6 flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="bg-blue-100 p-3 rounded-lg">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect width="24" height="24" rx="4" fill="#E5DEFF"/>
                  <path d="M6 12L10 16L18 8" stroke="#8B5CF6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">SERVIZIO AGGIUNTIVO</p>
                <h4 className="text-lg font-semibold">Credito Email</h4>
              </div>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground">ATTIVAZIONE</p>
              <p className="font-medium">08/07/2022</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground">DISPONIBILI</p>
              <p className="font-medium">5839 email / 5.866</p>
            </div>
            <Button variant="secondary" size="sm" className="bg-green-400 hover:bg-green-500 text-white border-none rounded-full">
              ATTIVO
            </Button>
          </CardContent>
        </Card>

        <div className="flex justify-center mt-2">
          <Button variant="outline">AGGIUNGI SERVIZI</Button>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;
