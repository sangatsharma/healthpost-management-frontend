'use client';

import type React from 'react';

import { Button } from '@/components/ui/button';
import { Printer } from 'lucide-react';

interface PrintDirectButtonProps {
  contentRef: React.RefObject<HTMLDivElement | null>;
}

export default function PrintDirectButton({
  contentRef,
}: PrintDirectButtonProps) {
  const handlePrint = () => {
    if (contentRef?.current) {
      const printContent = contentRef.current;
      const originalBody = document.body.innerHTML;

      // Temporarily replace the body content with the content to be printed
      document.body.innerHTML = printContent.innerHTML;

      window.print();

      // Restore the original body content after printing
      // Use a timeout to ensure the print dialog has time to open
      setTimeout(() => {
        document.body.innerHTML = originalBody;
        // A small hack to re-render the React app after DOM manipulation
        window.location.reload();
      }, 100);
    }
  };

  return (
    <Button
      onClick={handlePrint}
      className="flex items-center gap-2 print:hidden"
    >
      <Printer className="h-4 w-4" />
      Print Directly
    </Button>
  );
}
