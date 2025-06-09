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
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import type { TextareaFieldProps } from '@/types/formField.types';
import { UseFormReturn } from 'react-hook-form';

export const TextareaField = forwardRef<
  HTMLDivElement,
  TextareaFieldProps & {
    value?: string;
    onChange?: (value: string) => void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    form?: UseFormReturn<any>;
  }
>(
  (
    {
      name,
      label,
      description,
      placeholder,
      value,
      onChange,
      disabled = false,
      required = false,
      readOnly = false,
      className,
      form,
      rows = 3,
      cols,
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
                <Textarea
                  {...field}
                  placeholder={placeholder}
                  disabled={disabled}
                  readOnly={readOnly}
                  rows={rows}
                  cols={cols}
                  className={className}
                  {...rest}
                />
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
        <Textarea
          id={name}
          name={name}
          value={value ?? ''}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          readOnly={readOnly}
          rows={rows}
          cols={cols}
          className={className}
          {...rest}
        />
        {description && (
          <p className="text-muted-foreground text-sm">{description}</p>
        )}
      </div>
    );
  },
);

TextareaField.displayName = 'TextareaField';
