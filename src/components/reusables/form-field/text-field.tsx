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
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import type { TextFieldProps } from '@/types/formField.types';

export const TextField = forwardRef<
  HTMLDivElement,
  TextFieldProps & {
    value?: string | number;
    onChange?: (value: string | number) => void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    form?: any;
  }
>(
  (
    {
      name,
      label,
      description,
      placeholder,
      type = 'text',
      value,
      onChange,
      disabled = false,
      required = false,
      readOnly = false,
      className,
      form,
      min,
      max,
      step,
      autoFocus,
      autoComplete,
      maxLength,
      minLength,
      pattern,
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
                <Input
                  {...field}
                  type={type}
                  placeholder={placeholder}
                  disabled={disabled}
                  readOnly={readOnly}
                  min={min}
                  max={max}
                  step={step}
                  autoFocus={autoFocus}
                  autoComplete={autoComplete}
                  maxLength={maxLength}
                  minLength={minLength}
                  pattern={pattern}
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
        <Input
          id={name}
          name={name}
          type={type}
          value={value ?? ''}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          readOnly={readOnly}
          min={min}
          max={max}
          step={step}
          autoFocus={autoFocus}
          autoComplete={autoComplete}
          maxLength={maxLength}
          minLength={minLength}
          pattern={pattern}
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

TextField.displayName = 'TextField';
