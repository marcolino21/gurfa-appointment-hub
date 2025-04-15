
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Facebook, Instagram, MessageSquare } from "lucide-react";

const ShowcaseSettings = () => {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Social</h2>
        <Card>
          <CardContent className="p-6">
            <div className="text-center mb-8">
              <div className="flex justify-center gap-4 mb-6">
                <Facebook className="h-8 w-8 text-blue-600" />
                <Instagram className="h-8 w-8 text-pink-600" />
                <MessageSquare className="h-8 w-8 text-purple-600" />
              </div>
              <p className="max-w-2xl mx-auto">
                Collega il gestionale con i profili social del tuo salone e permetti ai tuoi clienti di prenotarti direttamente da Facebook, Instagram e Messenger.
              </p>
              <Button className="mt-4">CONNETTI</Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Estensioni della prenotazione</h2>
        <Card>
          <CardContent className="p-6 space-y-8">
            <div>
              <h3 className="text-lg font-medium text-center mb-6 uppercase">LINK DI PRENOTAZIONE GRATUITA (APP)</h3>
              <p className="text-center max-w-2xl mx-auto mb-6">
                Copia questo link e condividilo sul tuo sito web, nei messaggi, nelle e-mail di marketing e nella firma e-mail per ricevere gratuitamente le prenotazioni dall'App Gurfa.
              </p>
              <p className="text-center text-blue-500 mb-6">
                <a href="#" className="underline">Scopri di più</a>
              </p>
              <div className="flex max-w-2xl mx-auto">
                <Input value="https://trea.tw/wtQY5pmuEbc5rcgm2" readOnly className="rounded-r-none" />
                <Button className="rounded-l-none">COPIA</Button>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-center mb-6 uppercase">LINK PER LA PRENOTAZIONE GRATUITA (WEB)</h3>
              <p className="text-center max-w-2xl mx-auto mb-6">
                Copia questo link e condividilo sul tuo sito web, nei messaggi, nelle e-mail di marketing e nella firma e-mail per ricevere prenotazioni gratuite dal Widget.
              </p>
              <p className="text-center text-blue-500 mb-6">
                <a href="#" className="underline">Scopri di più</a>
              </p>
              <div className="flex max-w-2xl mx-auto">
                <Input value="https://widget.gurfa.it/salone/100000248/menu/" readOnly className="rounded-r-none" />
                <Button className="rounded-l-none">COPIA</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Pagina profilo</h2>
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="business-description" className="block mb-2 text-center uppercase">DESCRIZIONE ATTIVITÀ</Label>
                <Textarea 
                  id="business-description" 
                  placeholder="Aggiungi una descrizione delle attività del tuo salone..." 
                  className="min-h-[120px] resize-none"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ShowcaseSettings;
