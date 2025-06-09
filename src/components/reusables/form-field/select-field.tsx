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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { FormFieldOption, SelectFieldProps } from '@/types/formField.types';
import { UseFormReturn } from 'react-hook-form';

export const SelectField = forwardRef<
  HTMLDivElement,
  SelectFieldProps & {
    value?: string | number | boolean;
    onChange?: (value: string | number | boolean) => void;
    form?: UseFormReturn<Record<string, unknown>>;
    options?: Array<{
      value: string;
      label: string;
      disabled?: boolean;
    }>;
  }
>(
  (
    {
      name,
      label,
      description,
      placeholder,
      options = [],
      value,
      onChange,
      disabled = false,
      required = false,
      className,
      form,
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
                <Select
                  value={String(field.value || '')}
                  onValueChange={(value) => {
                    field.onChange(value);
                  }}
                  disabled={disabled}
                >
                  <SelectTrigger className={className}>
                    <SelectValue placeholder={placeholder} />
                  </SelectTrigger>
                  <SelectContent>
                    {options.map(
                      (option: {
                        value: string | number | boolean;
                        label: string;
                        disabled?: boolean;
                      }) => (
                        <SelectItem
                          key={String(option.value)}
                          value={String(option.value)}
                          disabled={option.disabled}
                        >
                          {option.label}
                        </SelectItem>
                      ),
                    )}
                  </SelectContent>
                </Select>
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
        <Select
          value={String(value || '')}
          onValueChange={(val) => {
            onChange?.(val);
          }}
          disabled={disabled}
        >
          <SelectTrigger className={className}>
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>
            {options.map((option: FormFieldOption) => (
              <SelectItem
                key={String(option.value)}
                value={String(option.value)}
                disabled={option.disabled}
              >
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {description && (
          <p className="text-muted-foreground text-sm">{description}</p>
        )}
      </div>
    );
  },
);

SelectField.displayName = 'SelectField';
