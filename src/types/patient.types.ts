export interface TPatient {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone: string;
  address: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other';
  bloodGroup:
    | 'A+'
    | 'A-'
    | 'B+'
    | 'B-'
    | 'AB+'
    | 'AB-'
    | 'O+'
    | 'O-'
    | 'unknown';
  emergencyContactName: string;
  emergencyContactPhone: string;
  emergencyContactRelation: string;
  medicalHistory?: string;
  allergies?: string;
  currentMedications?: string;
  registrationDate: string;
  status: 'active' | 'inactive';
  age?: number;
}

export interface TPatientFormData {
  firstName: string;
  lastName: string;
  email?: string;
  phone: string;
  address: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other';
  bloodGroup:
    | 'A+'
    | 'A-'
    | 'B+'
    | 'B-'
    | 'AB+'
    | 'AB-'
    | 'O+'
    | 'O-'
    | 'unknown';
  emergencyContactName: string;
  emergencyContactPhone: string;
  emergencyContactRelation: string;
  medicalHistory?: string;
  allergies?: string;
  currentMedications?: string;
}

export interface TPatientTableColumn {
  id: string;
  fullName: string;
  phone: string;
  email?: string;
  age: number;
  gender: string;
  bloodGroup: string;
  registrationDate: string;
  status: 'active' | 'inactive';
}
