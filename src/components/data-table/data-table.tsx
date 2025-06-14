import * as React from 'react';

import { handleDownloadTable } from '@/lib/table-utils';
import { cn } from '@/lib/utils';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import DataTablePagination from './data-table-pagination';
import { DataTableToolbar } from './data-table-toolbar';

import {
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import {
  baseButtonType,
  dataTableHeaderType,
  ExportFileType,
  ExtendedColumnDef,
} from '@/types/global';
import SaveFile from '../reusables/SaveFile';

interface DataTableProps<TData, TValue> {
  columns: ExtendedColumnDef<TData, TValue>[];
  data: TData[];
  onRowClick?: (id: string) => void;
  addButton?: baseButtonType;
  header?: dataTableHeaderType;
  utils?: {
    showPagination: boolean;
    hasExport?: boolean;
  };
}

export function DataTable<TData extends { id: string }, TValue>({
  columns,
  data,
  onRowClick,
  addButton,
  header,
  utils: { showPagination = true, hasExport = true } = {
    showPagination: true,
  },
}: DataTableProps<TData, TValue>) {
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [sortedData, setSortedData] = React.useState<TData[]>(data);
  const [saveModal, setSaveModal] = React.useState(false);

  const [fileInfo, setFileInfo] = React.useState<ExportFileType>({
    name: '',
    sheet: '',
    type: 'xlsx',
  });

  React.useMemo(() => {
    setSortedData(data);
  }, [data]);

  const table = useReactTable({
    data: sortedData,
    columns,
    getRowId: (row) => row?.id,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  return (
    <>
      <div className="space-y-3">
        <DataTableToolbar
          table={table}
          addButton={addButton}
          header={header}
          hasExport={hasExport}
          setSaveModal={setSaveModal}
        />
        <div className="overflow-clip rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead
                        key={header.id}
                        colSpan={header.colSpan}
                        className={
                          header.column.columnDef.meta?.headerClassName
                        }
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && 'selected'}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      if (onRowClick) {
                        onRowClick(row.original.id);
                      }
                    }}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        className={
                          cell.column.columnDef.meta?.cellClassName ??
                          'table-row-width'
                        }
                      >
                        <span className="tablecell">
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
                          )}
                        </span>
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        {showPagination && (
          <div className={cn(`flex items-center py-4`)}>
            <div className="text-muted-foreground flex-1 text-sm whitespace-nowrap">
              {table.getFilteredSelectedRowModel().rows.length} of{' '}
              {table.getFilteredRowModel().rows.length} row(s) selected.
            </div>
            <div className="flex justify-end">
              <DataTablePagination
                table={table}
                currentPage={table.getState().pagination.pageIndex + 1}
                totalPages={table.getPageCount()}
                onPageChange={(pageNumber) =>
                  table.setPageIndex(pageNumber - 1)
                }
                showPreviousNext
              />
            </div>
          </div>
        )}
      </div>
      {saveModal && sortedData?.length && (
        <SaveFile
          isOpen={saveModal}
          toggleModal={setSaveModal}
          fileInfo={fileInfo}
          setFileInfo={setFileInfo}
          onDownload={() =>
            handleDownloadTable({
              columns,
              data: sortedData,
              table,
              file: fileInfo,
            })
          }
        />
      )}
    </>
  );
}
