'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Image from 'next/image';
import { useEffect, useState } from 'react';
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
import { useMutation } from '@tanstack/react-query';
import { login, verifyOTP } from '@/api/queries';
import { toast } from 'sonner';
import { useUserStore } from '@/zustand/useUserStore';
import { Mail } from 'lucide-react';
import Loading from './ui/loading';
import { getLoginSchema, TLoginSchema } from '@/schemas/auth.schema';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [seconds, setSeconds] = useState<number>(60);
  const { portal } = useGetPathInfo();
  const setUser = useUserStore((state) => state.setUser);
  const user = useUserStore();

  const getWelcomeMessage = (
    portal: string,
  ): 'admin_portal' | 'patient_portal' | 'healthpost_portal' => {
    switch (portal.toLowerCase()) {
      case 'hp':
        return 'healthpost_portal';
      case 'admin':
        return 'admin_portal';
      default:
        return 'patient_portal';
    }
  };

  const t = useTypedTranslations('Login');
  const validation = useTypedTranslations('Validation');
  const loginSchema = getLoginSchema(validation);

  const navigate = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<TLoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      otp: '',
      step: 'email',
      accountType: portal || 'PATIENT',
    },
  });
  const otpValue = watch('otp').split('');

  const { mutate: handleLogin, isPending } = useMutation({
    mutationKey: ['login'],
    mutationFn: login,
    retry: false,
    onSuccess: (data) => {
      toast.success(data?.message);
      setStep('otp');
      setValue('step', 'otp');
    },
  });

  const {
    mutate: validateOTP,
    isPending: isOtpPending,
    isSuccess,
  } = useMutation({
    mutationKey: ['validateOTP'],
    mutationFn: verifyOTP,
    retry: false,
    onSuccess: (data) => {
      if (data) {
        const user = data.data.user;
        setUser(user);
        const { refreshToken: _refreshToken, ...dataToStore } = user;
        localStorage.setItem('userInfo', JSON.stringify(dataToStore));
        toast.success(data?.message);
        navigate.push(`/${data?.data.user.accountType.toLowerCase()}`);
      }
    },
  });

  const onSubmit = async (data: TLoginSchema) => {
    if (step === 'email') {
      handleLogin({ email: data.email, accountType: data.accountType });
    } else if (step === 'otp') {
      validateOTP({
        email: data.email,
        otp: data.otp,
      });
    }
  };

  useEffect(() => {
    if (user.isLoggedIn || user.user) {
      const dashboardPath = `/${user.user?.accountType?.toLowerCase()}`;
      navigate.replace(dashboardPath);
    }
  }, [user, portal, navigate]);

  if (user.isLoggedIn || user.user) {
    return <Loading />;
  }
  if (!user.user && !user.isLoggedIn) {
    return (
      <div className="flex h-screen w-full items-center justify-center dark:bg-black/20">
        <div
          className="w-[420px] rounded-2xl border border-emerald-100 px-8 py-8 text-center shadow-lg shadow-emerald-100 backdrop-blur-sm dark:border-slate-300"
          role="region"
          aria-label={t(getWelcomeMessage(portal!))}
        >
          <header className="mb-4 flex flex-col items-center justify-center">
            <Image
              src="/images/doctor.png"
              alt={'Hero avatar'}
              width={150}
              height={150}
              className="rounded-full"
            />
            <h1 className="mb-3 bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text p-2 text-5xl leading-tight font-bold text-transparent">
              {t(getWelcomeMessage(portal!))}
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
                  icon={Mail}
                  autoFocus
                  aria-label={t('email_placeholder')}
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? 'email-error' : undefined}
                  errors={errors.email}
                  {...register('email')}
                  hideError={false}
                  placeholder={t('email_placeholder')}
                  className="w-full text-[18px] placeholder:text-[16px]"
                  allowNepaliTranslation={false}
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
                        autoFocus
                        key={i}
                        index={i}
                        aria-label={`${t('enter_OTP')} ${i + 1}`}
                        className={cn(
                          errors.otp && otpValue[i] === undefined
                            ? 'border-red-500 focus:border-red-500 focus:ring-red-500 focus-visible:ring-red-200'
                            : '',
                          isSuccess &&
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
              isLoading={isPending || isOtpPending}
              disabled={isPending || isOtpPending}
              message={step === 'email' ? t('logging') : t('verifying_OTP')}
              className="w-full"
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
}
