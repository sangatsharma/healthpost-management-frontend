'use client';

import { useEffect } from 'react';

import { useAuthQuery } from '@/hooks/useAuthQuery';
import { useUserStore } from '@/zustand/useUserDetails';
import { useRouter } from 'next/navigation';

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const setUser = useUserStore((state) => state.setUser);

  const { data, isSuccess, isError } = useAuthQuery();
  const router = useRouter();

  useEffect(() => {
    if (isSuccess && data) {
      setUser(data.data);
    } else if (isSuccess || (isError && !data)) {
      setUser(null);
      router.replace('/login');
    }
  }, [data, setUser, isSuccess, isError, router]);

  return <>{children}</>;
};
