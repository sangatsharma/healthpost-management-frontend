'use client';
import { DataTable } from '@/components/data-table/data-table';
import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header';
import { ProtectedRoute } from '@/components/ProtectedRoutes';
import { ActionDropdown } from '@/components/reusables/custom-action-button';
import { Checkbox } from '@/components/ui/checkbox';
import { ActionButtonDataTypes, ExtendedColumnDef } from '@/types/global';
import { Permissions } from '@/zustand/permissions';
import { Row } from '@tanstack/react-table';
import { Delete, Edit, Plus } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { AddHealthPostModal } from './_components/HealthPostModal';
import { THealthPost } from '@/types/healthpost.types';
import { useQuery } from '@tanstack/react-query';
import { fetchHealthPostInfo } from '@/api/queries';
import { queryKeys } from '@/api/queryKeys';
import { useGlobalAlert } from '@/hooks/useGlobalAlert';
import { useHealthPostMutation } from '@/api/mutation';

export default function Page() {
  const [isOpenAddModal, setIsOpenAddModal] = useState<{
    isOpen: boolean;
    healthPostId?: string;
  }>({
    isOpen: false,
    healthPostId: undefined,
  });
  const { showDeleteConfirmDialog } = useGlobalAlert();
  const { mutateHealthPost } = useHealthPostMutation({});

  const ActionOptions = (row: Row<THealthPost>): ActionButtonDataTypes[] => [
    {
      name: 'Edit',
      icon: Edit,
      onClick: () => {
        setIsOpenAddModal({
          isOpen: true,
          healthPostId: row.original.id,
        });
      },
    },
    {
      name: 'Delete',
      isTrash: true,
      icon: Delete,

      onClick: () => {
        showDeleteConfirmDialog({
          onConfirm() {
            mutateHealthPost({
              healthPostId: row.original.id,
              method: 'DELETE',
            });
            toast.success('Health Post deleted successfully!');
          },
          itemName: row.original.name,
        });
      },
    },
  ];

  const columns: ExtendedColumnDef<THealthPost>[] = [
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
        valueFrom: 'name',
      },
      accessorKey: 'name',
      header: () => 'Name',
      cell: ({ row }) => (
        <div className="flex space-x-2">
          <span className="truncate font-medium">{row.getValue('name')}</span>
        </div>
      ),
    },
    {
      map: {
        key: 'WardNo',
        valueFrom: 'wardNo',
      },
      accessorKey: 'wardNo',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Ward No" />
      ),
      cell: ({ row }) => <span>{row.original.wardNo}</span>,
    },
    {
      map: {
        key: 'Email',
        valueFrom: 'email',
      },
      accessorKey: 'email',
      header: () => 'Email',
      cell: ({ row }) => (
        <span className="text-muted-foreground">{row.getValue('email')}</span>
      ),
    },
    {
      map: {
        key: 'Status',
        valueFrom: 'status',
      },
      accessorKey: 'status',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Status" />
      ),
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
        key: 'Municipality',
        valueFrom: 'municipality',
      },
      accessorKey: 'municipality',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Municipality" />
      ),
      cell: ({ row }) => <span>{row.original.municipality}</span>,
    },
    {
      map: {
        key: 'Location',
        valueFrom: 'location',
      },
      accessorKey: 'location',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Location" />
      ),
      cell: ({ row }) => <span>{row.original.location}</span>,
    },
    {
      map: {
        key: 'Phone',
        valueFrom: 'phone',
      },
      accessorKey: 'phone',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Contact" />
      ),
      cell: ({ row }) => <span>{row.original.phone}</span>,
    },

    {
      map: {
        key: 'Created At',
        valueFrom: 'createdAt',
      },
      accessorKey: 'createdAt',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Created At" />
      ),
      cell: ({ row }) => (
        <span>{new Date(row.getValue('createdAt')).toLocaleDateString()}</span>
      ),
    },
    {
      id: 'actions',
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Actions"
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
    queryKey: queryKeys.healthPost.healthPosts,
    queryFn: async () =>
      fetchHealthPostInfo({
        healthPostId: undefined,
      }),
  });

  return (
    <ProtectedRoute requiredPermission={Permissions.HP_MANAGEMENT}>
      <div className="p-4">
        <DataTable
          columns={columns}
          header={{
            label: 'HealthPosts',
            className: 'text-2xl font-bold mb-4',
          }}
          data={(data?.data as THealthPost[]) || []}
          utils={{
            showPagination: true,
            hasExport: true,
          }}
          addButton={{
            label: 'Add Hospital',
            icon: <Plus className="mr-2 h-4 w-4" />,
            onClick: () =>
              setIsOpenAddModal({
                isOpen: true,
                healthPostId: undefined,
              }),
          }}
          onRowClick={() => () => {}}
        />
      </div>
      {isOpenAddModal && (
        <AddHealthPostModal
          isOpen={isOpenAddModal.isOpen}
          healthPostId={isOpenAddModal.healthPostId}
          toggleModal={() =>
            setIsOpenAddModal({
              isOpen: false,
              healthPostId: undefined,
            })
          }
        />
      )}
    </ProtectedRoute>
  );
}
