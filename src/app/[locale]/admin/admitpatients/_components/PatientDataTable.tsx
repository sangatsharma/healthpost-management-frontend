'use client';

import { useState } from 'react';
import { Eye, Edit, Trash2, MoreHorizontal } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { DataTable } from '@/components/data-table/data-table';
import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header';
import { TPatient } from '@/types/patient.types';
import { ExtendedColumnDef } from '@/types/global';

interface PatientDataTableProps {
  patients: TPatient[];
  onView: (patient: TPatient) => void;
  onEdit: (patient: TPatient) => void;
  onDelete: (patientId: string) => void;
}

export function PatientDataTable({
  patients,
  onView,
  onEdit,
  onDelete,
}: PatientDataTableProps) {
  const t = useTranslations('GeneralPages.Patient');
  const [deletePatientId, setDeletePatientId] = useState<string | null>(null);

  const columns: ExtendedColumnDef<TPatient>[] = [
    {
      map: {
        key: 'Full Name',
        mergedValuesFrom: ['firstName', 'lastName'],
        dataTransformer: (data) => `${data.firstName} ${data.lastName}`,
      },
      accessorKey: 'fullName',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('fullName')} />
      ),
      cell: ({ row }) => (
        <div className="font-medium">
          {row.original.firstName} {row.original.lastName}
        </div>
      ),
    },
    {
      map: {
        key: 'Phone',
        valueFrom: 'phone',
      },
      accessorKey: 'phone',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('phone')} />
      ),
      cell: ({ row }) => (
        <div className="font-mono text-sm">{row.original.phone}</div>
      ),
    },
    {
      map: {
        key: 'Email',
        valueFrom: 'email',
      },
      accessorKey: 'email',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('email')} />
      ),
      cell: ({ row }) => (
        <div className="text-muted-foreground text-sm">
          {row.original.email || 'N/A'}
        </div>
      ),
    },
    {
      map: {
        key: 'Age',
        valueFrom: 'age',
      },
      accessorKey: 'age',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('age')} />
      ),
      cell: ({ row }) => <div className="text-center">{row.original.age}</div>,
    },
    {
      map: {
        key: 'Gender',
        valueFrom: 'gender',
      },
      accessorKey: 'gender',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('gender')} />
      ),
      cell: ({ row }) => (
        <Badge variant="outline" className="capitalize">
          {t(row.original.gender)}
        </Badge>
      ),
    },
    {
      map: {
        key: 'Blood Group',
        valueFrom: 'bloodGroup',
      },
      accessorKey: 'bloodGroup',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('bloodGroup')} />
      ),
      cell: ({ row }) => (
        <Badge variant="secondary">{row.original.bloodGroup}</Badge>
      ),
    },
    {
      map: {
        key: 'Registration Date',
        dataTransformer: (data) =>
          new Date(data.registrationDate).toLocaleDateString(),
      },
      accessorKey: 'registrationDate',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('registrationDate')} />
      ),
      cell: ({ row }) => (
        <div className="text-sm">
          {new Date(row.original.registrationDate).toLocaleDateString()}
        </div>
      ),
    },
    {
      map: {
        key: 'Status',
        valueFrom: 'status',
      },
      accessorKey: 'status',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('status')} />
      ),
      cell: ({ row }) => (
        <Badge
          variant={row.original.status === 'active' ? 'default' : 'secondary'}
          className={
            row.original.status === 'active'
              ? 'bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900 dark:text-green-100'
              : ''
          }
        >
          {t(row.original.status)}
        </Badge>
      ),
    },
    {
      id: 'actions',
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t('actions')}
          className="flex justify-end"
        />
      ),
      cell: ({ row }) => {
        const patient = row.original;

        return (
          <div className="flex justify-end">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onView(patient)}>
                  <Eye className="mr-2 h-4 w-4" />
                  {t('view')}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onEdit(patient)}>
                  <Edit className="mr-2 h-4 w-4" />
                  {t('edit')}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setDeletePatientId(patient.id)}
                  className="text-destructive"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  {t('delete')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
      enableSorting: false,
      enableHiding: false,
    },
  ];

  return (
    <>
      <DataTable
        columns={columns}
        data={patients}
        header={{
          label: t('patients'),
          className: 'text-2xl font-bold mb-4',
        }}
        utils={{
          showPagination: true,
          hasExport: true,
        }}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={!!deletePatientId}
        onOpenChange={() => setDeletePatientId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              patient record.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeletePatientId(null)}>
              {t('cancel')}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (deletePatientId) {
                  onDelete(deletePatientId);
                  setDeletePatientId(null);
                }
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {t('delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
