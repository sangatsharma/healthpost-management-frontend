'use client';

import { ChevronLeft, ChevronRight, Stethoscope } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface SidebarHeaderProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

export default function SidebarHeader({
  isCollapsed,
  onToggle,
}: SidebarHeaderProps) {
  return (
    <div className="border-border flex h-24 items-center justify-between border-b p-4">
      <div
        className={cn(
          'flex items-center space-x-3 overflow-x-clip p-4 transition-all duration-300',
          isCollapsed ? 'hidden' : 'flex',
        )}
      >
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-lg transition-transform duration-400 hover:scale-105">
          <Stethoscope className="h-6 w-6 text-white" />
        </div>
        <div>
          <h1 className="text-foreground text-xl font-bold">HealthPost</h1>
          <p className="text-xs font-semibold tracking-wide text-emerald-600">
            Medical System
          </p>
        </div>
      </div>

      <Button
        variant="secondary"
        size="icon"
        onClick={onToggle}
        className="text-xl font-bold"
      >
        {isCollapsed ? (
          <ChevronRight className="h-16 w-16" />
        ) : (
          <ChevronLeft className="h-16 w-16" />
        )}
      </Button>
    </div>
  );
}
