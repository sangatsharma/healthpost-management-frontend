import { api } from '@/api/axios';
import { TResponse } from '@/types/global';
import { TUser } from '@/types/user.types';

import { useQuery } from '@tanstack/react-query';

const fetchUserInfo = async () => {
  const res = await api.get<TResponse<TUser>>('/user');
  if (res.data) {
    return res.data;
  }
};

export const useAuthQuery = () => {
  const queryResult = useQuery({
    queryKey: ['user'],
    queryFn: fetchUserInfo,
    retry: false,
  });

  return queryResult;
};
