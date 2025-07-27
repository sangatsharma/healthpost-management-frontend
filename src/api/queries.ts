import { TResponse } from '@/types/global';
import { api } from './axios';
import {
  TClient,
  TLoginReponse,
  TOpd,
  TUser,
  TUserType,
} from '@/types/user.types';
import { THealthPost } from '@/types/healthpost.types';
import { TStaffSchema } from '@/schemas/adminPortal/admin.schema';
import { TOpdSchema } from '@/schemas/healthpostPortal/opd.schema';
//function to handle user login
export const login = async (values: {
  email: string;
  accountType: TUserType;
}) => {
  const res = await api.post<TResponse<TUser>>('/auth/login', values);
  if (res.data) {
    return res.data;
  }
};

//function to handle user logout
export const logout = async () => {
  const res = await api.get<TResponse<TUser>>('/auth/logout');
  if (res.data) {
    return res.data;
  }
};

//function to handle otp verification
export const verifyOTP = async (values: { email: string; otp: string }) => {
  const res = await api.post<TLoginReponse>('/auth/validate-otp', values);
  if (res.data) {
    return res.data;
  }
};

//function to retrieve healthpost information
export const fetchHealthPostInfo = async ({
  healthPostId,
}: {
  healthPostId?: string;
}) => {
  const res = await api.get<TResponse<THealthPost[] | THealthPost>>(
    `/healthpost${healthPostId ? `/${healthPostId}` : ''}`,
  );
  if (res.data) {
    return res.data;
  }
};

// function to mutate healthpost information
// It can be used for both creating and updating health post information
// If healthPostId is provided, it will update the specific health post information
// If healthPostId is not provided, it will create a new health post
export const mutateHealthPostInfo = async ({
  healthPostId,
  data,
  method,
}: {
  healthPostId?: string;
  data?: FormData;
  method: 'POST' | 'PUT' | 'DELETE';
}) => {
  let res;
  const url = `/healthPost${healthPostId ? `/${healthPostId}` : ''}`;
  if (method === 'POST') {
    res = await api.post<THealthPost>(url, data);
  } else if (method === 'PUT') {
    res = await api.put<THealthPost>(url, data);
  } else if (method === 'DELETE') {
    res = await api.delete<THealthPost>(url);
  } else {
    throw new Error('Invalid method');
  }
  if (res.data) {
    return res.data;
  }
};

//function to retrieve staff information
// It can be used for both creating and updating staff information
// If staffId is provided, it will fetch the specific staff information
// If staffId is not provided, it will fetch all staff information
export const fetchStaffInfo = async ({ staffId }: { staffId?: string }) => {
  const res = await api.get<TResponse<TUser[] | TUser>>(
    `/user${staffId ? `/${staffId}` : ''}`,
  );
  if (res.data) {
    return res.data;
  }
};

export const fetchHealthPostStaffInfo = async ({
  healthPostId,
}: {
  healthPostId: string;
}) => {
  if (!healthPostId) {
    throw new Error('Health Post ID is required');
  }
  const res = await api.get<TResponse<TUser[] | TUser>>(
    `/healthpost/${healthPostId}/staff`,
  );
  if (res.data) {
    return res.data;
  }
};

export const mutateStaffInfo = async ({
  staffId,
  data,
  method,
}: {
  staffId?: string;
  data?: FormData;
  method: 'POST' | 'PUT' | 'DELETE';
}) => {
  let res;
  const url = `/auth/register${staffId ? `/${staffId}` : ''}`;
  if (method === 'POST') {
    res = await api.post<TStaffSchema>(url, data);
  } else if (method === 'PUT') {
    res = await api.put<TStaffSchema>(`/user/${staffId}`, data);
  } else if (method === 'DELETE') {
    res = await api.delete<TStaffSchema>(`/user/${staffId}`);
  } else {
    throw new Error('Invalid method');
  }
  if (res.data) {
    return res.data;
  }
};

export const fetchClientsInfo = async ({
  clientId,
  healthPostId,
}: {
  healthPostId?: string;
  clientId?: string;
}) => {
  let res;
  if (!healthPostId) {
    res = await api.get<TResponse<TClient[] | TClient>>(
      `/patient${clientId ? `/${clientId}` : ''}`,
    );
  } else {
    res = await api.get<TResponse<TClient[] | TClient>>(
      `/healthpost/${healthPostId}/patient${clientId ? `/${clientId}` : ''}`,
    );
  }
  if (res.data) {
    return res.data;
  }
};

export const mutateClientInfo = async ({
  clientId,
  data,
  method,
  healthPostId,
}: {
  clientId?: string;
  data?: FormData;
  method: 'POST' | 'PUT' | 'DELETE';
  healthPostId: string;
}) => {
  let res;
  const url = `/healthpost/${healthPostId}/patient`;
  if (method === 'POST') {
    res = await api.post<TStaffSchema>(url, data);
  } else if (method === 'PUT') {
    res = await api.put<TStaffSchema>(`${url}`, data);
  } else if (method === 'DELETE') {
    res = await api.delete<TStaffSchema>(`${url}/${clientId}`);
  } else {
    throw new Error('Invalid method');
  }
  if (res.data) {
    return res.data;
  }
};

export const mutateOpdInfo = async ({
  patientId,
  data,
  method,
}: {
  patientId?: string;
  data?: object;
  method: 'POST' | 'PUT' | 'DELETE';
}) => {
  let res;
  const url = `/opd`;
  if (method === 'POST') {
    res = await api.post<TOpdSchema>(url, data);
  } else if (method === 'PUT') {
    res = await api.put<TOpdSchema>(`${url}/${patientId}`, data);
  } else if (method === 'DELETE') {
    res = await api.delete<TOpdSchema>(`${url}/${patientId}`);
  } else {
    throw new Error('Invalid method');
  }
  if (res.data) {
    return res.data;
  }
};

export const fetchOpds = async ({ clientId }: { clientId?: string }) => {
  let res;
  if (clientId) {
    res = await api.get<TResponse<TOpd[] | TOpd>>(
      `/opd${clientId ? `/${clientId}` : ''}`,
    );
  } else {
    res = await api.get<TResponse<TOpd[]>>('/opd');
  }
  if (res.data) {
    return res.data;
  }
};
