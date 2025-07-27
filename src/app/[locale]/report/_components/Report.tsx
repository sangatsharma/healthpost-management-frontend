'use client';

import { fetchOpds, fetchReferalsByOpd } from '@/api/queries';
import { queryKeys } from '@/api/queryKeys';
import FetchWrapper from '@/components/reusables/fetch-wrapper';
import { PatientHealthCard } from '@/components/reusables/PatientHealthCard.tsx';
import { ReferralHealthCard } from '@/components/reusables/ReferralCard';
import { Button } from '@/components/ui/button';
import { useTypedTranslations } from '@/hooks/useTypedTranslations';
import { cn } from '@/lib/utils';
import { TOpd } from '@/types/user.types';
import { useUserStore } from '@/zustand/useUserStore';
import { useQuery } from '@tanstack/react-query';
import { Printer } from 'lucide-react';
import { notFound, useSearchParams } from 'next/navigation';
import { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';

export default function Report() {
  const user = useUserStore((state) => state.user);
  const searchParams = useSearchParams();
  const reportId = searchParams.get('reportId');
  const reportType = searchParams.get('reportType') as 'opd' | 'referral';
  const patientId = searchParams.get('patientId');
  const isValidUser =
    (user?.accountType === 'PATIENT' && patientId === user?.id) ||
    user?.accountType === 'HP';

  const { data, ...rest } = useQuery({
    queryKey: queryKeys.opd.singleOpd(reportId || ''),
    queryFn: () =>
      fetchOpds({
        opdId: reportId || '',
      }),
    select: (data) =>
      (data?.data as TOpd).patientId === patientId
        ? (data?.data as TOpd)
        : null,
    enabled: !!reportId && isValidUser,
  });

  const tOpd = useTypedTranslations('OpdSection');

  const healthCardRef = useRef<HTMLDivElement>(null);

  const print = useReactToPrint({
    documentTitle: data?.patient?.firstName + `-Health Card`,
    contentRef: healthCardRef,
  });

  const { data: referralData, ...referralRest } = useQuery({
    queryKey: [queryKeys.referral],
    queryFn: () =>
      fetchReferalsByOpd({
        opdId: reportId || '',
      }),
    enabled: !!reportId && reportType === 'referral' && isValidUser,
  });

  if (!isValidUser || !reportId || !patientId) {
    notFound();
  }

  return (
    <div className="mx-auto flex w-fit flex-col items-center gap-4 p-2 pt-4">
      <FetchWrapper {...(rest || referralRest)} isTable>
        <div
          className={cn(
            'flex w-full justify-between gap-4 px-10',
            reportType === 'referral' && 'hidden',
          )}
        >
          <span className="text-2xl">{tOpd('ticketPreview')}</span>

          <Button
            variant="default"
            onClick={() => {
              print();
            }}
            className="flex items-center gap-2 px-3"
          >
            <Printer />
            Print
          </Button>
        </div>

        {data && reportType === 'opd' && (
          <PatientHealthCard
            {...data}
            htmlElementId="patient-health-card"
            ref={healthCardRef}
          />
        )}

        {referralData && data && rest.isSuccess && (
          <ReferralHealthCard data={data} referralData={referralData?.data} />
        )}
      </FetchWrapper>
    </div>
  );
}
