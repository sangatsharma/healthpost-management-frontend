'use client';

import { Bell, Search, Stethoscope } from 'lucide-react';

import { Badge } from '../ui/badge';

import MobileSidebar from './mobile-sidebar';

import { Button } from '@/components/ui/button';
import { TUser } from '@/types/user.types';

interface MobileHeaderProps {
  currentUser?: TUser;
  isDarkMode: boolean;
  onThemeToggle: () => void;
}

export default function MobileHeader({
  currentUser,
  isDarkMode,
  onThemeToggle,
}: MobileHeaderProps) {
  return (
    <header className="border-border bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full border-b backdrop-blur md:hidden">
      <div className="flex h-14 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <MobileSidebar
            currentUser={currentUser!}
            isDarkMode={isDarkMode}
            onThemeToggle={onThemeToggle}
          />
          <div className="flex items-center space-x-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-gradient-to-br from-emerald-400 to-emerald-600">
              <Stethoscope className="h-4 w-4 text-white" />
            </div>
            <h1 className="text-foreground bg-gradient-to-r from-emerald-600 to-emerald-800 bg-clip-text text-lg font-bold text-transparent">
              HealthPost
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="h-9 w-9">
            <Search className="h-4 w-4" />
            <span className="sr-only">Search</span>
          </Button>
          <Button variant="ghost" size="icon" className="relative h-9 w-9">
            <Bell className="h-4 w-4" />
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-2 w-2 animate-pulse p-0"
            />
            <span className="sr-only">Notifications</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
