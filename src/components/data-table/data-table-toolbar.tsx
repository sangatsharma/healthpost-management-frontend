'use client';
import { RefreshCcw, SearchIcon, Share, SquareChevronLeft } from 'lucide-react';
import { ReactNode, useEffect, useRef, useState } from 'react';

import { cn } from '@/lib/utils';

import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Table } from '@tanstack/react-table';
import { baseButtonType, dataTableHeaderType } from '@/types/global';
import { useRouter } from '@/i18n/navigation';
import { queryClient } from '@/lib/queryClient';
import { toast } from 'sonner';
import { useTypedTranslations } from '@/hooks/useTypedTranslations';

interface DataTableToolbarProps<TData> {
  table?: Table<TData>;
  addButton?: baseButtonType;
  header?: dataTableHeaderType;
  hasExport?: boolean;
  allowSearch?: boolean;
  setSaveModal?: React.Dispatch<React.SetStateAction<boolean>>;
  backNavigationUrl?: string;
  Tabs?: ReactNode;
}

export function DataTableToolbar<TData>({
  table,
  addButton,
  header,
  allowSearch = true,
  setSaveModal,
  hasExport,
  backNavigationUrl,
  Tabs,
}: DataTableToolbarProps<TData>) {
  const ref = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const [showSearch, setShowSearch] = useState(false);
  const t = useTypedTranslations('GeneralPages');
  const tToast = useTypedTranslations('Toast');
  useEffect(() => {
    if (showSearch && ref.current) {
      ref.current?.focus();
    }
  }, [showSearch]);

  return (
    <div className="flex items-center justify-between gap-2">
      <div className="flex w-full items-center gap-2">
        {backNavigationUrl && (
          <Button
            variant="ghost"
            className="text-primary !px-2 text-2xl"
            onClick={() => router.back()}
            title="Go Back"
          >
            <SquareChevronLeft className="bg-accent size-7" />
          </Button>
        )}
        <div className="flex w-full flex-col items-start">
          {header && (
            <h1
              className={cn(
                header.className,
                'text-2xl font-semibold text-nowrap',
              )}
            >
              {header.label}
            </h1>
          )}
          {Tabs}
        </div>
      </div>
      <div className="flex w-full cursor-text justify-end gap-2">
        {allowSearch && (
          <Input
            onBlur={() => setShowSearch(false)}
            onClick={() => setShowSearch(true)}
            ref={ref}
            placeholder="Search"
            className={`origin-right transition-all duration-300 ease-out ${
              showSearch ? 'w-64' : 'w-5'
            }`}
            value={table?.getState().globalFilter ?? ''}
            icon={SearchIcon}
            onChange={(e) => table?.setGlobalFilter(e.target.value)}
            allowNepaliTranslation={false}
          />
        )}

        {navigator.onLine && (
          <Button
            onClick={() => {
              queryClient.refetchQueries();
              toast.success(tToast('dataRefreshed'));
            }}
            variant={'secondary'}
          >
            <RefreshCcw className="mr-2 h-4 w-4" />
            {t('refresh')}
          </Button>
        )}
        {addButton && (
          <Button onClick={addButton.onClick}>
            {addButton.icon}
            {addButton.label}
          </Button>
        )}
        {hasExport && (
          <Button
            variant={'outline'}
            onClick={() => setSaveModal?.((prev) => !prev)}
            disabled={!table?.getFilteredRowModel().rows.length}
          >
            <Share className="mr-2 h-4 w-4" />
            Export
          </Button>
        )}
      </div>
    </div>
  );
}
