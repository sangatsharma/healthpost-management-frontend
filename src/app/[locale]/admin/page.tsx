'use client';

import { useTypedTranslations } from '@/hooks/useTypedTranslations';
import { renderFullName } from '@/lib/utils';
import { useUserStore } from '@/zustand/useUserStore';
import { Heart } from 'lucide-react';

export default function Page() {
  const t = useTypedTranslations('GeneralPages');
  const { user } = useUserStore();
  return (
    <div className="flex h-screen flex-col items-center justify-center text-center">
      <div className="mx-auto mb-4 flex size-24 items-center justify-center gap-8 rounded-full bg-gradient-to-br from-rose-500 to-pink-600 shadow-2xl">
        <Heart className="size-12 text-white" />
      </div>

      <h1 className="text-5xl font-bold tracking-tight md:text-6xl">
        <span className="bg-gradient-to-r from-rose-600 via-pink-600 to-violet-600 bg-clip-text text-transparent">
          {t('welcome', {
            name:
              renderFullName({
                params: user?.fullName,
              }) || 'User',
          })}
        </span>
        <br />
      </h1>

      <p className="mx-auto mb-8 max-w-3xl text-xl leading-relaxed text-gray-600 md:text-2xl">
        {t('selectTab')}
      </p>
    </div>
  );
}
import React from 'react';
