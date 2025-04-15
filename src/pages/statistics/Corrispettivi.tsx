
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileUp } from "lucide-react";

const Corrispettivi: React.FC = () => {
  const [periodo, setPeriodo] = useState('ultimo-mese');
  const [settore, setSettore] = useState('tutti');
  
  // Dati di esempio per i corrispettivi
  const corrispettivi = [
    { data: '29/03/2025', lordoImporto: 0, nettoImporto: 0, serviziImporto: 0, rivenditaImporto: 0, promozioniImporto: 0 },
    { data: '28/03/2025', lordoImporto: 145, nettoImporto: 118.85, serviziImporto: 145, rivenditaImporto: 0, promozioniImporto: 0 },
    { data: '27/03/2025', lordoImporto: 50, nettoImporto: 40.98, serviziImporto: 50, rivenditaImporto: 0, promozioniImporto: 0 },
    { data: '26/03/2025', lordoImporto: 0, nettoImporto: 0, serviziImporto: 0, rivenditaImporto: 0, promozioniImporto: 0 },
    { data: '25/03/2025', lordoImporto: 0, nettoImporto: 0, serviziImporto: 0, rivenditaImporto: 0, promozioniImporto: 0 },
    { data: '22/03/2025', lordoImporto: 83, nettoImporto: 68.03, serviziImporto: 50, rivenditaImporto: 33, promozioniImporto: 0 },
    { data: '21/03/2025', lordoImporto: 235, nettoImporto: 192.62, serviziImporto: 235, rivenditaImporto: 0, promozioniImporto: 0 },
    { data: '20/03/2025', lordoImporto: 160, nettoImporto: 131.14, serviziImporto: 160, rivenditaImporto: 0, promozioniImporto: 0 }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">Corrispettivi</h1>
        <div className="flex space-x-2">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Periodo:</span>
            <Select defaultValue={periodo} onValueChange={setPeriodo}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Seleziona periodo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ultimo-mese">Ultimo mese</SelectItem>
                <SelectItem value="ultimo-trimestre">Ultimo trimestre</SelectItem>
                <SelectItem value="ultimo-anno">Ultimo anno</SelectItem>
                <SelectItem value="personalizzato">Personalizzato</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Settore:</span>
            <Select defaultValue={settore} onValueChange={setSettore}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Seleziona settore" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="tutti">Tutti</SelectItem>
                <SelectItem value="parrucchiere">Parrucchiere</SelectItem>
                <SelectItem value="estetica">Estetica</SelectItem>
                <SelectItem value="massaggi">Massaggi</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Button variant="outline">
            <FileUp className="mr-2 h-4 w-4" />
            Esporta CSV
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>GG</TableHead>
                <TableHead>IMP. LORDO</TableHead>
                <TableHead>IMP. NETTO</TableHead>
                <TableHead>IMP. SERVIZI</TableHead>
                <TableHead>IMP. RIVENDITA</TableHead>
                <TableHead>IMP. PROMOZIONI</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {corrispettivi.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{item.data}</TableCell>
                  <TableCell>€ {item.lordoImporto.toFixed(2)}</TableCell>
                  <TableCell>€ {item.nettoImporto.toFixed(2)}</TableCell>
                  <TableCell>€ {item.serviziImporto.toFixed(2)}</TableCell>
                  <TableCell>€ {item.rivenditaImporto.toFixed(2)}</TableCell>
                  <TableCell>€ {item.promozioniImporto.toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Corrispettivi;
