'use client';
import { DataTable } from '@/components/data-table/data-table';
import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header';
import { ActionDropdown } from '@/components/reusables/custom-action-button';
import { Checkbox } from '@/components/ui/checkbox';
import { ActionButtonDataTypes, ExtendedColumnDef } from '@/types/global';
import { Row } from '@tanstack/react-table';
import { Delete, Edit, Plus, RefreshCcw } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { useTypedTranslations } from '@/hooks/useTypedTranslations';
import { getRequestingParty, renderFullName } from '@/lib/utils';
import { fetchClientsInfo } from '@/api/queries';
import { queryKeys } from '@/api/queryKeys';
import { useGlobalAlert } from '@/hooks/useGlobalAlert';
import { useClientMutation } from '@/api/mutation';
import ClientRegistrationModal from './_components/AddClientModal';
import AvatarText from '@/components/reusables/AvatarText';
import { TClient } from '@/types/user.types';
import { useUserStore } from '@/zustand/useUserStore';
import { useQuery } from '@tanstack/react-query';
import { ProtectedRoute } from '@/components/ProtectedRoutes';
import { Permissions } from '@/zustand/permissions';
import { BSToAD } from 'bikram-sambat-js';
import { differenceInYears } from 'date-fns';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useHasPermission } from '@/hooks/useHasPermission';
import { useRouter } from 'next/navigation';
import { idbPersister } from '@/lib/idbPersister';
import { queryClient } from '@/lib/queryClient';

export default function Page() {
  const router = useRouter();
  const [isOpenAddModal, setIsOpenAddModal] = useState<{
    isOpen: boolean;
    client?: TClient;
    defaultValues?: TClient & {
      key?: string;
    };
  }>({
    isOpen: false,
    client: undefined,
    defaultValues: undefined,
  });

  const [selectedTab, setSelectedTab] = useState<
    'healthpost' | 'all' | 'offline'
  >('healthpost');
  const t = useTypedTranslations('GeneralPages');
  const tAlert = useTypedTranslations('AlertDialog');
  const tMed = useTypedTranslations('MedicalHistory');
  const tEnum = useTypedTranslations('Enums');
  const ct = useTypedTranslations('ClientRegistration');
  const tToast = useTypedTranslations('Toast');
  const { hasWritePermission } = useHasPermission(Permissions.PATIENT_RECORDS);
  const { showDeleteConfirmDialog } = useGlobalAlert();
  const { mutateClient } = useClientMutation({
    onSuccess: () => {
      toast.success(tToast('clientsDeleted'));
    },
  });

  const ActionOptions = (
    row: Row<
      TClient & {
        key?: string;
      }
    >,
  ): ActionButtonDataTypes[] => [
    {
      name: selectedTab === 'healthpost' ? t('User.editClient') : t('sync'),
      icon: selectedTab === 'healthpost' ? Edit : RefreshCcw,
      onClick: () => {
        setIsOpenAddModal({
          isOpen: true,
          client: row.original.id ? row.original : undefined,
          defaultValues: row.original.id ? undefined : row.original,
        });
      },
    },
    {
      name: tAlert('action.delete'),
      isTrash: true,
      icon: Delete,

      onClick: () =>
        showDeleteConfirmDialog({
          onConfirm: async () => {
            if (selectedTab === 'offline') {
              await idbPersister.removeOfflineMutation(row.original.key);
              queryClient.invalidateQueries({
                queryKey: ['offline-clients-mutations'],
              });
              toast.success(tToast('clientsDeleted'));
              return;
            }

            mutateClient({
              clientId: row.original.id,
              method: 'DELETE',
              healthPostId: useUserStore.getState().user?.healthPostId || '',
            });
          },
          itemName: renderFullName({
            params: row.original,
          }),
        }),
    },
  ];

  const columns: ExtendedColumnDef<TClient>[] = [
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
            params: data,
          }),
        valueFrom: 'firstName',
      },
      accessorKey: 'firstName',
      header: () => t('User.fullName'),
      cell: ({ row }) => {
        let differenceDate;
        try {
          if (row?.original?.dobBs) {
            differenceDate = differenceInYears(
              Date.now(),
              BSToAD(row?.original?.dobBs),
            );
          }
        } catch (_error) {
          differenceDate = '-';
        }
        return (
          <AvatarText
            title={renderFullName({
              params: row.original,
            })}
            name={renderFullName({
              params: row.original,
            })}
            subtitle={`${tMed('age')}: ${
              differenceDate
            } ${tMed('years')} | ${tMed('gender')}: ${tEnum(`gender.${row.original.gender}`)} | ${ct('healthInfo.bloodGroup')}: ${tEnum(`bloodGroup.${row.original.bloodGroup}`)} `}
            src={
              typeof row.original?.profileImage?.[0] === 'string'
                ? row.original?.profileImage?.[0]
                : ''
            }
            classNames={{
              titleClassName: 'text-lg font-semibold',
            }}
          />
        );
      },
    },
    {
      map: {
        key: t('User.gender'),
        valueFrom: 'gender',
      },
      id: 'gender',
      hideColumn: true,
    },

    {
      map: {
        key: t('User.casteType'),
        valueFrom: 'casteType',
      },
      accessorKey: 'casteType',
      header: () => t('User.casteType'),
      cell: ({ row }) => (
        <span>{tEnum(`casteType.${row.original.casteType}`)}</span>
      ),
    },
    {
      map: {
        key: t('User.dateOfBirth'),
        valueFrom: 'dobBs',
      },
      accessorKey: 'dobBs',
      header: () => t('User.dateOfBirth'),
      cell: ({ row }) => <span>{row.original.dobBs}</span>,
    },

    {
      map: {
        key: t('User.email'),
        valueFrom: 'email',
      },
      accessorKey: 'email',
      header: () => t('User.email'),
      cell: ({ row }) => (
        <span className="text-muted-foreground">{row.getValue('email')}</span>
      ),
    },
    {
      map: {
        key: t('HealthPost.phone'),
        valueFrom: 'phoneNumber',
      },
      accessorKey: 'phone',
      header: () => t('HealthPost.phone'),
      cell: ({ row }) => (
        <span>{row.original.phoneNumber || row.original.emergencyContact}</span>
      ),
    },
    {
      map: {
        key: t('HealthPost.createdAt'),
        dataTransformer: (data) =>
          data.createdAt ? new Date(data?.createdAt).toLocaleDateString() : '-',
      },
      accessorKey: 'createdAt',
      header: () => t('HealthPost.createdAt'),
      cell: ({ row }) => (
        <span>{new Date(row.getValue('createdAt')).toLocaleDateString()}</span>
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
      hideColumn: !hasWritePermission || selectedTab === 'all',
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
      queryKeys.client.clients,
      selectedTab,
      selectedTab === 'healthpost'
        ? useUserStore.getState().user?.healthPostId
        : 'all',
    ],
    queryFn: () =>
      fetchClientsInfo({
        healthPostId:
          selectedTab === 'healthpost'
            ? useUserStore.getState().user?.healthPostId || ''
            : undefined,
      }),
    enabled: selectedTab !== 'offline',
  });

  const { data: offlineData, ...offlineRest } = useQuery({
    queryKey: ['offline-clients-mutations'],
    queryFn: () => idbPersister.getAllOfflineMutations<TClient>(),
    enabled: selectedTab === 'offline',
    select: (data) => {
      return data
        .filter((d) => getRequestingParty(d.key) === 'CLIENTS')
        .map((d) => ({ ...d.data, key: d.key }));
    },
  });
  return (
    <ProtectedRoute requiredPermission={Permissions.PATIENT_RECORDS}>
      <div className="p-4">
        <DataTable
          rest={selectedTab === 'offline' ? offlineRest : rest}
          Tabs={
            <Tabs
              defaultValue="HealthPost"
              className="max-w-fit cursor-pointer"
            >
              <TabsList className="flex w-full justify-start gap-2">
                <TabsTrigger
                  value="HealthPost"
                  className="px-3"
                  onClick={() => setSelectedTab('healthpost')}
                >
                  {ct('healthpostPatients')}
                </TabsTrigger>
                <TabsTrigger value="All" onClick={() => setSelectedTab('all')}>
                  {ct('allPatients')}
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
            label: t('SidebarItems.clientsRegistration'),
            className: 'text-2xl font-bold mb-4',
          }}
          data={
            selectedTab === 'offline'
              ? offlineData || []
              : (data?.data as TClient[]) || []
          }
          utils={{
            showPagination: true,
            hasExport: true,
          }}
          addButton={{
            label: ct('addNewClient'),
            icon: <Plus className="mr-2 h-4 w-4" />,
            onClick: () =>
              setIsOpenAddModal({
                isOpen: true,
                client: undefined,
                defaultValues: undefined,
              }),
          }}
          onRowClick={(row) => {
            if (selectedTab !== 'offline') {
              router.push(`/hp/clients/${row.original.id}`);
            }
          }}
        />
      </div>
      {isOpenAddModal.isOpen && (
        <ClientRegistrationModal
          clientId={isOpenAddModal?.client?.id}
          isOpen={isOpenAddModal.isOpen}
          defaultValues={isOpenAddModal.defaultValues}
          handleExit={() =>
            setIsOpenAddModal((prev) => ({
              client: undefined,
              isOpen: !prev.isOpen,
              defaultValues: undefined,
            }))
          }
        />
      )}
    </ProtectedRoute>
  );
}
