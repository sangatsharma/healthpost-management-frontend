/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import { useEffect } from 'react';

import { useAuthQuery } from '@/hooks/useAuthQuery';
import { useUserStore } from '@/zustand/useUserStore';
import { useGetPathInfo } from '@/hooks/useGetPortal';
import { useRouter } from '@/i18n/navigation';
import Loading from '@/components/ui/loading';
import { TUser } from '@/types/user.types';

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const setUser = useUserStore((state) => state.setUser);
  const setIsLoading = useUserStore((state) => state.setIsLoading);
  const user = useUserStore();
  const { portal, pathname } = useGetPathInfo();

  const { data, isSuccess, isError } = useAuthQuery();
  const router = useRouter();
  useEffect(() => {
    if (user.isLoggedIn && pathname.includes('/login')) {
      router.replace(`/${portal?.toLowerCase() || 'hp'}`);
      return;
    }
    if (typeof window !== 'undefined' && !navigator.onLine) {
      try {
        const stored = localStorage.getItem('userInfo');
        const parsed = stored && (JSON.parse(stored) as TUser);
        if (parsed) {
          setUser(parsed);
        }
      } catch {
        router.replace(`/${(portal || 'hp').toLowerCase()}/login`);
      }
      return;
    }

    if (isSuccess && data && user.isLoading) {
      setUser(data?.data);
      document.cookie = `portal=${data.data?.accountType?.toLowerCase()}; path=/;`;
      const { refreshToken: _refreshToken, ...dataToStore } = data.data;
      localStorage.setItem('userInfo', JSON.stringify(dataToStore));
      setIsLoading(false);
    }

    if (
      isError ||
      (!pathname.includes('/login') && !user.isLoggedIn && !user.isLoading)
    ) {
      router.replace(`/${(portal || 'hp').toLowerCase()}/login`);
      setIsLoading(false);
    }
  }, [
    JSON.stringify(data),
    isSuccess,
    isError,
    JSON.stringify(user),
    setUser,
    setIsLoading,
    portal,
  ]);

  if ((!user.isLoggedIn || user.isLoading) && !pathname.includes('login')) {
    return <Loading />;
  }

  return <>{children}</>;
};
