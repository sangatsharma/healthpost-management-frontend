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
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import { CheckboxFieldProps } from '@/types/formField.types';
import { UseFormReturn } from 'react-hook-form';

export const CheckboxField = forwardRef<
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
              className="flex flex-row items-start space-y-0 space-x-3 rounded-md p-1"
            >
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  disabled={disabled}
                  className={className}
                  {...rest}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
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
              <FormMessage />
            </FormItem>
          )}
        />
      );
    }

    return (
      <div
        className="flex items-start space-y-0 space-x-3 rounded-md p-1"
        ref={ref}
      >
        <Checkbox
          id={name}
          name={name}
          checked={!!value}
          onCheckedChange={onChange}
          disabled={disabled}
          className={className}
          {...rest}
        />
        <div className="space-y-1 leading-none">
          {label && (
            <label
              htmlFor={name}
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
      </div>
    );
  },
);

CheckboxField.displayName = 'CheckboxField';
