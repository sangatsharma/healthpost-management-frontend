'use client';
import { DataTable } from '@/components/data-table/data-table';
import { useTypedTranslations } from '@/hooks/useTypedTranslations';
import { TOpd } from '@/types/user.types';
import { useState } from 'react';
import { TicketSheet } from '../../hp/opd-section/_components/OpdTicketSheet';
import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header';
import { ActionDropdown } from '@/components/reusables/custom-action-button';
import { ActionButtonDataTypes, ExtendedColumnDef } from '@/types/global';
import { Checkbox } from '@/components/ui/checkbox';
import { cleanNepaliDate } from '@/lib/utils';
import { Eye } from 'lucide-react';
import { Row } from '@tanstack/react-table';
import { useUserStore } from '@/zustand/useUserStore';
import { useQuery } from '@tanstack/react-query';
import { fetchPatientAllOpds } from '@/api/queries';

export default function PatintReportsPage() {
  const t = useTypedTranslations('GeneralPages');
  const topd = useTypedTranslations('OpdSection');
  const tEnum = useTypedTranslations('Enums');
  const user = useUserStore((state) => state.user);
  const [sheet, setSheet] = useState({
    open: false,
    data: null as TOpd | null,
  });

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
        key: topd('reportType'),
        dataTransformer: () => topd('opd'),
      },
      accessorKey: 'firstName',
      header: () => topd('reportType'),
      cell: () => <span>{topd('opd')}</span>,
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
    queryKey: ['patient-opds'],
    queryFn: () =>
      fetchPatientAllOpds({
        clientId: user?.id || '',
      }),
    enabled: !!user?.id,
  });

  return (
    <>
      <div className="p-4">
        <DataTable
          rest={rest}
          columns={columns}
          header={{
            label: t('SidebarItems.reports'),
            className: 'text-2xl font-bold mb-4',
          }}
          data={(data?.data as TOpd[]) || []}
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
