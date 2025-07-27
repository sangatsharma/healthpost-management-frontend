'use client';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/api/queryKeys';
import { fetchOpds } from '@/api/queries';
import { TOpd } from '@/types/user.types';
import FetchWrapper from '@/components/reusables/fetch-wrapper';
import { TReferral } from '@/types/healthpost.types';
import { ReferralHealthCard } from '@/components/reusables/ReferralCard';

export function ReferralTicketSheet({
  open,
  onOpenChange,
  opdId,
  referraldata,
}: {
  opdId: string;
  open: boolean;
  referraldata: TReferral;
  onOpenChange: (open: boolean) => void;
}) {
  const { data, ...rest } = useQuery({
    queryKey: queryKeys.opd.singleOpd(opdId || ''),
    queryFn: () =>
      fetchOpds({
        opdId: opdId || '',
      }),
    select: (data) => data?.data as TOpd,

    enabled: !!opdId,
  });

  return (
    <FetchWrapper {...rest}>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent className="!w-5xl !max-w-fit overflow-y-scroll">
          <div className="flex w-fit flex-col items-center gap-4 p-2">
            {data && rest.isSuccess && (
              <ReferralHealthCard data={data} referralData={referraldata} />
            )}
          </div>
        </SheetContent>
      </Sheet>
    </FetchWrapper>
  );
}
