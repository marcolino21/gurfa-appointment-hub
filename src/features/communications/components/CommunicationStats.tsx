
import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';

// Mock data for statistics
const monthlyData = [
  { name: 'Gen', email: 65, sms: 25, whatsapp: 10 },
  { name: 'Feb', email: 59, sms: 30, whatsapp: 15 },
  { name: 'Mar', email: 80, sms: 40, whatsapp: 20 },
  { name: 'Apr', email: 81, sms: 35, whatsapp: 25 },
  { name: 'Mag', email: 56, sms: 45, whatsapp: 30 },
  { name: 'Giu', email: 55, sms: 40, whatsapp: 35 },
  { name: 'Lug', email: 40, sms: 35, whatsapp: 40 },
];

const engagementData = [
  { name: 'Email', inviate: 345, aperte: 178, cliccate: 89 },
  { name: 'SMS', inviate: 250, aperte: 240, cliccate: 0 },
  { name: 'WhatsApp', inviate: 150, aperte: 145, cliccate: 78 },
];

const CommunicationStats: React.FC = () => {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Andamento Comunicazioni</CardTitle>
          <CardDescription>
            Numero di comunicazioni inviate per canale negli ultimi mesi
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={monthlyData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="email" stroke="#8884d8" activeDot={{ r: 8 }} />
                <Line type="monotone" dataKey="sms" stroke="#82ca9d" />
                <Line type="monotone" dataKey="whatsapp" stroke="#ffc658" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Tasso di Coinvolgimento</CardTitle>
          <CardDescription>
            Confronto tra comunicazioni inviate, aperte e cliccate per canale
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={engagementData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="inviate" fill="#8884d8" name="Inviate" />
                <Bar dataKey="aperte" fill="#82ca9d" name="Aperte" />
                <Bar dataKey="cliccate" fill="#ffc658" name="Cliccate" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CommunicationStats;
