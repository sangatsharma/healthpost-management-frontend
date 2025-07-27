'use client';
import { useState } from 'react';
import { type FieldPath, type FieldValues } from 'react-hook-form';
import { Check, ChevronsUpDown } from 'lucide-react';

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
import { cn } from '@/lib/utils';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

type SelectVariant = 'basic' | 'searchable';

interface FormSelectProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> {
  name: TName;
  label?: string;
  placeholder?: string;
  searchPlaceholder?: string;
  options: SelectOption[];
  disabled?: boolean;
  required?: boolean;
  className?: string;
  error?: boolean;
  variant?: SelectVariant;
  searchable?: boolean;
  emptyMessage?: string;
  onChange: (value: string | undefined) => void;
  value: string | undefined;
  popoverClassName?: string;
}

export function FormSelect<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  placeholder = 'Select an option',
  searchPlaceholder = 'Search options...',
  options,
  disabled = false,
  className,
  error,
  variant = 'basic',
  searchable = false,
  emptyMessage = 'No options found.',
  onChange,
  value,
  required,
  popoverClassName,
}: FormSelectProps<TFieldValues, TName>) {
  const [open, setOpen] = useState(false);

  const isSearchable = variant === 'searchable' || searchable;

  const renderSearchableSelect = (value: string) => {
    const selectedOption = options.find((option) => option.value === value);

    return (
      <Popover open={open} onOpenChange={setOpen} modal={true}>
        <PopoverTrigger asChild className="w-full">
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn(
              'dark:bg-input/30 flex w-full justify-between bg-emerald-50 font-normal',
              '!border-emerald-200',
              error && '!border-red-500',
              disabled && 'cursor-not-allowed opacity-100',
            )}
            disabled={disabled}
          >
            <span className="flex w-[90%] items-start truncate text-ellipsis">
              {selectedOption ? (
                selectedOption.label
              ) : (
                <span className="text-muted-foreground">{placeholder}</span>
              )}
            </span>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className={cn('w-full p-0', popoverClassName)}>
          <Command
            className="max-h-64"
            filter={(commandValue, search) => {
              const label = commandValue.split('||')[1] || commandValue;
              if (label.toLowerCase().includes(search.toLowerCase())) {
                return 1;
              }
              return 0;
            }}
          >
            {isSearchable && <CommandInput placeholder={searchPlaceholder} />}
            <CommandList>
              <CommandEmpty>{emptyMessage}</CommandEmpty>
              <CommandGroup
                tabIndex={isSearchable ? -1 : 0}
                className="focus:outline-none"
              >
                {options.map((option) => (
                  <CommandItem
                    key={option.value}
                    value={`${option.value}||${option.label}`}
                    onSelect={(currentValue) => {
                      // Extract the actual value from the unique identifier
                      const selectedValue = currentValue.split('||')[0];
                      onChange(
                        selectedValue === value && !required
                          ? undefined
                          : selectedValue,
                      );
                      setOpen(false);
                    }}
                    disabled={option.disabled}
                  >
                    <Check
                      className={cn(
                        'h-4 w-4',
                        value === option.value ? 'opacity-100' : 'opacity-0',
                      )}
                    />
                    {option.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    );
  };

  return (
    <div className={cn('w-full', className)}>
      {renderSearchableSelect(value || '')}
    </div>
  );
}
