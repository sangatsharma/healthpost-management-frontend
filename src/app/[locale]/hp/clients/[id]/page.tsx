interface PatientProfilePageProps {
  params: {
    id: string;
  };
}

export default function PatientProfilePage({
  params,
}: PatientProfilePageProps) {
  return (
    <div>
      <p>This is the Patient Profile Page with ID: {params.id}</p>
    </div>
  );
}
