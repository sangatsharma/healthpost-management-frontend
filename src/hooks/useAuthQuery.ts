import { api } from '@/api/axios';
import { TResponse } from '@/types/global';
import { TLoginReponse, TUser } from '@/types/user.types';
import { useQuery } from '@tanstack/react-query';

const fetchUserInfo = async () => {
  const res = await api.get<TResponse<TUser>>('/user');
  if (res.data) {
    return res.data;
  }
};

export const fetchRefreshToken = async () => {
  const res = await api.get<TLoginReponse>('/auth/refresh-token');
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
