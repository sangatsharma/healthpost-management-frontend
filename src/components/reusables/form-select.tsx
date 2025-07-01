'use client';
import { useState } from 'react';
import { type FieldPath, type FieldValues } from 'react-hook-form';
import { Check, ChevronsUpDown } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
  onChange: (value: string) => void;
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

  const renderBasicSelect = (value: string) => (
    <Select
      onValueChange={(val) => {
        if (val === value) {
          onChange('');
          setOpen(false);
          return;
        }
        onChange(val);
        setOpen(false);
      }}
      value={options.map((item) => item.value).includes(value) ? value : ''}
      disabled={disabled}
    >
      <SelectTrigger
        className={cn(
          'flex !h-10 w-full justify-between bg-emerald-50 text-center font-normal',
          'border-emerald-200 bg-emerald-50',
          error && 'border-red-500',
        )}
      >
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent className={cn('w-full', popoverClassName)}>
        {options.map((option) => (
          <SelectItem
            key={option.value}
            value={option.value}
            disabled={option.disabled}
          >
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );

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
              'flex w-full justify-between bg-emerald-50 font-normal',
              '!border-emerald-200',
              error && '!border-red-500',
            )}
            disabled={disabled}
          >
            {selectedOption ? (
              selectedOption.label
            ) : (
              <span className="text-muted-foreground">{placeholder}</span>
            )}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className={(cn('w-full p-0'), popoverClassName)}>
          <Command
            className="max-h-64"
            filter={(value, search) => {
              if (value.includes(search.toLowerCase())) {
                return 1;
              }

              return 0;
            }}
          >
            <CommandInput placeholder={searchPlaceholder} />
            <CommandList>
              <CommandEmpty>{emptyMessage}</CommandEmpty>
              <CommandGroup>
                {options.map((option) => (
                  <CommandItem
                    key={option.value}
                    value={option.value}
                    onSelect={(currentValue) => {
                      onChange(
                        currentValue === value && !required ? '' : currentValue,
                      );
                      setOpen(false);
                    }}
                    disabled={option.disabled}
                  >
                    <Check
                      className={cn(
                        'mr-2 h-4 w-4',
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
      {isSearchable
        ? renderSearchableSelect(value || '')
        : renderBasicSelect(value || '')}
    </div>
  );
}
