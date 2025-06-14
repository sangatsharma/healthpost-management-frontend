import { Skeleton } from './skeleton';

const TableSkeleton: React.FC = () => {
  return (
    <div className="flex flex-col space-y-3">
      <Skeleton className="h-10 w-full" />
      <div className="flex justify-between">
        <Skeleton className="h-[250px] w-full" />
      </div>
      <div className="place-self-end">
        <div className="flex gap-4">
          <Skeleton className="h-8 w-16" />
          <Skeleton className="h-8 w-16" />
        </div>
      </div>
    </div>
  );
};

export default TableSkeleton;
