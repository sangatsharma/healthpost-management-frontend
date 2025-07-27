'use client';
import { fetchReferals } from '@/api/queries';
import { queryKeys } from '@/api/queryKeys';
import { DataTable } from '@/components/data-table/data-table';
import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header';
import { ActionDropdown } from '@/components/reusables/custom-action-button';
import { Checkbox } from '@/components/ui/checkbox';
import { TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTypedTranslations } from '@/hooks/useTypedTranslations';
import { renderFullName } from '@/lib/utils';
import { ActionButtonDataTypes, ExtendedColumnDef } from '@/types/global';
import { TReferral } from '@/types/healthpost.types';
import { useUserStore } from '@/zustand/useUserStore';
import { Tabs } from '@radix-ui/react-tabs';
import { useQuery } from '@tanstack/react-query';
import { Row } from '@tanstack/react-table';
import { ADToBS } from 'bikram-sambat-js';
import { Check, CircleCheckBig, CircleX, Eye, Loader } from 'lucide-react';
import { useState } from 'react';
import { ReferralTicketSheet } from './ReferralTicketSheet';
import { useReferalStatusMutation } from '@/api/mutation';

export default function ReferalTable() {
  const [selectedTab, setSelectedTab] = useState<'SENT' | 'RECEIVED'>(
    'RECEIVED',
  );
  const [sheet, setSheet] = useState({
    open: false,
    data: null as TReferral | null,
  });
  const tRef = useTypedTranslations('Referral');
  const t = useTypedTranslations('GeneralPages');
  const topd = useTypedTranslations('OpdSection');
  const tEnum = useTypedTranslations('Enums');
  const tToast = useTypedTranslations('Toast');
  const user = useUserStore((state) => state.user);

  const { mutateStatus } = useReferalStatusMutation({
    onSuccess: () => {
      tToast('statusUpdated');
    },
  });

  const ActionOptions = (row: Row<TReferral>): ActionButtonDataTypes[] => {
    const status = row.original.referralStatus;
    const actions: ActionButtonDataTypes[] = [
      {
        name: topd('viewTicket'),
        icon: Eye,
        onClick: () => {
          setSheet({
            open: true,
            data: row.original,
          });
        },
      },
    ];

    if (selectedTab === 'RECEIVED') {
      switch (status) {
        case 'PENDING':
          actions.push(
            {
              name: tRef('ticketDetails.markAsApproved'),
              icon: CircleCheckBig,
              onClick: () => {
                mutateStatus({
                  referralId: row.original.id,
                  status: 'APPROVED',
                });
              },
            },
            {
              name: tRef('ticketDetails.markasRejected'),
              icon: CircleX,
              onClick: () => {
                mutateStatus({
                  referralId: row.original.id,
                  status: 'REJECTED',
                });
              },
            },
          );
          break;
        case 'APPROVED':
          actions.push(
            {
              name: tRef('ticketDetails.markasCompleted'),
              icon: Check,
              onClick: () => {
                mutateStatus({
                  referralId: row.original.id,
                  status: 'COMPLETED',
                });
              },
            },
            {
              name: tRef('ticketDetails.markasRejected'),
              icon: CircleX,
              onClick: () => {
                mutateStatus({
                  referralId: row.original.id,
                  status: 'REJECTED',
                });
              },
            },
          );
          break;
        case 'REJECTED':
          actions.push({
            name: tRef('ticketDetails.markasPending'),
            icon: Loader,
            onClick: () => {},
          });
          break;
        default:
          break;
      }
    }

    return actions;
  };

  const columns: ExtendedColumnDef<TReferral>[] = [
    {
      id: 'select',
      map: {
        key: t('SN'),
        valueFrom: 'id',
      },
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && 'indeterminate')
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
          className="translate-y-[2px]"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
          className="translate-y-[2px]"
        />
      ),
      meta: {
        headerClassName: 'w-8',
        cellClassName: 'w-8',
      },
      enableSorting: false,
      enableHiding: false,
    },
    {
      map: {
        key: tRef('referredPatient'),
        dataTransformer: (data) =>
          renderFullName({
            params: data.patient,
          }),
      },
      accessorKey: 'firstName',
      header: () => tRef('referredPatient'),
      cell: ({ row }) => (
        <span>
          {renderFullName({
            params: row.original.patient,
          })}
        </span>
      ),
    },
    {
      map: {
        key: tRef('referredHealthPost'),
        valueFrom:
          selectedTab === 'RECEIVED'
            ? 'referredHealthPost.name'
            : 'healthPost.name',
      },
      accessorKey:
        selectedTab === 'RECEIVED'
          ? 'referredHealthPost.name'
          : 'healthPost.name',
      header: () => tRef('referredHealthPost'),
      cell: ({ row }) => (
        <span className="">{row.original.referredHealthPost?.name}</span>
      ),
    },
    {
      map: {
        key: tRef('referralReason'),
        dataTransformer: (data) => data.referralReason || '-',
      },
      accessorKey: 'referralReason',
      header: () => tRef('referralReason'),
      cell: ({ row }) => <span>{row.original.referralReason || '-'}</span>,
    },
    {
      map: {
        key: tRef('referredBy'),
        dataTransformer: (data) => renderFullName({ params: data.staff }),
      },
      accessorKey: 'staffId',
      header: () => tRef('referredBy'),
      cell: ({ row }) => (
        <span>
          {renderFullName({
            params: row.original.staff,
          })}
        </span>
      ),
    },
    {
      map: {
        key: 'Created At',
        dataTransformer: (data) =>
          data.createdAt
            ? ADToBS(new Date(data.createdAt).toLocaleDateString())
            : '-',
      },
      accessorKey: 'createdAt',
      header: () => tRef('referralDate'),
      cell: ({ row }) => (
        <span>
          {ADToBS(new Date(row.getValue('createdAt')).toLocaleDateString())}
        </span>
      ),
    },
    {
      map: {
        key: tRef('status'),
        valueFrom: 'referralStatus',
      },
      accessorKey: 'referralStatus',
      header: () => tRef('status'),
      cell: ({ row }) => (
        <span>{tEnum(`referralStatus.${row.original.referralStatus}`)}</span>
      ),
    },
    {
      id: 'actions',
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t('actions')}
          className="mr-10 flex justify-end"
        />
      ),
      cell: ({ row }) => (
        <div className="mr-14 flex justify-end">
          <ActionDropdown data={ActionOptions(row)} />
        </div>
      ),
      enableHiding: false,
    },
  ];

  const { data, ...rest } = useQuery({
    queryKey: [queryKeys.referral, selectedTab],
    queryFn: () =>
      fetchReferals({
        healthPostId: user?.healthPostId || '',
        type: selectedTab,
      }),
    enabled: !!user?.healthPostId,
  });

  return (
    <div className="flex flex-col p-4">
      <DataTable
        rest={rest}
        Tabs={
          <Tabs defaultValue="RECEIVED" className="max-w-fit cursor-pointer">
            <TabsList className="flex w-full justify-start gap-2">
              <TabsTrigger
                value="RECEIVED"
                className="px-3"
                onClick={() => setSelectedTab('RECEIVED')}
              >
                {tRef('receivedReferals')}
              </TabsTrigger>
              <TabsTrigger value="All" onClick={() => setSelectedTab('SENT')}>
                {tRef('sentReferals')}
              </TabsTrigger>
            </TabsList>
          </Tabs>
        }
        header={{
          label: t('SidebarItems.referrals'),
          className: 'text-2xl font-bold mb-4',
        }}
        utils={{
          showPagination: true,
          hasExport: true,
        }}
        onRowClick={(row) => {
          setSheet({
            open: true,
            data: row.original,
          });
        }}
        data={data?.data || []}
        columns={columns}
      />

      {sheet.data && (
        <ReferralTicketSheet
          referraldata={sheet.data}
          opdId={sheet.data.opdId}
          open={sheet.open}
          onOpenChange={() => {
            setSheet(() => ({ data: null, open: false }));
          }}
        />
      )}
    </div>
  );
}
