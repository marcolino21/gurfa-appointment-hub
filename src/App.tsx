
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
import Subscriptions from "./pages/Subscriptions";
import Staff from "./pages/Staff";
import Professionals from "./pages/Professionals";
import WarehouseIndex from "./pages/warehouse";
import Products from "./pages/warehouse/Products";
import NotFound from "./pages/NotFound";

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
                <Route path="servizi" element={<Services />} />
                <Route path="abbonamenti" element={<Subscriptions />} />
                <Route path="staff" element={<Staff />} />
                <Route path="professionisti" element={<Professionals />} />
                <Route path="magazzino" element={<WarehouseIndex />} />
                <Route path="magazzino/prodotti" element={<Products />} />
                <Route path="magazzino/ordini" element={<NotFound />} />
                <Route path="magazzino/sottoscorta" element={<NotFound />} />
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
