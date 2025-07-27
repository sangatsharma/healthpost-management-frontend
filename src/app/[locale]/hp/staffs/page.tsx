'use client';
import { DataTable } from '@/components/data-table/data-table';
import { Checkbox } from '@/components/ui/checkbox';
import { ExtendedColumnDef } from '@/types/global';
import { useState } from 'react';
import { AddAdminModal } from './_components/StaffModal';
import { useTypedTranslations } from '@/hooks/useTypedTranslations';
import { renderFullName } from '@/lib/utils';
import { TUser } from '@/types/user.types';
import { queryKeys } from '@/api/queryKeys';
import { ImagePreviewer } from '@/components/reusables/ImagePreviewer';
import Image from 'next/image';
// import { useGlobalAlert } from '@/hooks/useGlobalAlert';
// import { useStaffMutation } from '@/api/mutation';
import { useQuery } from '@tanstack/react-query';
// import { useHasPermission } from '@/hooks/useHasPermission';
// import { Permissions } from '@/zustand/permissions';
import { useUserStore } from '@/zustand/useUserStore';
import { fetchHealthPostStaffInfo } from '@/api/queries';

export default function Page() {
  const [isOpenAddModal, setIsOpenAddModal] = useState<{
    isOpen: boolean;
    staffId?: string;
  }>({
    isOpen: false,
    staffId: undefined,
  });
  const t = useTypedTranslations('GeneralPages');
  // const tAlert = useTypedTranslations('AlertDialog');
  // const tToast = useTypedTranslations('Toast');
  const tenum = useTypedTranslations('Enums');
  const { user } = useUserStore();

  // const { hasWritePermission } = useHasPermission(Permissions.STAFF_MANAGEMENT);

  // const { showDeleteConfirmDialog } = useGlobalAlert();
  // const { mutateStaff } = useStaffMutation({
  //   onSuccess: () => {
  //     toast.success(tToast('staffDeleted'));
  //   },
  // });

  // const ActionOptions = (row: Row<TUser>): ActionButtonDataTypes[] => [
  //   {
  //     name: t('User.editStaff'),
  //     icon: Edit,
  //     onClick: () => {
  //       setIsOpenAddModal({
  //         isOpen: true,
  //         staffId: row.original.id,
  //       });
  //     },
  //   },
  //   {
  //     name: tAlert('action.delete'),
  //     isTrash: true,
  //     icon: Delete,

  //     onClick: () =>
  //       showDeleteConfirmDialog({
  //         onConfirm() {
  //           mutateStaff({
  //             staffId: row.original.id,
  //             method: 'DELETE',
  //           });
  //         },
  //         itemName: renderFullName({
  //           userData: row.original,
  //         }),
  //       }),
  //   },
  // ];

  const columns: ExtendedColumnDef<TUser>[] = [
    {
      id: 'select',
      map: {
        key: 'S/N',
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
        key: 'Name',
        dataTransformer: (data) =>
          renderFullName({
            userData: data,
          }),
      },
      accessorKey: 'name',
      header: () => t('User.fullName'),
      cell: ({ row }) => (
        <span className="font-medium">
          {renderFullName({
            userData: row.original,
          })}
        </span>
      ),
    },

    {
      map: {
        key: 'Email',
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
        key: 'Phone',
        valueFrom: 'phoneNumber',
      },
      accessorKey: 'phone',
      header: () => t('HealthPost.phone'),
      cell: ({ row }) => <span>{row.original.phoneNumber}</span>,
    },
    {
      map: {
        key: 'Gender',
        valueFrom: 'gender',
      },
      accessorKey: 'gender',
      header: () => t('User.gender'),
      cell: ({ row }) => (
        <span>
          {row?.original?.gender
            ? tenum(`gender.${row?.original?.gender}`)
            : '-'}
        </span>
      ),
    },
    {
      map: {
        key: 'Status',
        valueFrom: 'status',
      },
      accessorKey: 'status',
      header: () => t('HealthPost.status'),
      cell: ({ row }) => {
        const status = row.getValue('status');
        return (
          <span
            className={status === 'ACTIVE' ? 'text-green-600' : 'text-red-600'}
          >
            {row?.original?.status}
          </span>
        );
      },
    },
    {
      map: {
        key: 'Role',
        valueFrom: 'role',
      },
      accessorKey: 'role',
      header: () => t('User.role'),
      cell: ({ row }) => (
        <span className="capitalize">
          {row.original.role.replace(/_/g, ' ').toLowerCase()}
        </span>
      ),
    },
    {
      map: {
        key: 'Account Type',
        dataTransformer: (data) =>
          data.accountType ? data.accountType : 'N/A',
      },
      accessorKey: 'accountType',
      header: () => t('User.accountType'),
      cell: ({ row }) => <span>{row.original.accountType}</span>,
    },
    {
      map: {
        key: 'Healthpost',
        dataTransformer: (data) => {
          return data?.healthPost?.name || 'NOT ASSIGNED';
        },
      },
      accessorKey: 'Healthpost',
      header: () => t('HealthPost.name'),
      cell: ({ row }) => (
        <>
          {row.original?.healthPost?.name || (
            <span className="text-red-500">NOT ASSIGNED</span>
          )}
        </>
      ),
    },

    {
      map: {
        key: 'Permissions',
        dataTransformer: (data) =>
          data.permissions && data.permissions.length > 0
            ? `${data.permissions.length}' Permissions'`
            : 'No Permissions',
      },
      accessorKey: 'permissions',
      header: () => t('User.permissions'),
      cell: ({ row }) => {
        return (
          <span
            className={
              row?.original?.permissions?.length >= 1
                ? 'text-green-600'
                : 'text-red-600'
            }
          >
            {row?.original?.permissions?.length} Permissions
          </span>
        );
      },
    },
    {
      map: {
        key: 'Created At',
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
      map: {
        key: 'profileImage',
        valueFrom: 'profileImage',
      },
      id: 'profileImage',
      header: () => t('User.profileImage'),
      cell: ({ row }) => {
        const profileImage = row.original.profileImage;
        return (
          <div className="flex items-center justify-center">
            {profileImage && profileImage.length ? (
              <ImagePreviewer>
                {profileImage.map((image, index) => (
                  <Image
                    key={'image-' + index}
                    src={image}
                    alt={row.original.fullName?.firstName}
                    width={64}
                    height={64}
                    className="rounded-sm"
                  />
                ))}
              </ImagePreviewer>
            ) : (
              <span className="text-muted-foreground">-</span>
            )}
          </div>
        );
      },
      enableSorting: false,
      enableHiding: false,
    },

    // {
    //   id: 'actions',
    //   header: ({ column }) => (
    //     <DataTableColumnHeader
    //       column={column}
    //       title={t('actions')}
    //       className="mr-10 flex justify-end"
    //     />
    //   ),

    //   hideColumn: !hasWritePermission || user?.accountType !== 'ADMIN',
    //   cell: ({ row }) => (
    //     <div className="mr-14 flex justify-end">
    //       <ActionDropdown data={ActionOptions(row)} />
    //     </div>
    //   ),
    //   enableSorting: false,
    //   enableHiding: false,
    // },
  ];

  const { data, ...rest } = useQuery({
    queryKey: queryKeys.staff.staffs,
    queryFn: async () =>
      fetchHealthPostStaffInfo({
        healthPostId: user?.healthPostId || '',
      }),
  });

  return (
    <>
      <div className="p-4">
        <DataTable
          rest={rest}
          columns={columns}
          header={{
            label: t('SidebarItems.staffsmanagement'),
            className: 'text-2xl font-bold mb-4',
          }}
          data={(data?.data as TUser[]) || []}
          utils={{
            showPagination: true,
            hasExport: true,
          }}
          // addButton={
          //   hasWritePermission &&
          //   user?.accountType === 'ADMIN' && {
          //     label: t('User.addStaff'),
          //     icon: <Plus className="mr-2 h-4 w-4" />,
          //     onClick: () =>
          //       setIsOpenAddModal({
          //         isOpen: true,
          //         staffId: undefined,
          //       }),
          //   }
          // }
          onRowClick={() => () => {}}
        />
      </div>
      {isOpenAddModal.isOpen && (
        <AddAdminModal
          isOpen={isOpenAddModal.isOpen}
          staffId={isOpenAddModal.staffId}
          toggleModal={() =>
            setIsOpenAddModal((prev) => ({
              ...prev,
              isOpen: !prev.isOpen,
            }))
          }
        />
      )}
    </>
  );
}
