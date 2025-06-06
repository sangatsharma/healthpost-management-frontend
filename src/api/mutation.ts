import { TResponse } from '@/types/global';
import { api } from './axios';
import { TUser, TUserType } from '@/types/user.types';

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
  const res = await api.post<TResponse<TUser>>('/auth/validate-otp', values);
  if (res.data) {
    return res.data;
  }
};
