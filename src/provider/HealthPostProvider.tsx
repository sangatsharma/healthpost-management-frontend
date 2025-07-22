/* eslint-disable react-hooks/exhaustive-deps */
'use client';
import { useEffect } from 'react';
import { useUserStore } from '@/zustand/useUserStore';
import { useQuery } from '@tanstack/react-query';
import { fetchHealthPostInfo } from '@/api/queries';
import { queryKeys } from '@/api/queryKeys';
import { THealthPost } from '@/types/healthpost.types';

export const HealthPostProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { user, setHealthPostInfo, isLoggedIn } = useUserStore();

  const { data, isSuccess, isError } = useQuery({
    queryKey: queryKeys.healthPost.singleHealthPost(user?.healthPostId || ''),
    queryFn: () =>
      fetchHealthPostInfo({
        healthPostId: user?.healthPostId,
      }),
    enabled: isLoggedIn && !!user?.healthPostId,
    retry: false,
  });

  useEffect(() => {
    if (typeof window !== 'undefined' && !navigator.onLine) {
      const stored = localStorage.getItem('healthPostInfo');
      const parsed = stored && (JSON.parse(stored) as THealthPost);
      if (parsed) {
        setHealthPostInfo(parsed);
      }

      return;
    }

    if (isSuccess && data) {
      setHealthPostInfo(data?.data as THealthPost);
      localStorage.setItem('healthPostInfo', JSON.stringify(data.data));
    }
  }, [JSON.stringify(data), isSuccess, isError, JSON.stringify(user)]);
  return <>{children}</>;
};
