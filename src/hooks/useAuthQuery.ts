import { api } from '@/api/axios';
import { TPermission, TResponse } from '@/types/global';
import { TUserType, TUser, UserRole } from '@/types/user.types';
import { Permissions } from '@/zustand/permissions';
import { useQuery } from '@tanstack/react-query';

const fetchUserInfo = async () => {
  const res = await api.get<TResponse<TUser>>('/user');
  if (res.data) {
    return res.data;
  }
};

export const useAuthQuery = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const queryResult = useQuery({
    queryKey: ['user'],
    queryFn: fetchUserInfo,
    retry: false,
  });
  return {
    accountType: 'hp' as TUserType,
    email: 'sangat202@gmail.com',
    id: '1',
    name: {
      firstName: 'Sangat',
      middleName: '',
      lastName: 'Sharma',
    },
    role: UserRole.PATIENT,
    status: true,
    healthPostId: 'hp-1',
    permissions: [
      {
        action: 'WRITE',
        healthPost: 'hp-1',
        resource: Permissions.ALL,
      },
    ] as TPermission[],
    phoneNumber: '9800000000',
  };
};
