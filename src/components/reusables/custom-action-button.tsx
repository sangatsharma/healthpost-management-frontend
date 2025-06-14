import { MoreHorizontal } from 'lucide-react';
import React from 'react';

import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';

import { cn } from '@/lib/utils';
import { ActionButtonDataTypes } from '@/types/global';

interface CustomDropdownTypes {
  data: ActionButtonDataTypes[];
}

export const ActionDropdown = ({
  data,
}: CustomDropdownTypes): React.JSX.Element => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex justify-center">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="min-w-[200px] rounded-sm p-[6px]"
        align="end"
      >
        {data
          ?.filter((item) => !item.hide)
          .map((item) => {
            const Icon = item?.icon;

            return (
              <React.Fragment key={item.name}>
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    if (item.onClick) {
                      item.onClick();
                    }
                  }}
                  className={cn(
                    `flex items-center gap-2 !pr-5 font-medium`,
                    item.isTrash && 'text-red-600 hover:!text-red-600',
                    item?.textClassName,
                  )}
                >
                  <Icon size={16} />
                  <span>{item.name}</span>
                </DropdownMenuItem>
              </React.Fragment>
            );
          })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
