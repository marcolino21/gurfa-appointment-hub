
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const AnalisiAndamento: React.FC = () => {
  const [periodo, setPeriodo] = useState('ultimo-mese');
  const [settore, setSettore] = useState('tutti');

  // Dati di esempio per i grafici
  const revenueData = [
    { name: '01/03', ricavi: 2400, servizi: 2200, prodotti: 200, promozioni: 0 },
    { name: '05/03', ricavi: 1398, servizi: 1300, prodotti: 98, promozioni: 0 },
    { name: '10/03', ricavi: 9800, servizi: 9500, prodotti: 300, promozioni: 0 },
    { name: '15/03', ricavi: 3908, servizi: 3800, prodotti: 108, promozioni: 0 },
    { name: '20/03', ricavi: 4800, servizi: 4600, prodotti: 200, promozioni: 0 },
    { name: '25/03', ricavi: 3800, servizi: 3500, prodotti: 300, promozioni: 0 },
    { name: '31/03', ricavi: 4300, servizi: 4000, prodotti: 300, promozioni: 0 },
  ];

  const pieData = [
    { name: 'Servizi', value: 2909.05 },
    { name: 'Prodotti', value: 33.00 },
    { name: 'Promozioni', value: 0 },
  ];

  const serviceData = [
    { name: 'Colore', count: 12, amount: 696.25, percentage: 14 },
    { name: 'Piega', count: 24, amount: 638.80, percentage: 28 },
    { name: 'Manicure', count: 14, amount: 633.00, percentage: 17 },
    { name: 'Taglio', count: 8, amount: 385.00, percentage: 10 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">Analisi Andamento</h1>
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
      
      {/* Riassunto ricavi */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">RICAVI TOTALI</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-500">€ 2.942,05</div>
            <div className="h-10 w-full mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={revenueData}>
                  <Line type="monotone" dataKey="ricavi" stroke="#8884d8" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">SERVIZI</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-500">€ 2.909,05</div>
            <div className="h-10 w-full mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={revenueData}>
                  <Line type="monotone" dataKey="servizi" stroke="#82ca9d" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">PRODOTTI</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-500">€ 33,00</div>
            <div className="h-10 w-full mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={revenueData}>
                  <Line type="monotone" dataKey="prodotti" stroke="#ffc658" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">PROMOZIONI</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-500">€ 0,00</div>
            <div className="h-10 w-full mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={revenueData}>
                  <Line type="monotone" dataKey="promozioni" stroke="#ff7300" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Andamento Ricavi</CardTitle>
            <CardDescription>Analisi dei ricavi nel periodo</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={revenueData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="ricavi" name="Ricavi Totali" stroke="#8884d8" activeDot={{ r: 8 }} />
                  <Line type="monotone" dataKey="servizi" name="Servizi" stroke="#82ca9d" />
                  <Line type="monotone" dataKey="prodotti" name="Prodotti" stroke="#ffc658" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Distribuzione Ricavi</CardTitle>
            <CardDescription>Ripartizione dei ricavi per categoria</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `€ ${value.toFixed(2)}`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Servizi più Venduti</CardTitle>
          <CardDescription>I servizi che generano più ricavi</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={serviceData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                <Tooltip />
                <Legend />
                <Bar yAxisId="left" dataKey="count" name="Numero prenotazioni" fill="#8884d8" />
                <Bar yAxisId="right" dataKey="amount" name="Importo (€)" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">FICHE MEDIA</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">€ 7,64</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">SERVIZI PER FICHE</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">2,42</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">PRESENZE TOTALI</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">385</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AnalisiAndamento;
