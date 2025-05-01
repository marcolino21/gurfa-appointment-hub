import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Calendar, CheckCircle, Clock } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useAppointments } from '@/contexts/AppointmentContext';
import { Alert, AlertDescription } from '@/components/ui/alert';

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
  const { user, currentSalonId, salons, loading } = useAuth();
  const { appointments } = useAppointments();
  
  // Debug logging
  console.log('Dashboard render:', {
    user: user?.email,
    currentSalonId,
    salons: salons?.length,
    appointments: appointments?.length,
    loading
  });
  
  // Show loading state while authentication is being determined
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // If no user is logged in, show error
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Alert variant="destructive" className="max-w-md">
          <AlertDescription>
            Sessione non valida. Per favore, effettua nuovamente il login.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // If no salon is selected but salons are available, show error
  if (!currentSalonId && salons?.length > 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Alert variant="destructive" className="max-w-md">
          <AlertDescription>
            Nessun salone selezionato. Seleziona un salone per visualizzare la dashboard.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // If no salons are available, show error
  if (!salons?.length) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Alert variant="destructive" className="max-w-md">
          <AlertDescription>
            Nessun salone disponibile per questo account.
          </AlertDescription>
        </Alert>
      </div>
    );
  }
  
  const currentSalon = salons.find(salon => salon.id === currentSalonId);
  
  const totalAppointments = appointments.length;
  const completedAppointments = appointments.filter(app => app.status === 'completed').length;
  const pendingAppointments = appointments.filter(app => app.status === 'pending').length;
  const confirmedAppointments = appointments.filter(app => app.status === 'confirmed').length;
  
  const uniqueClients = [...new Set(appointments.map(app => app.clientName))].length;
  
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
            {appointments
              .filter(app => new Date(app.start) > new Date() && app.status !== 'cancelled')
              .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime())
              .slice(0, 5)
              .map(app => (
                <div key={app.id} className="mb-4 p-3 border rounded-md">
                  <div className="font-medium">{app.clientName}</div>
                  <div className="text-sm text-muted-foreground">
                    {new Date(app.start).toLocaleDateString('it-IT')} - 
                    {new Date(app.start).toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })}
                  </div>
                  <div className="text-sm">{app.service}</div>
                </div>
              ))}
            {appointments
              .filter(app => new Date(app.start) > new Date() && app.status !== 'cancelled')
              .length === 0 && (
              <div className="text-center p-6 text-muted-foreground">
                Nessun appuntamento in programma
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
