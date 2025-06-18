import * as PopoverPrimitive from '@radix-ui/react-popover';
import * as React from 'react';

import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';

const Popover = PopoverPrimitive.Root;

const PopoverTrigger = PopoverPrimitive.Trigger;

const PopoverContent = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content> & {
    portal?: boolean;
  }
>(
  (
    { className, align = 'center', sideOffset = 4, portal = true, ...props },
    ref,
  ) => {
    const Wrapper = portal ? PopoverPrimitive.Portal : React.Fragment;

    return (
      <Wrapper>
        <PopoverPrimitive.Content
          ref={ref}
          align={align}
          sideOffset={sideOffset}
          className={cn(
            'bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 w-72 rounded-md border p-4 shadow-md outline-none',
            className,
          )}
          {...props}
        />
      </Wrapper>
    );
  },
);
PopoverContent.displayName = PopoverPrimitive.Content.displayName;

interface PopoverTriggerButtonProps
  extends React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Trigger> {
  as?: React.ElementType;
  isArrowVisible?: boolean;

  customIcon?: React.ReactNode;
}

const PopoverTriggerButton = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Trigger>,
  PopoverTriggerButtonProps
>(
  (
    { className, children, isArrowVisible = true, customIcon, ...props },
    ref,
  ) => {
    return (
      <PopoverTrigger
        {...props}
        ref={ref}
        className={cn(
          'border-input bg-background ring-offset-background placeholder:text-muted-foreground focus:ring-ring flex h-10 w-full items-center justify-between rounded-md border px-3 py-2 text-left text-sm focus:outline-none disabled:cursor-not-allowed disabled:opacity-50',
          className,
        )}
      >
        <span className="line-clamp-1 w-10/12">{children}</span>
        {customIcon ? customIcon : null}
        {isArrowVisible && <ChevronDown className="ml-2 h-4 w-4 opacity-50" />}
      </PopoverTrigger>
    );
  },
);

PopoverTriggerButton.displayName = 'PopoverTriggerButton';

export { Popover, PopoverContent, PopoverTrigger, PopoverTriggerButton };
