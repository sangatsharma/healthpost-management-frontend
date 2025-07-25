'use client';
import { DataTable } from '@/components/data-table/data-table';
import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header';
import { ActionDropdown } from '@/components/reusables/custom-action-button';
import { Checkbox } from '@/components/ui/checkbox';
import { ActionButtonDataTypes, ExtendedColumnDef } from '@/types/global';
import { Row } from '@tanstack/react-table';
import { Eye, Plus } from 'lucide-react';
import { useState } from 'react';
import { useTypedTranslations } from '@/hooks/useTypedTranslations';
import { cleanNepaliDate, renderFullName } from '@/lib/utils';
import { fetchOpds } from '@/api/queries';
import { queryKeys } from '@/api/queryKeys';
import { TOpd } from '@/types/user.types';
import { useUserStore } from '@/zustand/useUserStore';
import { useQuery } from '@tanstack/react-query';

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useRouter } from '@/i18n/navigation';
import { TicketSheet } from './_components/ticketSheet';
import { useHasPermission } from '@/hooks/useHasPermission';
import { Permissions } from '@/zustand/permissions';
export default function Page() {
  const [selectedTab, setSelectedTab] = useState<'healthpost' | 'all'>(
    'healthpost',
  );
  const [sheet, setSheet] = useState({
    open: false,
    data: null as TOpd | null,
  });
  const t = useTypedTranslations('GeneralPages');
  const topd = useTypedTranslations('OpdSection');
  const tEnum = useTypedTranslations('Enums');
  const { user } = useUserStore();

  const navigate = useRouter();
  const { hasWritePermission } = useHasPermission(
    Permissions.PRESCRIBE_MEDICATION,
  );

  const ActionOptions = (row: Row<TOpd>): ActionButtonDataTypes[] => [
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

  const columns: ExtendedColumnDef<TOpd>[] = [
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
        key: t('User.fullName'),
        dataTransformer: (data) =>
          renderFullName({
            params: data.patient,
          }),
      },
      accessorKey: 'firstName',
      header: () => t('User.fullName'),
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
        key: topd('ticketDetails.patientCode'),
        valueFrom: 'patient.patientCode',
      },
      accessorKey: 'patient.patientCode',
      header: () => topd('ticketDetails.patientCode'),
      cell: ({ row }) => (
        <span className="">{row.original.patient.patientCode}</span>
      ),
    },
    {
      map: {
        key: topd('visitType'),
        dataTransformer(data) {
          return tEnum(`visitType.${data.visitType}`);
        },
      },
      accessorKey: 'visitType',
      header: () => topd('visitType'),
      cell: ({ row }) => (
        <span className="">{tEnum(`visitType.${row.original.visitType}`)}</span>
      ),
    },
    {
      map: {
        key: topd('treatmentType'),
        dataTransformer(data) {
          return tEnum(`treatmentType.${data.treatementType}`);
        },
      },
      accessorKey: 'treatmentType',
      header: () => topd('treatmentType'),
      cell: ({ row }) => (
        <span className="">
          {tEnum(`treatmentType.${row.original.treatementType}`)}
        </span>
      ),
    },
    {
      map: {
        key: topd('healthPost'),
        valueFrom: 'healthPost.name',
      },
      accessorKey: 'healthPost.name',
      header: () => topd('healthPost'),
      cell: ({ row }) => (
        <span className="">{row.original.healthPost.name}</span>
      ),
    },
    {
      map: {
        key: topd('visitedDate'),
        dataTransformer: (data) => (data.visitedDate ? data.visitedDate : '-'),
      },
      accessorKey: 'visitedDate',
      header: () => topd('visitedDate'),
      cell: ({ row }) => (
        <span>{cleanNepaliDate(row.getValue('visitedDate'))}</span>
      ),
    },
    {
      map: {
        key: topd('followUpDate'),
        dataTransformer: (data) =>
          data.followUpDate ? data.followUpDate : '-',
      },
      accessorKey: 'followUpDate',
      header: () => topd('followUpDate'),
      cell: ({ row }) => (
        <span>{cleanNepaliDate(row.getValue('followUpDate'))}</span>
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
      enableSorting: false,
      enableHiding: false,
    },
  ];

  const { data, ...rest } = useQuery({
    queryKey: [
      queryKeys.opd.opds,
      selectedTab,
      selectedTab === 'healthpost'
        ? useUserStore.getState().user?.healthPostId
        : 'all',
    ],
    queryFn: () => fetchOpds({}),
  });

  return (
    <>
      <div className="p-4">
        <DataTable
          rest={rest}
          Tabs={
            <Tabs
              defaultValue="HealthPost"
              className="w-full max-w-md cursor-pointer"
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger
                  value="HealthPost"
                  onClick={() => setSelectedTab('healthpost')}
                >
                  {topd('healthPostTicket')}
                </TabsTrigger>
                <TabsTrigger value="All" onClick={() => setSelectedTab('all')}>
                  {topd('allTickets')}
                </TabsTrigger>
              </TabsList>
            </Tabs>
          }
          columns={columns}
          header={{
            label: t('SidebarItems.opdSection'),
            className: 'text-2xl font-bold mb-4',
          }}
          data={
            selectedTab === 'healthpost'
              ? (data?.data as TOpd[])?.filter(
                  (item) => item.healthPostId === user?.healthPostId,
                ) || []
              : (data?.data as TOpd[]) || []
          }
          utils={{
            showPagination: true,
            hasExport: true,
          }}
          addButton={
            hasWritePermission && {
              label: topd('newOpdReg'),
              icon: <Plus className="mr-2 h-4 w-4" />,
              onClick: () => navigate.push('/hp/opd-section/register'),
            }
          }
          onRowClick={(row) => {
            setSheet({
              open: true,
              data: row.original,
            });
          }}
        />
      </div>
      {sheet.data && (
        <TicketSheet
          data={sheet.data}
          open={sheet.open}
          onOpenChange={() => {
            setSheet(() => ({ data: null, open: false }));
          }}
        />
      )}
    </>
  );
}
