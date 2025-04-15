
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const ReportAzienda: React.FC = () => {
  const [periodo, setPeriodo] = useState('ultimo-mese');
  const [settore, setSettore] = useState('tutti');

  // Dati di esempio per i report aziendali
  const data = [
    { name: 'Servizi', value: 2909.05 },
    { name: 'Prodotti', value: 33.00 },
    { name: 'Promozioni', value: 0 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">Report Azienda</h1>
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
        </div>
      </div>

      {/* Métriche principali */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">FICHE MEDIA</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center py-6">
            <div className="text-4xl font-bold">€ 7,64</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">RICAVI</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center py-6">
            <div className="text-4xl font-bold">€ 2.942,05</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">NUMERO PRESENZE</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center py-6">
            <div className="text-4xl font-bold">385</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">SERVIZI PER FICHE</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center py-6">
            <div className="text-4xl font-bold">2,42</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">MASCHI</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center py-6">
            <div className="text-4xl font-bold">11</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">FEMMINE</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center py-6">
            <div className="text-4xl font-bold">374</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>REDDITIVITÀ AZIENDA</CardTitle>
        </CardHeader>
        <CardContent className="flex gap-6">
          <div className="w-1/3">
            <div className="flex flex-col items-center">
              <p className="text-lg font-bold mb-4">TOTALE</p>
              <div className="h-48 w-48 mb-4">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={data}
                      cx="50%"
                      cy="50%"
                      outerRadius={60}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `€ ${value.toFixed(2)}`} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <p className="text-sm">385 Passaggi</p>
              <p className="text-xl font-bold">€ 2.942,05</p>
            </div>
          </div>

          <div className="w-1/3">
            <div className="flex flex-col items-center">
              <p className="text-lg font-bold text-blue-500 mb-4">SERVIZI</p>
              <p className="text-sm">385 Passaggi</p>
              <p className="text-xl font-bold">€ 2.909,05</p>
              <p className="text-sm text-muted-foreground">— 99%</p>
              <div className="mt-6">
                <p className="text-xs text-muted-foreground">% COLORE</p>
                <p className="font-bold">37%</p>
              </div>
              <div className="mt-4">
                <p className="text-xs text-muted-foreground">FICHE MEDIA</p>
                <p className="font-bold">€ 7,56</p>
              </div>
            </div>
          </div>

          <div className="w-1/3">
            <div className="flex flex-col items-center">
              <p className="text-lg font-bold text-orange-500 mb-4">PRODOTTI</p>
              <p className="text-sm">1 Passaggio</p>
              <p className="text-xl font-bold">€ 33,00</p>
              <p className="text-sm text-muted-foreground">— 1%</p>
              <div className="mt-6">
                <p className="text-xs text-muted-foreground">ACQUISTI SU PASSAGGI</p>
                <p className="font-bold">-</p>
              </div>
              <div className="mt-4">
                <p className="text-xs text-muted-foreground">FICHE MEDIA</p>
                <p className="font-bold">€ 33,00</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportAzienda;
