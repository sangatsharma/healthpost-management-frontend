'use client';
import HealthPostSidebar from '@/components/sidebar/sidebar';

export default function InnerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen justify-start gap-4">
      <HealthPostSidebar />
      <div className="w-full">{children}</div>
    </div>
  );
}
