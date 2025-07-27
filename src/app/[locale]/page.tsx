'use client';
import { useEffect } from 'react';
import { useUserStore } from '@/zustand/useUserStore';
import Loading from '@/components/ui/loading';
import { useRouter } from 'next/navigation';

export default function HomeRedirect() {
  const router = useRouter();
  const { user } = useUserStore();

  useEffect(() => {
    const role = user?.accountType?.toLowerCase() || 'hp';
    if (role === 'admin') {
      router.replace('/admin');
    } else if (role === 'hp') {
      router.replace('/hp');
    } else {
      router.replace('/patient');
    }
  }, [router, user?.accountType]);

  return <Loading />;
}
