import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from './button';

interface LoadingProps {
  isError?: boolean;
  refetch?: () => void;
}

const Loading: React.FC<LoadingProps> = ({ isError, refetch }) => {
  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center space-y-4 p-8">
        <div className="text-destructive flex items-center space-x-2">
          <AlertCircle className="h-4 w-4" />
          <span>Error fetching data from server.</span>
        </div>
        <Button onClick={() => refetch?.()} variant="outline" size="sm">
          <RefreshCw className="mr-2 h-4 w-4" />
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-24">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-t-emerald-400 p-2"></div>
    </div>
  );
};

export default Loading;
