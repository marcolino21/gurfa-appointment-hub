
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
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
  ChevronDown,
  LucideIcon,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  Box,
  UploadCloud,
  AlertOctagon
} from 'lucide-react';

interface SidebarItemProps {
  icon: LucideIcon;
  label: string;
  href: string;
  isActive?: boolean;
  hasSubmenu?: boolean;
  onClick?: () => void;
  isCollapsed?: boolean;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ 
  icon: Icon, 
  label, 
  href, 
  isActive = false,
  hasSubmenu = false, 
  onClick,
  isCollapsed = false
}) => {
  return (
    <Link
      to={href}
      className={cn(
        "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-all hover:bg-sidebar-accent",
        isActive ? "bg-blue-500 text-white hover:bg-blue-600" : "text-sidebar-foreground"
      )}
      onClick={onClick}
      title={isCollapsed ? label : undefined}
    >
      <Icon className="h-4 w-4 flex-shrink-0" />
      {!isCollapsed && (
        <>
          <span className="flex-1">{label}</span>
          {hasSubmenu && <ChevronDown className="h-4 w-4" />}
        </>
      )}
    </Link>
  );
};

interface SubMenuItem {
  icon: LucideIcon;
  label: string;
  href: string;
}

interface SidebarItemWithSubmenuProps {
  icon: LucideIcon;
  label: string;
  isActive?: boolean;
  subItems: SubMenuItem[];
  isCollapsed?: boolean;
}

const SidebarItemWithSubmenu: React.FC<SidebarItemWithSubmenuProps> = ({
  icon: Icon,
  label,
  isActive = false,
  subItems,
  isCollapsed = false
}) => {
  const [isOpen, setIsOpen] = useState(isActive);
  const location = useLocation();

  const toggleSubmenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsOpen(!isOpen);
  };

  const isSubItemActive = subItems.some(item => location.pathname === item.href);

  return (
    <div className="flex flex-col">
      <a
        href="#"
        className={cn(
          "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-all hover:bg-sidebar-accent",
          (isActive || isSubItemActive) ? "bg-blue-500 text-white hover:bg-blue-600" : "text-sidebar-foreground"
        )}
        onClick={toggleSubmenu}
        title={isCollapsed ? label : undefined}
      >
        <Icon className="h-4 w-4 flex-shrink-0" />
        {!isCollapsed && (
          <>
            <span className="flex-1">{label}</span>
            <ChevronDown className={cn("h-4 w-4 transition-transform", isOpen ? "rotate-180" : "")} />
          </>
        )}
      </a>
      {isOpen && !isCollapsed && (
        <div className="ml-6 mt-1 flex flex-col gap-1">
          {subItems.map((item, index) => (
            <Link
              key={index}
              to={item.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-all hover:bg-sidebar-accent",
                location.pathname === item.href ? "bg-blue-500 text-white hover:bg-blue-600" : "text-sidebar-foreground"
              )}
            >
              <item.icon className="h-4 w-4 flex-shrink-0" />
              <span>{item.label}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

const Sidebar: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();
  const isSuperAdmin = user?.role === 'super_admin';
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const magazzinoSubItems = [
    { icon: Box, label: "Prodotti", href: "/magazzino/prodotti" },
    { icon: UploadCloud, label: "Ordini", href: "/magazzino/ordini" },
    { icon: AlertOctagon, label: "Sotto Scorta", href: "/magazzino/sottoscorta" }
  ];

  return (
    <aside className={cn(
      "border-r flex flex-col bg-white transition-all duration-300 ease-in-out", 
      isCollapsed ? "w-16" : "w-60"
    )}>
      <div className={cn(
        "p-6 border-b flex items-center", 
        isCollapsed ? "justify-center" : "justify-between"
      )}>
        {!isCollapsed && <h2 className="text-xl font-semibold">Gurfa</h2>}
        <button 
          onClick={toggleSidebar}
          className="p-1 rounded-md hover:bg-gray-100 transition-colors"
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
        </button>
      </div>
      
      <div className="flex-1 overflow-auto py-2">
        <nav className="grid gap-1 px-2">
          <SidebarItem 
            icon={LayoutDashboard} 
            label="Dashboard" 
            href="/dashboard" 
            isActive={location.pathname === '/dashboard'}
            isCollapsed={isCollapsed}
          />
          
          <SidebarItem 
            icon={CalendarDays} 
            label="Appuntamenti" 
            href="/appuntamenti" 
            isActive={location.pathname === '/appuntamenti'}
            isCollapsed={isCollapsed}
          />
          
          <SidebarItem 
            icon={Users} 
            label="Rubrica Clienti" 
            href="/clienti" 
            isActive={location.pathname === '/clienti'}
            isCollapsed={isCollapsed}
          />
          
          <SidebarItem 
            icon={Package} 
            label="Servizi" 
            href="/servizi" 
            isActive={location.pathname === '/servizi'}
            isCollapsed={isCollapsed}
          />
          
          <SidebarItem 
            icon={CreditCard} 
            label="Abbonamenti" 
            href="/abbonamenti" 
            isActive={location.pathname === '/abbonamenti'}
            isCollapsed={isCollapsed}
          />
          
          <SidebarItem 
            icon={User} 
            label="Professionisti" 
            href="/professionisti" 
            isActive={location.pathname === '/professionisti'}
            isCollapsed={isCollapsed}
          />
          
          <SidebarItem 
            icon={Users2} 
            label="Staff" 
            href="/staff" 
            isActive={location.pathname === '/staff'}
            isCollapsed={isCollapsed}
          />
          
          <SidebarItemWithSubmenu 
            icon={Package2} 
            label="Magazzino" 
            isActive={location.pathname.includes('/magazzino')}
            subItems={magazzinoSubItems}
            isCollapsed={isCollapsed}
          />
          
          <SidebarItem 
            icon={BarChart3} 
            label="Statistiche" 
            href="/statistiche" 
            isActive={location.pathname === '/statistiche'}
            hasSubmenu={!isCollapsed}
            isCollapsed={isCollapsed}
          />
          
          <SidebarItem 
            icon={MessageSquare} 
            label="Comunicazioni" 
            href="/comunicazioni" 
            isActive={location.pathname === '/comunicazioni'}
            isCollapsed={isCollapsed}
          />
          
          <SidebarItem 
            icon={Receipt} 
            label="Spese" 
            href="/spese" 
            isActive={location.pathname === '/spese'}
            isCollapsed={isCollapsed}
          />
          
          {isSuperAdmin && (
            <>
              <SidebarItem 
                icon={Users} 
                label="Utenti" 
                href="/utenti" 
                isActive={location.pathname === '/utenti'}
                isCollapsed={isCollapsed}
              />
              
              <SidebarItem 
                icon={User} 
                label="Freelance" 
                href="/freelance" 
                isActive={location.pathname === '/freelance'}
                isCollapsed={isCollapsed}
              />
            </>
          )}
          
          <SidebarItem 
            icon={Settings} 
            label="Impostazioni" 
            href="/impostazioni" 
            isActive={location.pathname === '/impostazioni'}
            isCollapsed={isCollapsed}
          />
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
