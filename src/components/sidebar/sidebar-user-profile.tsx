'use client';
import { User, Moon, Sun, LogOut, Bell, Shield, Eye, Lock } from 'lucide-react';
import { useState } from 'react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { TUser } from '@/types/user.types';
import LanguageSwitcher from '../LanguageSwitcher';
import { useUserStore } from '@/zustand/useUserDetails';

interface SidebarUserProfileProps {
  user: TUser;
  isCollapsed: boolean;
  isDarkMode: boolean;
  onThemeToggle: () => void;
}

export default function SidebarUserProfile({
  user,
  isCollapsed,
  isDarkMode,
  onThemeToggle,
}: SidebarUserProfileProps) {
  const logout = useUserStore((state) => state.logOut);

  const [imageError, setImageError] = useState(false);

  const userDropdownItems = [
    { key: 'profile', icon: User, label: 'Profile' },
    { key: 'notifications', icon: Bell, label: 'Notifications' },
    { key: 'privacy', icon: Eye, label: 'Privacy Settings' },
    { key: 'security', icon: Lock, label: 'Security' },
    { key: 'admin', icon: Shield, label: 'Admin Panel' },
  ];

  const handleDropdownItemClick = (itemKey: string) => {
    console.log('Clicked:', itemKey);
  };

  // Generate a profile image URL based on user fullName (for demo purposes)
  const profileImageUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user?.fullName?.firstName || 'USER')}`;

  const userButton = (
    <Button
      variant="ghost"
      className={`h-auto w-full cursor-pointer justify-start p-3 transition-transform duration-200 hover:translate-x-1 ${
        isCollapsed ? 'px-2' : ''
      }`}
    >
      <div
        className={`flex items-center ${isCollapsed ? '' : 'w-full space-x-3'}`}
      >
        <div className="relative">
          <Avatar className="h-8 w-8">
            {!imageError && (
              <AvatarImage
                src={profileImageUrl || '/placeholder.svg'}
                onError={() => setImageError(true)}
              />
            )}
            <AvatarFallback className="bg-gradient-to-br from-emerald-400 to-emerald-600 text-xs text-white capitalize">
              {user.fullName.firstName}
            </AvatarFallback>
          </Avatar>
          <div className="border-background absolute -right-0.5 -bottom-0.5 h-3 w-3 rounded-full border-2 bg-green-400"></div>
        </div>
        {!isCollapsed && (
          <>
            <div className="min-w-0 flex-1 text-left">
              <p className="text-foreground truncate text-sm font-medium">
                {user.fullName.firstName}
              </p>
              <p className="truncate text-xs text-emerald-600">{user.role}</p>
            </div>
            <div className="relative">
              <Bell className="text-muted-foreground h-4 w-4" />
              <Badge
                variant="destructive"
                className="absolute -top-1 -right-1 h-2 w-2 animate-pulse p-0"
              />
            </div>
          </>
        )}
      </div>
    </Button>
  );

  if (isCollapsed) {
    return (
      <div className="border-border border-t p-2">
        <TooltipProvider delayDuration={100}>
          <Tooltip>
            <DropdownMenu>
              <TooltipTrigger asChild>
                <DropdownMenuTrigger asChild>{userButton}</DropdownMenuTrigger>
              </TooltipTrigger>
              <DropdownMenuContent side="right" align="end" className="w-56">
                <div className="flex items-center gap-3 p-2">
                  <Avatar className="h-10 w-10">
                    {!imageError && (
                      <AvatarImage
                        src={profileImageUrl || '/placeholder.svg'}
                        onError={() => setImageError(true)}
                      />
                    )}
                    <AvatarFallback className="bg-gradient-to-br from-emerald-400 to-emerald-600 text-white capitalize">
                      {user.fullName.firstName}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">
                      {user.fullName.firstName}
                    </p>
                    <p className="text-muted-foreground text-xs">{user.role}</p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                {userDropdownItems.map((item) => (
                  <DropdownMenuItem
                    key={item.key}
                    onClick={() => handleDropdownItemClick(item.key)}
                  >
                    <item.icon className="mr-2 h-4 w-4" />
                    {item.label}
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <LanguageSwitcher />
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={onThemeToggle}>
                  {isDarkMode ? (
                    <Sun className="mr-2 h-4 w-4" />
                  ) : (
                    <Moon className="mr-2 h-4 w-4" />
                  )}
                  {isDarkMode ? 'Light Mode' : 'Dark Mode'}
                </DropdownMenuItem>
                <DropdownMenuItem className="text-red-600">
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </Tooltip>
        </TooltipProvider>
      </div>
    );
  }

  return (
    <div className="border-border border-t p-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>{userButton}</DropdownMenuTrigger>
        <DropdownMenuContent side="top" align="end" className="w-56">
          <div className="flex items-center gap-3 p-2">
            <Avatar className="h-10 w-10">
              {!imageError && (
                <AvatarImage
                  src={profileImageUrl || '/placeholder.svg'}
                  onError={() => setImageError(true)}
                />
              )}
              <AvatarFallback className="bg-gradient-to-br from-emerald-400 to-emerald-600 text-white">
                {user.fullName.firstName}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">{user.fullName.firstName}</p>
              <p className="text-muted-foreground text-xs">{user.role}</p>
              <p className="text-muted-foreground mt-1 text-xs">
                {user?.permissions?.length} permissions
              </p>
            </div>
          </div>
          <DropdownMenuSeparator />
          {userDropdownItems.map((item) => (
            <DropdownMenuItem
              key={item.key}
              onClick={() => handleDropdownItemClick(item.key)}
            >
              <item.icon className="mr-2 h-4 w-4" />
              {item.label}
            </DropdownMenuItem>
          ))}
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <LanguageSwitcher />
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={onThemeToggle}>
            {isDarkMode ? (
              <Sun className="mr-2 h-4 w-4" />
            ) : (
              <Moon className="mr-2 h-4 w-4" />
            )}
            {isDarkMode ? 'Light Mode' : 'Dark Mode'}
          </DropdownMenuItem>
          <DropdownMenuItem
            className="text-red-600"
            onClick={() => {
              logout();
            }}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
