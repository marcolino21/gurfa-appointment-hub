
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
  AlertOctagon,
  LineChart,
  FileBarChart,
  ListChecks,
  UserRound,
  ShoppingBag,
  ClipboardList,
  Folders
} from 'lucide-react';

export const magazzinoSubItems = [
  { icon: Box, label: "Prodotti", href: "/magazzino/prodotti" },
  { icon: UploadCloud, label: "Ordini", href: "/magazzino/ordini" },
  { icon: AlertOctagon, label: "Sotto Scorta", href: "/magazzino/sottoscorta" }
];

export const statisticheSubItems = [
  { icon: LineChart, label: "Analisi Andamento", href: "/statistiche/analisi-andamento" },
  { icon: FileBarChart, label: "Report Azienda", href: "/statistiche/report-azienda" },
  { icon: ListChecks, label: "Corrispettivi", href: "/statistiche/corrispettivi" },
  { icon: UserRound, label: "Report Collaboratori", href: "/statistiche/collaboratori" },
  { icon: Users, label: "Report Clienti", href: "/statistiche/clienti" },
  { icon: ShoppingBag, label: "Report Magazzino", href: "/statistiche/magazzino" },
  { icon: ClipboardList, label: "Report Inventario", href: "/statistiche/inventario" }
];

export const clientiSubItems = [
  { icon: Users, label: "Clienti", href: "/clienti" },
  { icon: Folders, label: "Progetti", href: "/progetti" }
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
    href: "/clienti",
    subItems: clientiSubItems
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
