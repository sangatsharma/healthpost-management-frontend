import { Status } from '@/types/user.types';

export const UserType = ['patient', 'hp', 'admin'];

export const StatusOptions = [
  { label: Status.ACTIVE, value: Status.ACTIVE },
  { label: Status.INACTIVE, value: Status.INACTIVE },
];
