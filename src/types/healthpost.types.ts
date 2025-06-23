import { Status } from './user.types';

export type THealthPost = {
  status: Status;
  phone: string;
  wardNo: string;
  email?: string | undefined;
  name: string;
  municipality?: string | undefined;
  location?: string | undefined;
  images?: (string | File)[] | undefined;
  createdAt?: string | undefined;
  id: string;
};
