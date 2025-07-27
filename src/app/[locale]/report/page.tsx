'use client';

import { useUserStore } from '@/zustand/useUserStore';

export default function Page() {
  const { user } = useUserStore();

  return (
    <div>
      <h1>Report Page:{user?.fullName.firstName}</h1>
    </div>
  );
}
