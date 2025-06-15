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
import { toast } from 'sonner';

type THealthpost = {
  id: string;
  name: string;
  email: string;
  status: string;
  role: string;
  createdAt: string;
};

export default function Page() {
  const ActionOptions = (row: Row<THealthpost>): ActionButtonDataTypes[] => [
    {
      name: 'Edit',
      icon: Edit,
      onClick: () => {
        toast.success('Edit action clicked for row: ' + row.original.name);
        // Implement edit functionality here
      },
    },
    {
      name: 'Delete',
      isTrash: true,
      icon: Delete,

      onClick: () => {
        toast.error('Delete action clicked for row: ' + row.original.name);
        // Implement delete functionality here
      },
    },
  ];

  const columns: ExtendedColumnDef<THealthpost>[] = [
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
        key: 'Email',
        valueFrom: 'email',
      },
      accessorKey: 'email',
      header: () => 'Email',
      cell: ({ row }: { row: Row<THealthpost> }) => (
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
            className={status === 'active' ? 'text-green-600' : 'text-red-600'}
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
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Role" />
      ),
      cell: ({ row }) => <span>{row.original.role}</span>,
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
  const data = [
    {
      id: '1',
      name: 'Alice Johnson',
      email: 'alice@example.com',
      status: 'active',
      role: 'Admin',
      createdAt: '2025-05-10T14:23:00',
    },
    {
      id: '2',
      name: 'पृष्ठ फेला परेन',
      email: 'bob@example.com',
      status: 'inactive',
      role: 'User',
      createdAt: '2025-04-18T09:00:00',
    },
    {
      id: '3',
      name: 'Carol Taylor',
      email: 'carol@example.com',
      status: 'active',
      role: 'Moderator',
      createdAt: '2025-06-01T12:45:00',
    },
    {
      id: '4',
      name: 'David Lee',
      email: 'david@example.com',
      status: 'active',
      role: 'User',
      createdAt: '2025-03-30T17:10:00',
    },
    {
      id: '5',
      name: 'Emma Wilson',
      email: 'emma@example.com',
      status: 'inactive',
      role: 'Admin',
      createdAt: '2025-01-22T08:15:00',
    },
  ];

  return (
    <ProtectedRoute requiredPermission={Permissions.HP_MANAGEMENT}>
      <div className="p-4">
        <DataTable
          columns={columns}
          header={{
            label: 'HealthPosts',
            className: 'text-2xl font-bold mb-4',
          }}
          data={data}
          utils={{
            showPagination: true,
            hasExport: true,
          }}
          addButton={{
            label: 'Add Hospital',
            icon: <Plus className="mr-2 h-4 w-4" />,
            onClick: () => () => {},
          }}
          onRowClick={() => () => {}}
        />
      </div>
    </ProtectedRoute>
  );
}
