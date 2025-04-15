
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LucideIcon, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

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

export default SidebarItemWithSubmenu;
