import { z } from 'zod';

export const patientSchema = z.object({
  firstName: z
    .string()
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name must be less than 50 characters'),
  lastName: z
    .string()
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name must be less than 50 characters'),
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
  phone: z
    .string()
    .min(10, 'Phone number must be at least 10 digits')
    .regex(/^[0-9+\-\s()]+$/, 'Invalid phone number format'),
  address: z
    .string()
    .min(5, 'Address must be at least 5 characters')
    .max(200, 'Address must be less than 200 characters'),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  gender: z.enum(['male', 'female', 'other'], {
    required_error: 'Gender is required',
  }),
  bloodGroup: z.enum(
    ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'unknown'],
    {
      required_error: 'Blood group is required',
    },
  ),
  emergencyContactName: z
    .string()
    .min(2, 'Emergency contact name must be at least 2 characters')
    .max(50, 'Emergency contact name must be less than 50 characters'),
  emergencyContactPhone: z
    .string()
    .min(10, 'Emergency contact phone must be at least 10 digits')
    .regex(/^[0-9+\-\s()]+$/, 'Invalid phone number format'),
  emergencyContactRelation: z
    .string()
    .min(2, 'Emergency contact relation must be at least 2 characters')
    .max(30, 'Emergency contact relation must be less than 30 characters'),
  medicalHistory: z
    .string()
    .max(1000, 'Medical history must be less than 1000 characters')
    .optional(),
  allergies: z
    .string()
    .max(500, 'Allergies must be less than 500 characters')
    .optional(),
  currentMedications: z
    .string()
    .max(500, 'Current medications must be less than 500 characters')
    .optional(),
});

export type PatientFormData = z.infer<typeof patientSchema>;
