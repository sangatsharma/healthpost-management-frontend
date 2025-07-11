'use client';

import type React from 'react';

import { Button } from '@/components/ui/button';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Download } from 'lucide-react';

interface DownloadPdfButtonProps {
  contentRef: React.RefObject<HTMLDivElement | null>;
  fileName?: string;
}

export default function DownloadPdfButton({
  contentRef,
  fileName = 'patient-health-card.pdf',
}: DownloadPdfButtonProps) {
  const handleDownloadPdf = async () => {
    if (contentRef?.current) {
      const input = contentRef.current;
      const canvas = await html2canvas(input, { scale: 2 }); // Increase scale for better quality
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4'); // Portrait, millimeters, A4 size

      const imgWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(fileName);
    }
  };

  return (
    <Button
      onClick={handleDownloadPdf}
      className="flex items-center gap-2 print:hidden"
    >
      <Download className="h-4 w-4" />
      Download PDF
    </Button>
  );
}
