'use client';
import { DataTable } from '@/components/data-table/data-table';
import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header';
// import { ProtectedRoute } from '@/components/ProtectedRoutes';
import { ActionDropdown } from '@/components/reusables/custom-action-button';
import { Checkbox } from '@/components/ui/checkbox';
import { ActionButtonDataTypes, ExtendedColumnDef } from '@/types/global';
// import { Permissions } from '@/zustand/permissions';
import { Row } from '@tanstack/react-table';
import { Delete, Edit, Plus } from 'lucide-react';
import { useState } from 'react';
// import { differenceInYears } from 'date-fns';
import { toast } from 'sonner';
import { useTypedTranslations } from '@/hooks/useTypedTranslations';
import { renderFullName } from '@/lib/utils';
import { fetchClientsInfo } from '@/api/queries';
import { queryKeys } from '@/api/queryKeys';
import { useGlobalAlert } from '@/hooks/useGlobalAlert';
import { useStaffMutation } from '@/api/mutation';
import ClientRegistrationModal from './_components/AddClientModal';
import AvatarText from '@/components/reusables/AvatarText';
// import { BSToAD } from 'bikram-sambat-js';
import { TClient } from '@/types/user.types';
import { useUserStore } from '@/zustand/useUserStore';
import BlockEditor from '@/components/block-editor';
import { useQuery } from '@tanstack/react-query';
import { ProtectedRoute } from '@/components/ProtectedRoutes';
import { Permissions } from '@/zustand/permissions';

export default function Page() {
  const [isOpenAddModal, setIsOpenAddModal] = useState<{
    isOpen: boolean;
    client?: TClient;
  }>({
    isOpen: false,
    client: undefined,
  });
  const [value, setValue] = useState('');

  const t = useTypedTranslations('GeneralPages');
  const tAlert = useTypedTranslations('AlertDialog');
  // const tMed = useTypedTranslations('MedicalHistory');
  const ct = useTypedTranslations('ClientRegistration');

  const { showDeleteConfirmDialog } = useGlobalAlert();
  const { mutateStaff } = useStaffMutation({
    onSuccess: () => {
      toast.success('Health Post deleted successfully!');
    },
  });

  const ActionOptions = (row: Row<TClient>): ActionButtonDataTypes[] => [
    {
      name: t('User.editClient'),
      icon: Edit,
      onClick: () => {
        setIsOpenAddModal({
          isOpen: true,
          client: row.original,
        });
      },
    },
    {
      name: tAlert('action.delete'),
      isTrash: true,
      icon: Delete,

      onClick: () =>
        showDeleteConfirmDialog({
          onConfirm() {
            mutateStaff({
              staffId: row.original.id,
              method: 'DELETE',
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
      },
      accessorKey: 'name',
      header: () => t('User.fullName'),
      cell: ({ row }) => {
        console.log(
          'test',
          renderFullName({
            params: row.original,
          }),
        );
        return (
          <AvatarText
            title={renderFullName({
              params: row.original,
            })}
            name={renderFullName({
              params: row.original,
            })}
            // subtitle={`${tMed('age')}: ${differenceInYears(
            //   Date.now(),
            //   BSToAD('2076-01-01'),
            // )} ${tMed('years')} ${tMed('gender')}: ${row.original.gender}`}
            src={
              typeof row?.original?.profileImage === 'string'
                ? row.original.profileImage
                : ''
            }
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
      enableHiding: false,
    },

    {
      map: {
        key: t('User.casteType'),
        valueFrom: 'casteType',
      },
      accessorKey: 'casteType',
      header: () => t('User.casteType'),
      cell: ({ row }) => <span>{row.original.casteType}</span>,
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
      cell: ({ row }) => <span>{row.original.phoneNumber}</span>,
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
      cell: ({ row }) => (
        <div className="mr-14 flex justify-end">
          <ActionDropdown data={ActionOptions(row)} />
        </div>
      ),
      enableSorting: false,
      enableHiding: false,
    },
  ];

  const { data } = useQuery({
    queryKey: queryKeys.staff.staffs,
    queryFn: () =>
      fetchClientsInfo({
        healthPostId: useUserStore.getState().user?.healthPostId || '',
      }),
  });

  return (
    <ProtectedRoute requiredPermission={Permissions.PATIENT_RECORDS}>
      <>
        <div className="p-4">
          <DataTable
            columns={columns}
            header={{
              label: t('SidebarItems.clientsRegistration'),
              className: 'text-2xl font-bold mb-4',
            }}
            data={(data?.data as TClient[]) || []}
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
                }),
            }}
            onRowClick={() => () => {}}
          />
        </div>
        {isOpenAddModal.isOpen && (
          <ClientRegistrationModal
            isOpen={isOpenAddModal.isOpen}
            handleExit={() =>
              setIsOpenAddModal((prev) => ({
                ...prev,
                isOpen: !prev.isOpen,
              }))
            }
          />
        )}
      </>

      <BlockEditor value={value} onChange={setValue} />
    </ProtectedRoute>
  );
}
