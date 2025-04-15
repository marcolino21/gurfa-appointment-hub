
import React from 'react';
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
  LucideIcon
} from 'lucide-react';

interface SidebarItemProps {
  icon: LucideIcon;
  label: string;
  href: string;
  isActive?: boolean;
  hasSubmenu?: boolean;
  onClick?: () => void;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ 
  icon: Icon, 
  label, 
  href, 
  isActive = false,
  hasSubmenu = false, 
  onClick
}) => {
  return (
    <Link
      to={href}
      className={cn(
        "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-all hover:bg-sidebar-accent",
        isActive ? "bg-blue-500 text-white hover:bg-blue-600" : "text-sidebar-foreground"
      )}
      onClick={onClick}
    >
      <Icon className="h-4 w-4" />
      <span className="flex-1">{label}</span>
      {hasSubmenu && <ChevronDown className="h-4 w-4" />}
    </Link>
  );
};

const Sidebar: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();
  const isSuperAdmin = user?.role === 'super_admin';

  return (
    <aside className="border-r flex flex-col w-60 bg-white">
      <div className="p-6 border-b">
        <h2 className="text-xl font-semibold text-center">Gurfa</h2>
      </div>
      
      <div className="flex-1 overflow-auto py-2">
        <nav className="grid gap-1 px-2">
          <SidebarItem 
            icon={LayoutDashboard} 
            label="Dashboard" 
            href="/dashboard" 
            isActive={location.pathname === '/dashboard'}
          />
          
          <SidebarItem 
            icon={CalendarDays} 
            label="Appuntamenti" 
            href="/appuntamenti" 
            isActive={location.pathname === '/appuntamenti'}
          />
          
          <SidebarItem 
            icon={Users} 
            label="Rubrica Clienti" 
            href="/clienti" 
            isActive={location.pathname === '/clienti'}
          />
          
          <SidebarItem 
            icon={Package} 
            label="Servizi" 
            href="/servizi" 
            isActive={location.pathname === '/servizi'}
          />
          
          <SidebarItem 
            icon={Clock} 
            label="Abbonamenti" 
            href="/abbonamenti" 
            isActive={location.pathname === '/abbonamenti'}
          />
          
          <SidebarItem 
            icon={User} 
            label="Professionisti" 
            href="/professionisti" 
            isActive={location.pathname === '/professionisti'}
          />
          
          <SidebarItem 
            icon={Users2} 
            label="Staff" 
            href="/staff" 
            isActive={location.pathname === '/staff'}
          />
          
          <SidebarItem 
            icon={Package2} 
            label="Magazzino" 
            href="/magazzino" 
            isActive={location.pathname === '/magazzino'}
            hasSubmenu
          />
          
          <SidebarItem 
            icon={BarChart3} 
            label="Statistiche" 
            href="/statistiche" 
            isActive={location.pathname === '/statistiche'}
            hasSubmenu
          />
          
          <SidebarItem 
            icon={MessageSquare} 
            label="Comunicazioni" 
            href="/comunicazioni" 
            isActive={location.pathname === '/comunicazioni'}
          />
          
          <SidebarItem 
            icon={Receipt} 
            label="Spese" 
            href="/spese" 
            isActive={location.pathname === '/spese'}
          />
          
          {isSuperAdmin && (
            <>
              <SidebarItem 
                icon={Users} 
                label="Utenti" 
                href="/utenti" 
                isActive={location.pathname === '/utenti'}
              />
              
              <SidebarItem 
                icon={User} 
                label="Freelance" 
                href="/freelance" 
                isActive={location.pathname === '/freelance'}
              />
            </>
          )}
          
          <SidebarItem 
            icon={Settings} 
            label="Impostazioni" 
            href="/impostazioni" 
            isActive={location.pathname === '/impostazioni'}
          />
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
