'use client';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { ProtectedRoute } from '@/components/ProtectedRoutes';
import { useTypedTranslations } from '@/hooks/useTypedTranslations';
import { Permissions } from '@/zustand/permissions';

export default function Page() {
  const t = useTypedTranslations('GeneralPages');
  return (
    <ProtectedRoute requiredPermission={Permissions.HEALTH_POST_DASHBOARD}>
      <div>
        <h1>{t('NotFound.title')}</h1>
        <p>Welcome to the healthpost dashboard!</p>
        <p>Welcome to the healthpost dashboard!</p>
        <LanguageSwitcher />
      </div>
    </ProtectedRoute>
  );
}
