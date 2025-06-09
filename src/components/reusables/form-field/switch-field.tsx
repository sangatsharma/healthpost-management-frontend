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
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';
import { CheckboxFieldProps } from '@/types/formField.types';
import { UseFormReturn } from 'react-hook-form';

export const SwitchField = forwardRef<
  HTMLDivElement,
  CheckboxFieldProps & {
    value?: boolean;
    onChange?: (value: boolean) => void;
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
            <FormItem
              ref={ref}
              className="flex flex-row items-center justify-between rounded-lg border p-3"
            >
              <div className="space-y-0.5">
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
                {description && (
                  <FormDescription>{description}</FormDescription>
                )}
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  disabled={disabled}
                  className={className}
                  {...rest}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      );
    }

    return (
      <div
        className="flex flex-row items-center justify-between rounded-lg border p-3"
        ref={ref}
      >
        <div className="space-y-0.5">
          {label && (
            <label
              className={cn(
                'text-sm font-medium',
                required &&
                  "after:ml-0.5 after:text-red-500 after:content-['*']",
              )}
            >
              {label}
            </label>
          )}
          {description && (
            <p className="text-muted-foreground text-sm">{description}</p>
          )}
        </div>
        <Switch
          id={name}
          name={name}
          checked={!!value}
          onCheckedChange={onChange}
          disabled={disabled}
          className={className}
          {...rest}
        />
      </div>
    );
  },
);

SwitchField.displayName = 'SwitchField';
