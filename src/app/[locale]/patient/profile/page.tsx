'use client';
import { PatientProfile } from '@/components/reusables/PatientProfile';
import { useUserStore } from '@/zustand/useUserStore';

export default function UserProfile() {
  const { user } = useUserStore();

  return <PatientProfile view="patient" patientId={user?.id || ''} />;
}
