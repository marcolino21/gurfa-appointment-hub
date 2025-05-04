
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { AppointmentProvider } from "./contexts/AppointmentContext";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Appointments from "./pages/Appointments";
import Users from "./pages/Users";
import Freelance from "./pages/Freelance";
import Clients from "./pages/Clients";
import Services from "./pages/Services";
import Projects from "./pages/Projects";
import NewProject from "./pages/NewProject";
import Subscriptions from "./pages/Subscriptions";
import Staff from "./pages/Staff";
import Professionals from "./pages/Professionals";
import Expenses from "./pages/Expenses";
import Settings from "./pages/Settings";
import WarehouseIndex from "./pages/warehouse";
import Products from "./pages/warehouse/Products";
import Orders from "./pages/warehouse/Orders";
import LowStock from "./pages/warehouse/LowStock";
import NotFound from "./pages/NotFound";
import Communications from "./pages/Communications";

// Import delle pagine delle statistiche
import StatisticsIndex from "./pages/statistics";
import AnalisiAndamento from "./pages/statistics/AnalisiAndamento";
import ReportAzienda from "./pages/statistics/ReportAzienda";
import Corrispettivi from "./pages/statistics/Corrispettivi";
import ReportPlaceholder from "./pages/statistics/ReportPlaceholder";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <AppointmentProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/" element={<Layout />}>
                <Route index element={<Dashboard />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="appuntamenti" element={<Appointments />} />
                <Route path="clienti" element={<Clients />} />
                <Route path="progetti" element={<Projects />} />
                <Route path="progetti/nuovo" element={<NewProject />} />
                <Route path="servizi" element={<Services />} />
                <Route path="abbonamenti" element={<Subscriptions />} />
                <Route path="staff" element={<Staff />} />
                <Route path="professionisti" element={<Professionals />} />
                <Route path="comunicazioni" element={<Communications />} />
                <Route path="spese" element={<Expenses />} />
                <Route path="impostazioni" element={<Settings />} />
                
                {/* Rotte statistiche */}
                <Route path="statistiche" element={<StatisticsIndex />} />
                <Route path="statistiche/analisi-andamento" element={<AnalisiAndamento />} />
                <Route path="statistiche/report-azienda" element={<ReportAzienda />} />
                <Route path="statistiche/corrispettivi" element={<Corrispettivi />} />
                <Route 
                  path="statistiche/collaboratori" 
                  element={<ReportPlaceholder title="Report Collaboratori" description="Analisi delle performance dei collaboratori" />} 
                />
                <Route 
                  path="statistiche/clienti" 
                  element={<ReportPlaceholder title="Report Clienti" description="Analisi dei dati relativi ai clienti" />} 
                />
                <Route 
                  path="statistiche/magazzino" 
                  element={<ReportPlaceholder title="Report Magazzino" description="Analisi dei dati relativi al magazzino" />} 
                />
                <Route 
                  path="statistiche/inventario" 
                  element={<ReportPlaceholder title="Report Inventario" description="Analisi dell'inventario" />} 
                />

                {/* Rotte magazzino */}
                <Route path="magazzino" element={<WarehouseIndex />} />
                <Route path="magazzino/prodotti" element={<Products />} />
                <Route path="magazzino/ordini" element={<Orders />} />
                <Route path="magazzino/sottoscorta" element={<LowStock />} />
                
                <Route path="utenti" element={<Users />} />
                <Route path="freelance" element={<Freelance />} />
                {/* Altri percorsi da aggiungere nelle fasi future */}
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AppointmentProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
