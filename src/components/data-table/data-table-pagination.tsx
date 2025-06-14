import { useEffect } from 'react';

import { cn } from '@/lib/utils';

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { generatePaginationLinks } from './generate-pages';
import { Table } from '@tanstack/react-table';

type DataTablePaginationProps<TData> = {
  table: Table<TData>;
  currentPage: number;
  totalPages: number;
  onPageChange: (pageNumber: number) => void;
  showPreviousNext: boolean;
  pageSizeOptions?: number[];
};

const DataTablePagination = <TData,>({
  table,
  currentPage,
  totalPages,
  onPageChange,
  showPreviousNext,
  pageSizeOptions = [10, 20, 50, 100],
}: DataTablePaginationProps<TData>): React.JSX.Element => {
  useEffect(() => {
    if (!pageSizeOptions.includes(table.getState().pagination.pageSize)) {
      table.setPageSize(pageSizeOptions[0]);
    }
  }, [pageSizeOptions, table]);

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center space-x-2">
        <p className="text-sm font-medium whitespace-nowrap">Show</p>
        <Select
          value={`${table.getState().pagination.pageSize}`}
          onValueChange={(value) => {
            table.setPageSize(Number(value));
          }}
        >
          <SelectTrigger className="h-8 w-[5rem]">
            <SelectValue placeholder={table.getState().pagination.pageSize} />
          </SelectTrigger>
          <SelectContent side="top">
            {pageSizeOptions.map((pageSize) => (
              <SelectItem key={pageSize} value={`${pageSize}`}>
                {pageSize}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="text-sm font-medium whitespace-nowrap">Entries</p>
      </div>
      <Pagination>
        <PaginationContent>
          {showPreviousNext && totalPages ? (
            <PaginationItem
              className={cn(
                'cursor-pointer',
                currentPage === 1
                  ? 'pointer-events-none cursor-not-allowed text-gray-400'
                  : '',
              )}
              aria-disabled={currentPage === 1}
            >
              <PaginationPrevious
                onClick={() => onPageChange(currentPage - 1)}
              />
            </PaginationItem>
          ) : null}
          {generatePaginationLinks(currentPage, totalPages, onPageChange)}
          {showPreviousNext && totalPages ? (
            <PaginationItem
              className={cn(
                'cursor-pointer',
                currentPage === totalPages
                  ? 'pointer-events-none cursor-not-allowed text-gray-400'
                  : '',
              )}
              aria-disabled={currentPage === totalPages}
            >
              <PaginationNext
                className="cursor-pointer"
                onClick={() => onPageChange(currentPage + 1)}
              />
            </PaginationItem>
          ) : null}
        </PaginationContent>
      </Pagination>
    </div>
  );
};

export default DataTablePagination;
