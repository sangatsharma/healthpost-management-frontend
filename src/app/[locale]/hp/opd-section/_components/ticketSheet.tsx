'use client';
import { PatientHealthCard } from '@/components/reusables/PatientHealthCard.tsx';
import { Button } from '@/components/ui/button';
import { useReactToPrint } from 'react-to-print';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { useTypedTranslations } from '@/hooks/useTypedTranslations';
import { TOpd } from '@/types/user.types';
import { useRef } from 'react';

export function TicketSheet({
  open,
  onOpenChange,
  data,
}: {
  data: TOpd;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const tOpd = useTypedTranslations('OpdSection');

  const healthCardRef = useRef<HTMLDivElement>(null);

  const print = useReactToPrint({
    documentTitle: data.patient.firstName + `-Health Card`,
    contentRef: healthCardRef,
  });
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="!w-5xl !max-w-fit overflow-y-scroll">
        <SheetHeader className="w-full">
          <SheetTitle className="flex w-full justify-between gap-4 px-10">
            <span className="text-2xl">{tOpd('ticketPreview')}</span>

            <Button
              variant="default"
              onClick={() => {
                print();
              }}
            >
              Print
            </Button>
          </SheetTitle>
        </SheetHeader>

        <div className="flex w-fit flex-col items-center gap-4 p-2">
          <PatientHealthCard
            {...data}
            htmlElementId="patient-health-card"
            ref={healthCardRef}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}
