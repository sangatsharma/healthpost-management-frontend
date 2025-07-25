export default function patientProfilePage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <>
      {/* <PatientProfilePage data={} /> */}
      <p>
        This is a placeholder for the Patient Profile Page with ID: {params.id}.
        You can implement the actual profile logic here.
      </p>
    </>
  );
}
