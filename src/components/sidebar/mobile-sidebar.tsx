'use client';

import { Menu, X, Stethoscope } from 'lucide-react';
import { useState } from 'react';

import SidebarNavigation from './sidebar-navigation';
import SidebarUserProfile from './sidebar-user-profile';

import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { TooltipProvider } from '@/components/ui/tooltip';
import { getMenuItems } from '@/constants/routes.constants';
import { TUser } from '@/types/user.types';

interface MobileSidebarProps {
  currentUser: TUser;
  isDarkMode: boolean;
  onThemeToggle: () => void;
}

export default function MobileSidebar({
  currentUser,
  isDarkMode,
  onThemeToggle,
}: MobileSidebarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const closeSidebar = () => setIsOpen(false);

  return (
    <div className="md:hidden">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="h-9 w-9">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="bg-background w-64 p-0">
          <TooltipProvider delayDuration={300}>
            <div className="flex h-full flex-col">
              {/* Mobile Header */}
              <div className="border-border flex items-center justify-between border-b p-4">
                <div className="flex items-center space-x-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-lg">
                    <Stethoscope className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h1 className="text-foreground bg-gradient-to-r from-emerald-600 to-emerald-800 bg-clip-text text-lg font-bold">
                      HealthPost
                    </h1>
                    <p className="text-xs font-semibold text-emerald-600">
                      Medical System
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={closeSidebar}
                  className="h-8 w-8"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Navigation */}
              <SidebarNavigation
                menuItems={getMenuItems({
                  itemsFor: currentUser?.accountType,
                })}
                user={currentUser}
                isCollapsed={false}
                onNavigate={closeSidebar}
              />

              {/* User Profile */}
              <SidebarUserProfile
                user={currentUser}
                isCollapsed={false}
                isDarkMode={isDarkMode}
                onThemeToggle={onThemeToggle}
              />
            </div>
          </TooltipProvider>
        </SheetContent>
      </Sheet>
    </div>
  );
}
