'use client';
import * as React from 'react';

import { cn } from '@/lib/utils';
import { useLocale } from 'next-intl';
import { ReactTransliterate } from 'react-transliterate';

function Textarea({ className, ...props }: React.ComponentProps<'textarea'>) {
  const locale = useLocale();
  return (
    <>
      {locale === 'np' ? (
        <ReactTransliterate
          renderComponent={(prps) => {
            const inputRef = prps.ref;
            const { ref: _, ...restPrps } = prps;

            return (
              <textarea
                data-slot="textarea"
                className={cn(
                  'border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 flex field-sizing-content min-h-16 w-full rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
                  className,
                )}
                {...props}
                {...restPrps}
                placeholder={props.placeholder || 'Type here...'}
                ref={inputRef}
              />
            );
          }}
          value={
            typeof props.value === 'string'
              ? props.value
              : props.value !== undefined
                ? String(props.value)
                : ''
          }
          onChangeText={(text) => {
            if (props.onChange) {
              const syntheticEvent = {
                target: {
                  name: props.name,
                  value: text,
                },
              };
              props.onChange(
                syntheticEvent as unknown as React.ChangeEvent<HTMLTextAreaElement>,
              );
            }
          }}
          placeholder={props.placeholder}
          lang="ne"
          activeItemStyles={{
            color: 'var(--color-foreground)',
            backgroundColor: 'var(--active-bg)',
          }}
          containerClassName="react-transliterate"
        />
      ) : (
        <textarea
          data-slot="textarea"
          className={cn(
            'border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 flex field-sizing-content min-h-16 w-full rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
            className,
          )}
          {...props}
        />
      )}
    </>
  );
}

export { Textarea };
