'use client';

import { ChevronDown } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent } from '@/components/ui/collapsible';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { TMenuItem } from '@/types/global';
import { Link } from '@/i18n/navigation';
import { useGetPathInfo } from '@/hooks/useGetPortal';

interface SidebarMenuItemProps {
  item: TMenuItem;
  isCollapsed: boolean;
  isOpen: boolean;
  onToggle: () => void;
  onNavigate?: () => void;
}

export default function SidebarMenuItem({
  item,
  isCollapsed,
  isOpen,
  onToggle,
  onNavigate,
}: SidebarMenuItemProps) {
  const { locale, portal: userPortal, pathname } = useGetPathInfo();
  const portal = userPortal?.toLowerCase();
  //todo handle /:id
  const isActive =
    `/${locale}/${portal}/${item.href}` === pathname ||
    item.submenu?.some(
      (sub) => `/${locale}/${portal}/${sub.href}` === pathname,
    );
  const hasActiveSubmenu = item.submenu?.some(
    (sub) => `/${locale}/${portal}/${sub.href}` === pathname,
  );

  const handleMainClick = () => {
    if (item.href && onNavigate) {
      onNavigate();
    }
  };

  const MenuButton = ({
    children,
    className,
    ...props
  }: React.HTMLAttributes<HTMLDivElement>) => {
    if (item.href && !item.submenu) {
      return (
        <Link
          href={item.href}
          className={className}
          {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
        >
          {children}
        </Link>
      );
    }
    return (
      <div
        className={className}
        onClick={item.href ? handleMainClick : undefined}
        {...props}
      >
        {children}
      </div>
    );
  };

  const menuContent = (
    <MenuButton
      className={cn(
        'group relative flex w-full cursor-pointer items-center rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200',
        'text-muted-foreground',
        (isActive || hasActiveSubmenu) &&
          'dark:bg-accent border border-emerald-200/50 bg-emerald-50 text-emerald-400 shadow-sm dark:border-none',
        isCollapsed ? 'justify-center' : 'justify-between',
        !isActive && 'hover:bg-accent',
      )}
      onClick={onToggle}
    >
      {/* Active indicator */}
      <div
        className={cn(
          'absolute top-0 left-0 h-full w-1 rounded-r-full bg-emerald-500 transition-all duration-100',
          isActive || hasActiveSubmenu
            ? 'scale-y-100 opacity-100'
            : 'scale-y-0 opacity-0',
        )}
      />

      {/* Hover indicator */}
      <div
        className={cn(
          'absolute top-0 left-0 h-full w-1 rounded-r-full bg-emerald-400 transition-all duration-300',
          !isActive && !hasActiveSubmenu
            ? 'scale-y-0 opacity-0 group-hover:scale-y-100 group-hover:opacity-70'
            : 'opacity-0',
        )}
      />

      <div className="flex items-center">
        <div className={cn('rounded-lg p-1.5 transition-all duration-200')}>
          <item.icon
            className={cn(
              'text-muted-foreground h-4 w-4 transition-all duration-200',
              (isActive || hasActiveSubmenu) && 'text-emerald-600',

              !isCollapsed && 'mr-3',
            )}
          />
        </div>
        {!isCollapsed && (
          <span className="text-[18px] text-nowrap">{item.label}</span>
        )}
      </div>

      {!isCollapsed && item.submenu && (
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            'h-6 w-6 rounded-md p-0 transition-all duration-200',
            'hover:scale-110 hover:bg-emerald-100',
            isOpen && 'rotate-180',
          )}
        >
          <ChevronDown
            className={cn(
              'h-3 w-3 transition-all duration-300',
              isActive || hasActiveSubmenu
                ? 'text-emerald-300'
                : 'hover:text-emerald-600',
            )}
          />
        </Button>
      )}
    </MenuButton>
  );

  return (
    <div>
      <Collapsible open={isOpen} onOpenChange={onToggle}>
        {isCollapsed ? (
          <TooltipProvider delayDuration={100}>
            <Tooltip>
              <TooltipTrigger asChild>{menuContent}</TooltipTrigger>
              <TooltipContent side="right" className="text-sm font-medium">
                {item.label}
                {item.submenu && (
                  <div className="text-muted-foreground mt-1 text-xs">
                    {item.submenu.length}{' '}
                    {item.submenu.length === 1 ? 'item' : 'items'}
                  </div>
                )}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ) : (
          menuContent
        )}

        {/* Submenu with improved bullet styling */}
        {!isCollapsed && item.submenu && (
          <CollapsibleContent
            className={cn(
              'overflow-hidden transition-all duration-300 ease-in-out',
              'data-[state=open]:animate-in data-[state=open]:slide-in-from-top-2',
              'data-[state=closed]:animate-out data-[state=closed]:slide-out-to-top-2',
            )}
          >
            <div className="mt-1 space-y-0.5">
              {item.submenu.map((subItem, index) => {
                const isSubActive = subItem.href === pathname;
                return (
                  <div
                    key={subItem.key}
                    className={cn(
                      'transform transition-all duration-300 ease-out',
                      isOpen
                        ? 'translate-y-0 opacity-100'
                        : '-translate-y-2 opacity-0',
                    )}
                    style={{
                      transitionDelay: isOpen
                        ? `${index * 50}ms`
                        : `${(item.submenu!.length - index - 1) * 30}ms`,
                    }}
                  >
                    <Link
                      href={subItem.href}
                      onClick={onNavigate}
                      className={cn(
                        'group relative ml-6 flex items-center rounded-lg px-3 py-2 text-sm transition-all duration-200',
                        'hover:translate-x-1',
                        isSubActive
                          ? 'border border-emerald-200/50 bg-emerald-50 text-emerald-700 shadow-sm'
                          : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
                      )}
                    >
                      {/* Active indicator for submenu - same style as main menu */}
                      <div
                        className={cn(
                          'absolute top-0 left-0 h-full w-1 rounded-r-full bg-emerald-500 transition-all duration-300',
                          isSubActive
                            ? 'scale-y-100 opacity-100'
                            : 'scale-y-0 opacity-0',
                        )}
                      />

                      {/* Hover indicator for submenu */}
                      <div
                        className={cn(
                          'absolute top-0 left-0 h-full w-1 rounded-r-full bg-emerald-400 transition-all duration-300',
                          !isSubActive
                            ? 'scale-y-0 opacity-0 group-hover:scale-y-100 group-hover:opacity-70'
                            : 'opacity-0',
                        )}
                      />

                      {/* Bullet point indicator */}
                      <div className="mr-2 flex h-6 w-6 items-center justify-center">
                        <div
                          className={cn(
                            'h-1.5 w-1.5 rounded-full transition-all duration-200',
                            isSubActive
                              ? 'scale-125 bg-emerald-600'
                              : 'bg-muted-foreground/40 group-hover:scale-110 group-hover:bg-emerald-500',
                          )}
                        />
                      </div>

                      {/* Icon container */}
                      <div
                        className={cn(
                          'mr-2 rounded-md p-1 transition-all duration-200',
                          isSubActive
                            ? 'bg-emerald-100/50'
                            : 'group-hover:bg-accent',
                        )}
                      >
                        <subItem.icon
                          className={cn(
                            'h-4 w-4 transition-all duration-200',
                            isSubActive
                              ? 'text-emerald-600'
                              : 'text-muted-foreground group-hover:text-accent-foreground',
                          )}
                        />
                      </div>
                      <span className="ml-1 text-[14px]">{subItem.label}</span>
                    </Link>
                  </div>
                );
              })}
            </div>
          </CollapsibleContent>
        )}
      </Collapsible>
    </div>
  );
}
