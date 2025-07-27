import { Status, TOpd, TUser } from './user.types';

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

export type TPatientData = {
  date: string;
  serviceCode: string;
  opdNo: string;
  name: string;
  age: string;
  address: string;
  municipality: string;
  ward: string;
  gender: string;
  contactNo: string;
  vitals: {
    bp: string;
    pulse: string;
    temperature: string;
    respiration: string;
    weight: string;
    height: string;
    bpm: string;
    mucus: string;
  };
  observedExamination?: string;
  complaints: string;
  diagnosis: string;
  treatment: string;
  advice: string;
  user: Partial<TUser>;
};

export type TReferral = {
  id: string;
  staffId: string;
  healthPostId: string;
  referredHealthPostId: string;
  referralReason: string | null;
  patientId: string;
  opdId: string;
  referralStatus: 'PENDING' | 'APPROVED' | 'REJECTED' | 'COMPLETED';
  createdAt: string;
  updatedAt: string;
  staff: {
    id: string;
    firstName: string;
    middleName: string;
    lastName: string;
  };
  healthPost: {
    id: string;
    name: string;
  };
  referredHealthPost: {
    id: string;
    name: string;
  };
  patient: {
    id: string;
    firstName: string;
    middleName: string;
    lastName: string;
  };
  referralNo?: string;
  opdVisit: Partial<TOpd>;
};
export enum ReferralStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  COMPLETED = 'COMPLETED',
}
