'use client';

import { forwardRef } from 'react';
import {
  FormControl,
  FormDescription,
  FormField as ShadcnFormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';
import { SliderFieldProps } from '@/types/formField.types';
import { UseFormReturn } from 'react-hook-form';

export const SliderField = forwardRef<
  HTMLDivElement,
  SliderFieldProps & {
    value?: number;
    onChange?: (value: number) => void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    form?: UseFormReturn<any>;
  }
>(
  (
    {
      name,
      label,
      description,
      value,
      onChange,
      disabled = false,
      required = false,
      className,
      form,
      min = 0,
      max = 100,
      step = 1,
      ...rest
    },
    ref,
  ) => {
    if (form) {
      return (
        <ShadcnFormField
          control={form.control}
          name={name}
          render={({ field }) => (
            <FormItem ref={ref}>
              {label && (
                <FormLabel
                  className={cn(
                    required &&
                      "after:ml-0.5 after:text-red-500 after:content-['*']",
                  )}
                >
                  {label}
                </FormLabel>
              )}
              <FormControl>
                <div className="flex items-center gap-4">
                  <Slider
                    value={[field.value || min]}
                    onValueChange={(vals) => field.onChange(vals[0])}
                    min={min}
                    max={max}
                    step={step}
                    disabled={disabled}
                    className={className}
                    {...rest}
                  />
                  <span className="w-12 text-right">{field.value || min}</span>
                </div>
              </FormControl>
              {description && <FormDescription>{description}</FormDescription>}
              <FormMessage />
            </FormItem>
          )}
        />
      );
    }

    return (
      <div className="space-y-2" ref={ref}>
        {label && (
          <label
            className={cn(
              'text-sm font-medium',
              required && "after:ml-0.5 after:text-red-500 after:content-['*']",
            )}
          >
            {label}
          </label>
        )}
        <div className="flex items-center gap-4">
          <Slider
            value={[value || min]}
            onValueChange={(vals) => onChange?.(vals[0])}
            min={min}
            max={max}
            step={step}
            disabled={disabled}
            className={className}
            {...rest}
          />
          <span className="w-12 text-right">{value || min}</span>
        </div>
        {description && (
          <p className="text-muted-foreground text-sm">{description}</p>
        )}
      </div>
    );
  },
);

SliderField.displayName = 'SliderField';
