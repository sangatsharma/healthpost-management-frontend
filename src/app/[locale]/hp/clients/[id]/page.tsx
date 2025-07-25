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
      <p>This is the Patient Profile Page with ID: {id}</p>
    </div>
  );
}
