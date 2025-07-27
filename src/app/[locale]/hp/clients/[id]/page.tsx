import { PatientProfile } from '@/components/reusables/PatientProfile';

interface PatientProfilePageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function PatientProfilePage({
  params,
}: PatientProfilePageProps) {
  const { id } = await params;

  return (
    <div>
      <PatientProfile patientId={id} view="healthpost" />
    </div>
  );
}
