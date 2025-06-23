'use client';

import * as React from 'react';
import * as RechartsPrimitive from 'recharts';

import { cn } from '@/lib/utils';

// Chart container component
const ChartContainer = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<'div'> & {
    config: Record<string, object>;
  }
>(({ className, children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn('w-full', className)}
      style={
        {
          '--color-visits': 'hsl(var(--chart-1))',
          '--color-users': 'hsl(var(--chart-2))',
          '--color-current': 'hsl(var(--chart-1))',
          '--color-previous': 'hsl(var(--chart-2))',
          '--color-spike': '#ef4444',
        } as React.CSSProperties
      }
      {...props}
    >
      {children}
    </div>
  );
});
ChartContainer.displayName = 'ChartContainer';

// Chart tooltip component
const ChartTooltip = RechartsPrimitive.Tooltip;

const ChartTooltipContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof RechartsPrimitive.Tooltip> & {
    hideLabel?: boolean;
    hideIndicator?: boolean;
    indicator?: 'line' | 'dot' | 'dashed';
    nameKey?: string;
    labelKey?: string;
    className?: string;
  }
>(
  (
    {
      active,
      payload,
      className,
      indicator = 'dot',
      hideLabel = false,
      hideIndicator = false,
      label,
      labelFormatter,
      labelClassName,
      formatter,
      nameKey,
      labelKey,
    },
    ref,
  ) => {
    const tooltipLabel = React.useMemo(() => {
      if (hideLabel || !payload?.length) {
        return null;
      }

      if (labelFormatter && typeof label !== 'undefined') {
        return labelFormatter(label, payload);
      }

      return label;
    }, [label, labelFormatter, payload, hideLabel, labelKey]);

    if (!active || !payload?.length) {
      return null;
    }

    return (
      <div
        ref={ref}
        className={cn(
          'border-border/50 bg-background grid min-w-[8rem] items-start gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs shadow-xl',
          className,
        )}
      >
        {tooltipLabel ? (
          <div className={cn('font-medium', labelClassName)}>
            {tooltipLabel}
          </div>
        ) : null}
        <div className="grid gap-1.5">
          {payload.map((item) => {
            const key = `${nameKey || item.name || item.dataKey || 'value'}`;
            const itemFormatter = formatter || item.formatter;

            return (
              <div
                key={item.dataKey}
                className={cn(
                  '[&>svg]:text-muted-foreground flex w-full flex-wrap items-stretch gap-2 [&>svg]:h-2.5 [&>svg]:w-2.5',
                  indicator === 'dot' && 'items-center',
                )}
              >
                {!hideIndicator && (
                  <div
                    className={cn(
                      'shrink-0 rounded-[2px] border-[--color-border] bg-[--color-bg]',
                      {
                        'h-2.5 w-2.5': indicator === 'dot',
                        'w-1': indicator === 'line',
                        'w-0 border-[1.5px] border-dashed bg-transparent':
                          indicator === 'dashed',
                        'my-0.5':
                          indicator === 'dashed' || indicator === 'line',
                      },
                    )}
                    style={
                      {
                        '--color-bg': item.color,
                        '--color-border': item.color,
                      } as React.CSSProperties
                    }
                  />
                )}
                <div className={cn('flex flex-1 justify-between leading-none')}>
                  <div className="grid gap-1.5">
                    <span className="text-muted-foreground">{key}</span>
                  </div>
                  {itemFormatter ? (
                    <span className="text-foreground font-mono font-medium tabular-nums">
                      {/* {itemFormatter(item.value, item.name)} */}
                    </span>
                  ) : (
                    <span className="text-foreground font-mono font-medium tabular-nums">
                      {item.value?.toLocaleString()}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  },
);
ChartTooltipContent.displayName = 'ChartTooltipContent';

export { ChartContainer, ChartTooltip, ChartTooltipContent };
