'use client';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { ProtectedRoute } from '@/components/ProtectedRoutes';
import { Permissions } from '@/zustand/permissions';

export default function Page() {
  return (
    <ProtectedRoute requiredPermission={Permissions.PATIENT_DASHBOARD}>
      <div>
        <LanguageSwitcher />
      </div>
    </ProtectedRoute>
  );
}
