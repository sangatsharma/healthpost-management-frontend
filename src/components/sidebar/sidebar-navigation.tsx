'use client';

import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

import SidebarMenuItem from './sidebar-menu-item';

import { TMenuItem } from '@/types/global';
import { TUser } from '@/types/user.types';
import { filterMenuItems } from '@/zustand/permissions';

interface SidebarNavigationProps {
  menuItems: TMenuItem[];
  user: TUser;
  isCollapsed: boolean;
  onNavigate?: () => void;
}

export default function SidebarNavigation({
  menuItems,
  user,
  isCollapsed,
  onNavigate,
}: SidebarNavigationProps) {
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});
  const pathname = usePathname();

  // Auto-manage submenu state based on active route
  useEffect(() => {
    const filteredMenuItems = filterMenuItems(menuItems, user);
    const newOpenMenus: Record<string, boolean> = {};

    // Find which submenu contains the active route
    filteredMenuItems.forEach((item) => {
      if (item.submenu) {
        const hasActiveSubmenu = item.submenu.some(
          (subItem) => subItem.href === pathname,
        );
        newOpenMenus[item.key] = hasActiveSubmenu;
      }
    });

    setOpenMenus(newOpenMenus);
  }, [pathname, menuItems, user]);

  const toggleMenu = (menuKey: string) => {
    setOpenMenus((prev) => ({
      ...prev,
      [menuKey]: !prev[menuKey],
    }));
  };

  // Filter menu items based on user permissions
  const filteredMenuItems = filterMenuItems(menuItems, user);

  return (
    <div className="flex-1 overflow-x-hidden overflow-y-auto py-2">
      <nav className="space-y-0.5 px-2">
        {filteredMenuItems.map((item) => (
          <SidebarMenuItem
            key={item.key}
            item={item}
            isCollapsed={isCollapsed}
            isOpen={openMenus[item.key] || false}
            onToggle={() => toggleMenu(item.key)}
            onNavigate={onNavigate}
          />
        ))}
      </nav>
    </div>
  );
}
