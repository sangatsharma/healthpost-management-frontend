import { api } from '@/api/axios';
import { TLoginReponse } from '@/types/user.types';
import { useQuery } from '@tanstack/react-query';

const fetchUserInfo = async () => {
  const res = await api.get<TLoginReponse>('/user');
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
