
import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { ChevronLeft, ChevronRight, Package2 } from 'lucide-react';

import SidebarItem from './SidebarItem';
import SidebarItemWithSubmenu from './SidebarItemWithSubmenu';
import { sidebarItems, adminSidebarItems, magazzinoSubItems } from './SidebarData';

const Sidebar: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();
  const isSuperAdmin = user?.role === 'super_admin';
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

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
          {sidebarItems.map((item) => (
            <SidebarItem 
              key={item.href}
              icon={item.icon} 
              label={item.label} 
              href={item.href} 
              isActive={location.pathname === item.href}
              isCollapsed={isCollapsed}
            />
          ))}
          
          <SidebarItemWithSubmenu 
            icon={Package2} 
            label="Magazzino" 
            isActive={location.pathname.includes('/magazzino')}
            subItems={magazzinoSubItems}
            isCollapsed={isCollapsed}
          />
          
          {isSuperAdmin && adminSidebarItems.map((item) => (
            <SidebarItem 
              key={item.href}
              icon={item.icon} 
              label={item.label} 
              href={item.href} 
              isActive={location.pathname === item.href}
              isCollapsed={isCollapsed}
            />
          ))}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
