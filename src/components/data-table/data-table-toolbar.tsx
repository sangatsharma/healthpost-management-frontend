import { Search, SearchIcon, Share } from 'lucide-react';
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
      <div className="flex flex-1 items-center">
        {header && <h4 className={cn(header.className)}>{header.label}</h4>}
      </div>
      {!showSearch && (
        <Button
          variant={'outline'}
          onClick={() => setShowSearch(true)}
          className="cursor-text text-gray-400"
        >
          <Search className="h-4 w-4" />
          Search
        </Button>
      )}
      <div
        className={cn(
          'flex items-center transition-all duration-300',
          showSearch ? 'max-w-xs' : 'max-w-0 overflow-hidden',
        )}
      >
        <Input
          autoFocus
          onBlur={() => setShowSearch(false)}
          ref={ref}
          placeholder="Search"
          className={`transition-all duration-300 ${
            showSearch ? 'max-w-sm' : 'max-w-0'
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
        <Button variant={'ghost'} onClick={() => setSaveModal((prev) => !prev)}>
          <Share className="mr-2 h-4 w-4" />
          Export
        </Button>
      )}
      {/*
            // <DataTableViewOptions table={table} />
              */}
    </div>
  );
}
