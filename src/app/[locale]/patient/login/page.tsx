'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Image from 'next/image';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import Timer from '@/components/reusables/Timer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui/input-otp';
import { useGetPathInfo } from '@/hooks/useGetPortal';
import { useTypedTranslations } from '@/hooks/useTypedTranslations';
import { cn } from '@/lib/utils';
import { authSchema, TAuthSchema } from '@/schemas/auth.schema';

export default function LoginPage() {
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [seconds, setSeconds] = useState<number>(60);
  const [success, setSuccess] = useState<boolean>(false);

  const { portal } = useGetPathInfo();

  const t = useTypedTranslations('Login');
  const validation = useTypedTranslations('Validation');
  const loginSchema = authSchema.login(validation);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<TAuthSchema['login']>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      otp: '',
      step: 'email',
      accountType: portal,
    },
  });
  const otpValue = watch('otp').split('');

  const onSubmit = async (data: TAuthSchema['login']) => {
    console.log('Form submitted:', data);
    if (step === 'email') {
      console.log('Sending email:', data.email);
      // Send email logic here
      setStep('otp');
      setValue('step', 'otp');
    } else if (step === 'otp') {
      console.log('Verifying OTP:', data.otp);
      setSuccess(true);
      // Verify OTP logic here
    }
  };

  return (
    <div className="flex h-screen w-full items-center justify-center dark:bg-black/20">
      <div
        className="w-[420px] rounded-2xl border border-emerald-100 px-8 py-8 text-center shadow-lg shadow-emerald-100 backdrop-blur-sm dark:border-slate-300"
        role="region"
        aria-label={t('user_portal')}
      >
        <header className="mb-4 flex flex-col items-center justify-center">
          <Image
            src="/doctor.png"
            alt={'Hero avatar'}
            width={150}
            height={150}
            className="rounded-full"
          />
          <h1 className="mb-3 bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text p-2 text-5xl leading-tight font-bold text-transparent">
            {t('user_portal')}
          </h1>
          <p className="mx-auto w-72 text-[18px] dark:text-slate-200">
            {step === 'email' ? t('login_desc') : t('enter_OTP')}
          </p>
        </header>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-3"
          aria-live="polite"
        >
          {step === 'email' ? (
            <>
              <label htmlFor="email" className="sr-only">
                {t('email_placeholder')}
              </label>
              <Input
                id="email"
                type="email"
                autoFocus
                aria-label={t('email_placeholder')}
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? 'email-error' : undefined}
                errors={errors.email}
                {...register('email')}
                placeholder={t('email_placeholder')}
                className="h-12 border-emerald-200 bg-emerald-50 px-4 text-base placeholder:text-[16px] focus:border-emerald-500 focus:ring-emerald-200"
              />
            </>
          ) : (
            <div className="my-4 flex w-full flex-col items-start">
              <label htmlFor="otp" className="sr-only">
                {t('enter_OTP')}
              </label>
              <InputOTP
                id="otp"
                maxLength={6}
                pattern={'^\\d+$'}
                autoFocus
                aria-label={t('enter_OTP')}
                aria-invalid={!!errors.otp}
                aria-describedby={errors.otp ? 'otp-error' : undefined}
                onChange={async (value: string) => {
                  setValue('otp', value);
                }}
              >
                <InputOTPGroup className="space-x-4">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <InputOTPSlot
                      key={i}
                      index={i}
                      aria-label={`${t('enter_OTP')} ${i + 1}`}
                      className={cn(
                        errors.otp && otpValue[i] === undefined
                          ? 'border-red-500 focus:border-red-500 focus:ring-red-500 focus-visible:ring-red-200'
                          : '',
                        success &&
                          'border-green-500 transition-colors duration-300 ease-in-out focus:border-green-500 focus:ring-green-500 focus-visible:ring-green-200',
                      )}
                    />
                  ))}
                </InputOTPGroup>
              </InputOTP>
              {errors.otp && (
                <p
                  id="otp-error"
                  role="alert"
                  className="mt-2 text-left text-sm text-red-600"
                >
                  {errors.otp.message}
                </p>
              )}
            </div>
          )}

          <Button
            type="submit"
            className="text-md h-10 w-full cursor-pointer bg-gradient-to-r from-emerald-600 to-teal-500 font-medium text-white hover:from-emerald-700 hover:to-teal-600"
            aria-label={step === 'email' ? t('login') : t('verify_OTP')}
          >
            {step === 'email' ? t('login') : t('verify_OTP')}
          </Button>

          {step === 'otp' && (
            <div className="flex items-center justify-center gap-1 text-sm dark:text-slate-200">
              <p>{t("didn't_receive_OTP")}</p>
              {seconds === 0 ? (
                <Button
                  onClick={() => {
                    setSeconds(60);
                  }}
                  type="button"
                  variant="ghost"
                  className="p-1 font-medium text-blue-400 underline transition-colors hover:text-blue-700"
                  aria-label={t('resend_OTP')}
                >
                  {t('resend_OTP')}
                </Button>
              ) : (
                <span
                  aria-live="polite"
                  className="ml-2 inline-block text-blue-400"
                  aria-atomic="true"
                >
                  <Timer
                    seconds={seconds}
                    setSeconds={setSeconds}
                    className="inline"
                  />
                </span>
              )}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
