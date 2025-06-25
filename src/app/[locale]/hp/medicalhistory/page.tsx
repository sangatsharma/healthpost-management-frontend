import { ProtectedRoute } from '@/components/ProtectedRoutes';
import History from './_components/History';
import { Permissions } from '@/zustand/permissions';

export default function MedicalHistoryPage() {
  return (
    <ProtectedRoute requiredPermission={Permissions.PATIENT_RECORDS}>
      <History />
    </ProtectedRoute>
  );
}
