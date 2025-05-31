'use client';

import { useEffect } from 'react';

import { useAuthQuery } from '@/hooks/useAuthQuery';
import { useUserStore } from '@/zustand/useUserDetails';

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const setUser = useUserStore((state) => state.setUser);

  const data = useAuthQuery();

  useEffect(() => {
    if (data) {
      setUser(data);
    }
  }, [data, setUser]);

  return <>{children}</>;
};
