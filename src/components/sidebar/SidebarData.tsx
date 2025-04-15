
import {
  LayoutDashboard, 
  CalendarDays, 
  Users,
  UserCheck,
  Package,
  Clock,
  User,
  Users2,
  Package2,
  BarChart3,
  MessageSquare,
  Receipt,
  Settings,
  CreditCard,
  Box,
  UploadCloud,
  AlertOctagon
} from 'lucide-react';

export const magazzinoSubItems = [
  { icon: Box, label: "Prodotti", href: "/magazzino/prodotti" },
  { icon: UploadCloud, label: "Ordini", href: "/magazzino/ordini" },
  { icon: AlertOctagon, label: "Sotto Scorta", href: "/magazzino/sottoscorta" }
];

export const sidebarItems = [
  { 
    icon: LayoutDashboard, 
    label: "Dashboard", 
    href: "/dashboard"
  },
  { 
    icon: CalendarDays, 
    label: "Appuntamenti", 
    href: "/appuntamenti"
  },
  { 
    icon: Users, 
    label: "Rubrica Clienti", 
    href: "/clienti"
  },
  { 
    icon: Package, 
    label: "Servizi", 
    href: "/servizi"
  },
  { 
    icon: CreditCard, 
    label: "Abbonamenti", 
    href: "/abbonamenti"
  },
  { 
    icon: User, 
    label: "Professionisti", 
    href: "/professionisti"
  },
  { 
    icon: Users2, 
    label: "Staff", 
    href: "/staff"
  },
  { 
    icon: BarChart3, 
    label: "Statistiche", 
    href: "/statistiche"
  },
  { 
    icon: MessageSquare, 
    label: "Comunicazioni", 
    href: "/comunicazioni"
  },
  { 
    icon: Receipt, 
    label: "Spese", 
    href: "/spese"
  },
  { 
    icon: Settings, 
    label: "Impostazioni", 
    href: "/impostazioni"
  }
];

export const adminSidebarItems = [
  { 
    icon: Users, 
    label: "Utenti", 
    href: "/utenti"
  },
  { 
    icon: User, 
    label: "Freelance", 
    href: "/freelance"
  }
];
