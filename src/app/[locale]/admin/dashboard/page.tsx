'use client';
import { ProtectedRoute } from '@/components/ProtectedRoutes';
import { Permissions } from '@/zustand/permissions';

export default function Page() {
  return (
    <ProtectedRoute requiredPermission={Permissions.ADMIN_DASHBOARD}>
      <div>
        <h1>Dashboard</h1>
        <p>Welcome to the admin dashboard!</p>
      </div>
    </ProtectedRoute>
  );
}
