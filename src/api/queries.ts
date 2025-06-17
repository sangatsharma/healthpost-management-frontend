import { TResponse } from '@/types/global';
import { api } from './axios';
import { TLoginReponse, TUser, TUserType } from '@/types/user.types';
import { THealthPostSchema } from '@/schemas/healthPost.schema';

export const login = async (values: {
  email: string;
  accountType: TUserType;
}) => {
  const res = await api.post<TResponse<TUser>>('/auth/login', values);
  if (res.data) {
    return res.data;
  }
};

export const verifyOTP = async (values: { email: string; otp: string }) => {
  const res = await api.post<TLoginReponse>('/auth/validate-otp', values);
  if (res.data) {
    return res.data;
  }
};

export const fetchHealthPostInfo = async ({
  healthPostId,
}: {
  healthPostId: string | null;
}) => {
  const res = await api.get<THealthPostSchema>(`/healthPost/${healthPostId}`);
  if (res.data) {
    return res.data;
  }
};

export const mutateHealthPostInfo = async ({
  healthPostId,
  data,
}: {
  healthPostId: string | null;
  data: THealthPostSchema | Partial<THealthPostSchema>;
}) => {
  const res = await api.post<THealthPostSchema>(
    `/healthPost${healthPostId ? `/${healthPostId}` : ''}`,
    data,
  );
  if (res.data) {
    return res.data;
  }
};
