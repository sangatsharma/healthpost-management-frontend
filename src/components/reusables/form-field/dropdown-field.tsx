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
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ChevronDown } from 'lucide-react';
import { FormFieldOption, SelectFieldProps } from '@/types/formField.types';
import { UseFormReturn } from 'react-hook-form';

export const DropdownField = forwardRef<
  HTMLDivElement,
  SelectFieldProps & {
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
      placeholder,
      options,
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
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn('justify-between', className)}
                      disabled={disabled}
                    >
                      {options.find(
                        (opt: FormFieldOption) => opt.value === field.value,
                      )?.label ||
                        placeholder ||
                        'Select...'}
                      <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[200px] p-0">
                    <Command>
                      <CommandInput placeholder="Search..." />
                      <CommandList>
                        <CommandEmpty>No option found.</CommandEmpty>
                        <CommandGroup>
                          {options.map((option: FormFieldOption) => (
                            <CommandItem
                              key={String(option.value)}
                              value={option.label}
                              onSelect={() => {
                                field.onChange(option.value);
                              }}
                              disabled={option.disabled}
                            >
                              {option.label}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
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
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              className={cn('w-full justify-between', className)}
              disabled={disabled}
            >
              {options.find((opt: FormFieldOption) => opt.value === value)
                ?.label ||
                placeholder ||
                'Select...'}
              <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0">
            <Command>
              <CommandInput placeholder="Search..." />
              <CommandList>
                <CommandEmpty>No option found.</CommandEmpty>
                <CommandGroup>
                  {options.map((option: FormFieldOption) => (
                    <CommandItem
                      key={String(option.value)}
                      value={option.label}
                      onSelect={() => {
                        onChange?.(option.value);
                      }}
                      disabled={option.disabled}
                    >
                      {option.label}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
        {description && (
          <p className="text-muted-foreground text-sm">{description}</p>
        )}
      </div>
    );
  },
);

DropdownField.displayName = 'DropdownField';
