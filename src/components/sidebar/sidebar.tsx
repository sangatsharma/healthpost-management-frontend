'use client';

import { useState } from 'react';

import MobileHeader from './mobile-header';
import SidebarHeader from './sidebar-header';
import SidebarNavigation from './sidebar-navigation';
import SidebarUserProfile from './sidebar-user-profile';

import { TooltipProvider } from '@/components/ui/tooltip';
import { getMenuItems } from '@/constants/routes.constants';
import { useTheme } from '@/provider/ThemeProvider';
import { useUserStore } from '@/zustand/useUserDetails';

export default function HealthPostSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const user = useUserStore((state) => state.user);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  if (!user) {
    return null;
  }

  return (
    <>
      {/* Mobile Header */}
      <MobileHeader
        currentUser={user!}
        isDarkMode={theme === 'dark'}
        onThemeToggle={toggleTheme}
      />

      {/* Desktop Sidebar */}
      <TooltipProvider delayDuration={300}>
        <div
          className={`bg-background border-border hidden h-screen border-r duration-300 md:flex ${
            isCollapsed ? 'w-16' : 'w-64'
          } flex-col shadow-sm`}
        >
          <SidebarHeader isCollapsed={isCollapsed} onToggle={toggleSidebar} />

          <SidebarNavigation
            menuItems={getMenuItems({
              itemsFor: user?.accountType,
            })}
            user={user!}
            isCollapsed={isCollapsed}
          />
          <SidebarUserProfile
            user={user}
            isCollapsed={isCollapsed}
            isDarkMode={theme === 'dark'}
            onThemeToggle={toggleTheme}
          />
        </div>
      </TooltipProvider>
    </>
  );
}
