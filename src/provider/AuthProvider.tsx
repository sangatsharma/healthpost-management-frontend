'use client';

import { useEffect } from 'react';

import { useAuthQuery } from '@/hooks/useAuthQuery';
import { useUserStore } from '@/zustand/useUserDetails';
import { useRouter } from 'next/navigation';
// import { UserRole } from '@/types/user.types';
// import { Action } from '@/zustand/permissions';
// import { set } from 'zod';

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const setUser = useUserStore((state) => state.setUser);

  const { data, isSuccess, isError } = useAuthQuery();
  const router = useRouter();

  useEffect(() => {
    if (isSuccess && data) {
      setUser(data.data.user);
      // } else if (isSuccess || (isError && !data)) {
      //   setUser(null);
      // router.replace('/login');
      // todo remove the following lines to set a default user for testing purposes
      // setUser({
      //   id: 'idsadsadasdsa',
      //   name: {
      //     firstName: 'John',
      //     middleName: 'Doe',
      //     lastName: 'Smith',
      //   },
      //   email: 'Sangat202@gmail.com',
      //   role: UserRole.SUPER_ADMIN,
      //   accountType: 'ADMIN',
      //   phoneNumber: '9806102',
      //   status: true,
      //   permissions: [
      //     {
      //       resource: 'ALL',
      //       action: Action.WRITE,
      //       healthPost: 'asdasdsadasdasdasdasdasdasd',
      //     },
      //   ],
      //   healthPostId: 'asdasdsadasdasdasdasdasdasd',
      // });
      // router.replace('/login');
    }
  }, [data, setUser, isSuccess, isError, router]);

  return <>{children}</>;
};
