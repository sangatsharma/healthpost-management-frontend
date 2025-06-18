'use client';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { ProtectedRoute } from '@/components/ProtectedRoutes';
import { useTypedTranslations } from '@/hooks/useTypedTranslations';
import { Permissions } from '@/zustand/permissions';

export default function Page() {
  const t = useTypedTranslations('GeneralPages');
  return (
    <ProtectedRoute requiredPermission={Permissions.PATIENT_DASHBOARD}>
      <div>
        <h1>{t('NotFound.title')}</h1>
        <p>Welcome to the patient dashboard!</p>
        <LanguageSwitcher />
      </div>
    </ProtectedRoute>
  );
}
