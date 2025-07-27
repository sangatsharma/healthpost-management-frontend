'use client';
import { DataTable } from '@/components/data-table/data-table';
import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header';
import { ActionDropdown } from '@/components/reusables/custom-action-button';
import { Checkbox } from '@/components/ui/checkbox';
import { ActionButtonDataTypes, ExtendedColumnDef } from '@/types/global';
import { Row } from '@tanstack/react-table';
import { Eye, Plus, RefreshCcw, Trash } from 'lucide-react';
import { useState } from 'react';
import { useTypedTranslations } from '@/hooks/useTypedTranslations';
import {
  cleanNepaliDate,
  getRequestingParty,
  renderFullName,
} from '@/lib/utils';
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
import { idbPersister } from '@/lib/idbPersister';
import { useGlobalAlert } from '@/hooks/useGlobalAlert';
import { toast } from 'sonner';
import { queryClient } from '@/lib/queryClient';
export default function Page() {
  const [selectedTab, setSelectedTab] = useState<
    'healthpost' | 'all' | 'offline'
  >('healthpost');
  const [sheet, setSheet] = useState({
    open: false,
    data: null as TOpd | null,
  });
  const t = useTypedTranslations('GeneralPages');
  const topd = useTypedTranslations('OpdSection');
  const tToast = useTypedTranslations('Toast');
  const tAlert = useTypedTranslations('AlertDialog');
  const tEnum = useTypedTranslations('Enums');
  const { user, healthPostInfo } = useUserStore();

  const navigate = useRouter();
  const { hasWritePermission } = useHasPermission(
    Permissions.PRESCRIBE_MEDICATION,
  );
  const { showDeleteConfirmDialog } = useGlobalAlert();
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
    ...(selectedTab === 'offline'
      ? [
          {
            name: t('sync'),
            icon: RefreshCcw,
            onClick: () => {
              navigate.push({
                pathname: '/hp/opd-section/register',
                query: { opdId: row.original.id },
              });
            },
          },

          {
            name: tAlert('action.delete'),
            isTrash: true,
            icon: Trash,

            onClick: () =>
              showDeleteConfirmDialog({
                onConfirm: async () => {
                  if (selectedTab === 'offline') {
                    await idbPersister.removeOfflineMutation(row.original.id);
                    queryClient.invalidateQueries({
                      queryKey: ['offline-opd-mutations'],
                    });
                    toast.success(tToast('clientsDeleted'));
                  }
                },
                itemName: row.original.patient.firstName,
              }),
          },
        ]
      : []),
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
        <span>{row.original.patient?.patientCode || '-'}</span>
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
        <span>
          {row.original.followUpDate
            ? cleanNepaliDate(row.getValue('followUpDate'))
            : '-'}
        </span>
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
    queryKey: [
      queryKeys.opd.opds,
      selectedTab,
      selectedTab === 'healthpost'
        ? useUserStore.getState().user?.healthPostId
        : 'all',
    ],
    queryFn: () => fetchOpds({}),
    enabled: selectedTab !== 'offline',
  });

  const { data: offlineData, ...offlineRest } = useQuery({
    queryKey: ['offline-opd-mutations'],
    queryFn: () =>
      idbPersister.getAllOfflineMutations<
        TOpd & {
          name: string;
        }
      >(),
    enabled: selectedTab === 'offline',
    select: (data) => {
      return data
        .filter((d) => getRequestingParty(d.key) === 'OPD')
        .map((d) => ({
          ...d.data,
          id: d.key,
          patient: {
            ...d.data.patient,
            patientCode: '-',
            firstName: d.data.name,
            lastName: '',
            middleName: '',
          },
          healthPost: {
            name: healthPostInfo?.name || '',
          },
        }));
    },
  });

  return (
    <>
      <div className="p-4">
        <DataTable
          rest={selectedTab === 'offline' ? offlineRest : rest}
          Tabs={
            <Tabs
              defaultValue="HealthPost"
              className="w-full max-w-fit cursor-pointer"
            >
              <TabsList className="flkex w-full justify-start gap-2">
                <TabsTrigger
                  value="HealthPost"
                  onClick={() => setSelectedTab('healthpost')}
                >
                  {topd('healthPostTicket')}
                </TabsTrigger>
                <TabsTrigger value="All" onClick={() => setSelectedTab('all')}>
                  {topd('allTickets')}
                </TabsTrigger>
                <TabsTrigger
                  value="offline"
                  onClick={() => setSelectedTab('offline')}
                >
                  {t('offline')}
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
            selectedTab === 'offline'
              ? offlineData || []
              : selectedTab === 'healthpost'
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
