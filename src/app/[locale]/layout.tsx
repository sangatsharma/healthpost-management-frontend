'use client';
import { GlobalAlertDialog } from '@/components/reusables/GlobalAlertDialog';
import HealthPostSidebar from '@/components/sidebar/sidebar';

export default function InnerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen justify-start gap-4">
      <GlobalAlertDialog />
      <HealthPostSidebar />
      <div className="w-full">{children}</div>
    </div>
  );
}
