'use client';

import MobileSidebar from './mobile-sidebar';
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
    <header className="border-border supports-[backdrop-filter]:bg-background/60 absolute top-0 z-50 w-full md:hidden">
      <div className="flex h-14 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <MobileSidebar
            currentUser={currentUser!}
            isDarkMode={isDarkMode}
            onThemeToggle={onThemeToggle}
          />
        </div>
      </div>
    </header>
  );
}
