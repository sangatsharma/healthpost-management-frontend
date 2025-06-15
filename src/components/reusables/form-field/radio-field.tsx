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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { cn } from '@/lib/utils';
import { RadioFieldProps } from '@/types/formField.types';
import { UseFormReturn } from 'react-hook-form';

export const RadioField = forwardRef<
  HTMLDivElement,
  RadioFieldProps & {
    value?: string | number | boolean;
    onChange?: (value: string | number | boolean) => void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    form?: UseFormReturn<any>;
  }
>(
  (
    {
      name,
      label,
      description,
      options = [],
      value,
      onChange,
      disabled = false,
      required = false,
      className,
      form,
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
            <FormItem ref={ref} className="space-y-3">
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
                <RadioGroup
                  value={String(field.value || '')}
                  onValueChange={field.onChange}
                  disabled={disabled}
                  className={cn('flex flex-col space-y-1', className)}
                  {...rest}
                >
                  {options.map((option: RadioFieldProps['options'][number]) => (
                    <div
                      key={String(option.value)}
                      className="flex items-center space-x-2"
                    >
                      <RadioGroupItem
                        value={String(option.value)}
                        disabled={option.disabled}
                      />
                      <label className="text-sm">{option.label}</label>
                    </div>
                  ))}
                </RadioGroup>
              </FormControl>
              {description && <FormDescription>{description}</FormDescription>}
              <FormMessage />
            </FormItem>
          )}
        />
      );
    }

    return (
      <div className="space-y-3" ref={ref}>
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
        <RadioGroup
          value={String(value || '')}
          onValueChange={(val) => onChange?.(val)}
          disabled={disabled}
          className={cn('flex flex-col space-y-1', className)}
          {...rest}
        >
          {options.map((option: RadioFieldProps['options'][number]) => (
            <div
              key={String(option.value)}
              className="flex items-center space-x-2"
            >
              <RadioGroupItem
                value={String(option.value)}
                disabled={option.disabled}
              />
              <label className="text-sm">{option.label}</label>
            </div>
          ))}
        </RadioGroup>
        {description && (
          <p className="text-muted-foreground text-sm">{description}</p>
        )}
      </div>
    );
  },
);

RadioField.displayName = 'RadioField';
