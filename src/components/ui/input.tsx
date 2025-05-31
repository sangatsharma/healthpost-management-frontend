import * as React from 'react';
import { FieldError } from 'react-hook-form';

import { cn } from '@/lib/utils';

function Input({
  className,
  errors,
  type,
  ...props
}: React.ComponentProps<'input'> & { errors?: FieldError }) {
  return (
    <>
      <input
        type={type}
        data-slot="input"
        className={cn(
          'file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
          'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
          'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
          className,
          errors?.message &&
            'border-red-500 focus:border-red-500 focus:ring-red-500 focus-visible:ring-red-200',
        )}
        {...props}
      />
      {errors && (
        <p
          className="text-left text-sm text-red-600"
          id={errors.message}
          role="alert"
        >
          {errors.message}
        </p>
      )}
    </>
  );
}

export { Input };
