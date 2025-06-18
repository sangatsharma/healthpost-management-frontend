import * as React from 'react';
import { FieldError } from 'react-hook-form';

import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

function Input({
  className,
  errors,
  type,
  ...props
}: React.ComponentProps<'input'> & { errors?: FieldError; icon?: LucideIcon }) {
  return (
    <div>
      <div className="relative flex w-full items-center">
        {props.icon && (
          <props.icon
            className="text-muted-foreground absolute top-1/2 left-3 -translate-y-1/2 transform"
            size={22}
            onClick={(e) => {
              if (props.onClick) {
                props.onClick(
                  e as unknown as React.MouseEvent<HTMLInputElement>,
                );
              }
            }}
          />
        )}
        <input
          type={type}
          data-slot="input"
          className={cn(
            props.icon && '!pl-10',
            'file:text-foreground placeholder:text-muted-foreground selection:text-primary-foreground dark:bg-input/30 border-input my-auto flex h-10 min-w-0 rounded-md border bg-transparent px-3 pt-1 pb-2 shadow-xs transition-[color,box-shadow] outline-none selection:bg-blue-500 file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
            'focus-visible:border-ring focus-visible:ring-ring/50 border-emerald-200 bg-emerald-50 focus:border-emerald-500 focus:ring-emerald-200 focus-visible:ring-[3px]',
            'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive w-[250px]',
            className,
            errors?.message &&
              'border-red-500 focus:border-red-500 focus:ring-red-500 focus-visible:ring-red-200',
          )}
          {...props}
        />
      </div>
      {errors && (
        <p
          className="text-md mt-1 text-left text-red-600"
          id={errors.message}
          role="alert"
        >
          {errors.message}
        </p>
      )}
    </div>
  );
}

export { Input };
