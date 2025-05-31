import { FileWarning } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center rounded-2xl">
      <div className="flex w-full max-w-2xl flex-col items-center gap-2 rounded-lg p-4 text-center">
        <FileWarning size={56} className="text-yellow-500" />
        <h1 className="text-2xl font-bold text-gray-800">Page Not Found</h1>
        <p className="text-xl text-gray-600">
          The page you are looking for doesn&apos;t exist or has been moved.
        </p>
      </div>
      <div className="flex gap-3">
        <Button variant="default" className="px-4">
          <Link href="/">Return to Home</Link>
        </Button>
        <Button variant="outline" className="px-4 py-2">
          <Link href="/contact">Contact Support</Link>
        </Button>
      </div>
    </div>
  );
}
