'use client';

import { OTPInput, OTPInputContext } from 'input-otp';
import { MinusIcon } from 'lucide-react';
import * as React from 'react';

import { useLocalizedNumber } from '@/hooks/useLocalizedNumber';
import { cn } from '@/lib/utils';

function InputOTP({
  className,
  containerClassName,
  ...props
}: React.ComponentProps<typeof OTPInput> & {
  containerClassName?: string;
}) {
  return (
    <OTPInput
      data-slot="input-otp"
      containerClassName={cn(
        'flex items-center gap-2 has-disabled:opacity-50',
        containerClassName,
      )}
      className={cn('disabled:cursor-not-allowed', className)}
      {...props}
    />
  );
}

function InputOTPGroup({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="input-otp-group"
      className={cn('flex items-center', className)}
      {...props}
    />
  );
}

export interface InputOTPSlotProps extends React.ComponentProps<'div'> {
  index: number;
}

const InputOTPSlot = React.forwardRef<HTMLDivElement, InputOTPSlotProps>(
  ({ index, className, ...props }, ref) => {
    const inputOTPContext = React.useContext(OTPInputContext);
    const { char, hasFakeCaret, isActive } =
      inputOTPContext?.slots?.[index] ?? {};

    const numberFormatter = useLocalizedNumber();
    return (
      <div
        ref={ref}
        data-slot="input-otp-slot"
        data-active={isActive}
        className={cn(
          'relative flex h-10 w-10 items-center justify-center rounded-lg',
          'bg-slate-200 text-2xl font-semibold text-slate-900',
          'border-2 border-transparent transition-all duration-150',
          'data-[active=true]:border-indigo-500 data-[active=true]:bg-white',
          'data-[active=true]:shadow-[0_0_0_2px_rgba(99,102,241,0.2)]',
          'aria-invalid:border-red-500 aria-invalid:data-[active=true]:border-red-500',
          'aria-invalid:data-[active=true]:shadow-[0_0_0_2px_rgba(239,68,68,0.2)]',
          className,
        )}
        {...props}
      >
        {char ? numberFormatter(Number(char)) : null}
        {/* {char} */}
        {hasFakeCaret && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <div className="animate-caret-blink h-8 w-0.5 bg-indigo-500 duration-1000" />
          </div>
        )}
      </div>
    );
  },
);

InputOTPSlot.displayName = 'InputOTPSlot';

function InputOTPSeparator({ ...props }: React.ComponentProps<'div'>) {
  return (
    <div data-slot="input-otp-separator" role="separator" {...props}>
      <MinusIcon />
    </div>
  );
}

export { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator };
