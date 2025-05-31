'use client';
import HealthPostSidebar from '@/components/sidebar/sidebar';

export default function InnerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-row gap-4">
      <HealthPostSidebar />
      {children}
    </div>
  );
}
