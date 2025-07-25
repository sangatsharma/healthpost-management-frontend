import React from 'react';

import { Button } from '../ui/button';
import Loading from '../ui/loading';
import TableSkeleton from '../ui/table-skeleton';

type TProps = {
  children: React.ReactNode;
  isLoading?: boolean;
  isError?: boolean;
  refetch?: () => void;
  loaderComp?: React.ReactNode;
  errorComp?: React.ReactNode;
  isTable?: boolean;
  isPending?: boolean;
};

const FetchWrapper: React.FC<TProps> = ({
  isError,
  isLoading,
  refetch = (): void => {},
  children,
  loaderComp,
  errorComp,
  isTable = false,
  isPending,
}) => {
  if (isLoading || isPending) {
    if (isTable) {
      return <TableSkeleton />;
    }

    return loaderComp || <Loading />;
  }

  if (isError) {
    return (
      errorComp || (
        <div>
          Something went wrong
          <Button variant={'link'} onClick={refetch}>
            Retry
          </Button>
        </div>
      )
    );
  }

  return children;
};

export default FetchWrapper;
