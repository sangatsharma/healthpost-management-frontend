/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import { useEffect } from 'react';

import { useAuthQuery } from '@/hooks/useAuthQuery';
import { useUserStore } from '@/zustand/useUserDetails';
import { useGetPathInfo } from '@/hooks/useGetPortal';
import { useRouter } from '@/i18n/navigation';
import Loading from '@/components/ui/loading';

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const setUser = useUserStore((state) => state.setUser);
  const setIsLoading = useUserStore((state) => state.setIsLoading);
  const user = useUserStore();
  const { portal, pathname } = useGetPathInfo();

  const { data, isSuccess, isError } = useAuthQuery();
  const router = useRouter();

  useEffect(() => {
    if (isSuccess && data && user.isLoading) {
      console.log('AuthProvider useEffect triggered', user);
      setUser(data.data.user);
      document.cookie = `portal=${data.data?.user?.accountType?.toLowerCase()}; path=/;`;
      setIsLoading(false);
    }

    if (
      !pathname.includes('/login') &&
      ((!user.isLoggedIn && !user.isLoading) || isError)
    ) {
      setIsLoading(false);

      router.replace(`/${portal?.toLowerCase()}/login`);
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
  if (!user.isLoggedIn && user.isLoading && !pathname.includes('login')) {
    return <Loading />;
  }

  return <>{children}</>;
};
