import { SearchIcon, Share } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import { cn } from '@/lib/utils';

import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Table } from '@tanstack/react-table';
import { baseButtonType, dataTableHeaderType } from '@/types/global';

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  addButton?: baseButtonType;
  header?: dataTableHeaderType;
  hasExport?: boolean;
  setSaveModal: React.Dispatch<React.SetStateAction<boolean>>;
}

export function DataTableToolbar<TData>({
  table,
  addButton,
  header,
  setSaveModal,
  hasExport,
}: DataTableToolbarProps<TData>) {
  const ref = useRef<HTMLInputElement>(null);
  const [showSearch, setShowSearch] = useState(false);

  useEffect(() => {
    if (showSearch && ref.current) {
      ref.current?.focus();
    }
  }, [showSearch]);

  return (
    <div className="flex items-center justify-between gap-2">
      {header && (
        <h4 className={cn(header.className, 'text-nowrap')}>{header.label}</h4>
      )}

      <div className="flex w-full cursor-text justify-end">
        <Input
          onBlur={() => setShowSearch(false)}
          onClick={() => setShowSearch(true)}
          ref={ref}
          placeholder="Search"
          className={`origin-right transition-all duration-300 ease-out ${
            showSearch ? 'w-64' : 'w-5'
          }`}
          icon={SearchIcon}
          onChange={(e) => table.setGlobalFilter(e.target.value)}
        />
      </div>

      {addButton && (
        <Button onClick={addButton.onClick}>
          {addButton.icon}
          {addButton.label}
        </Button>
      )}
      {hasExport && (
        <Button
          variant={'outline'}
          onClick={() => setSaveModal((prev) => !prev)}
        >
          <Share className="mr-2 h-4 w-4" />
          Export
        </Button>
      )}
    </div>
  );
}
