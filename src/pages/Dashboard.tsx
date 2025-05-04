
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Calendar, CheckCircle, Clock } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const DashboardCard: React.FC<{
  title: string;
  value: string | number;
  description: string;
  icon: React.ReactNode;
  color: string;
}> = ({ title, value, description, icon, color }) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className={`p-2 rounded-md ${color}`}>
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
};

const Dashboard: React.FC = () => {
  const { user, currentSalonId, salons } = useAuth();
  
  const currentSalon = salons.find(salon => salon.id === currentSalonId);
  
  // Mock data since AppointmentContext has been removed
  const totalAppointments = 0;
  const completedAppointments = 0;
  const pendingAppointments = 0;
  const confirmedAppointments = 0;
  const uniqueClients = 0;
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          {user?.role === 'super_admin'
            ? 'Panoramica di tutti gli appuntamenti'
            : `Panoramica degli appuntamenti ${currentSalon ? `per ${currentSalon.name}` : ''}`}
        </p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <DashboardCard
          title="Appuntamenti totali"
          value={totalAppointments}
          description="Tutti gli appuntamenti"
          icon={<Calendar className="h-4 w-4 text-white" />}
          color="bg-blue-500"
        />
        <DashboardCard
          title="Appuntamenti confermati"
          value={confirmedAppointments}
          description="Appuntamenti in programma"
          icon={<Clock className="h-4 w-4 text-white" />}
          color="bg-orange-500"
        />
        <DashboardCard
          title="Appuntamenti completati"
          value={completedAppointments}
          description="Appuntamenti conclusi"
          icon={<CheckCircle className="h-4 w-4 text-white" />}
          color="bg-green-500"
        />
        <DashboardCard
          title="Clienti totali"
          value={uniqueClients}
          description="Clienti unici"
          icon={<Users className="h-4 w-4 text-white" />}
          color="bg-purple-500"
        />
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Riepilogo appuntamenti recenti</CardTitle>
            <CardDescription>
              Appuntamenti degli ultimi 7 giorni
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center p-6 text-muted-foreground">
              Qui verrà mostrato il grafico degli appuntamenti recenti nella prossima fase.
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Prossimi appuntamenti</CardTitle>
            <CardDescription>
              I prossimi appuntamenti in agenda
            </CardDescription>
          </CardHeader>
          <CardContent className="max-h-72 overflow-auto">
            <div className="text-center p-6 text-muted-foreground">
              Nessun appuntamento in programma
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
