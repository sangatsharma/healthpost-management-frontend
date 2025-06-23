import { useMutation } from '@tanstack/react-query';
import { queryKeys } from './queryKeys';
import { mutateHealthPostInfo } from './queries';
import { queryClient } from '@/lib/queryClient';

export function useHealthPostMutation({
  onSuccess,
}: {
  onSuccess?: () => void;
}) {
  const { mutate: mutateHealthPost, isPending } = useMutation({
    mutationKey: queryKeys.healthPost.healthPosts,
    mutationFn: mutateHealthPostInfo,
    retry: false,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.healthPost.healthPosts,
      });

      onSuccess?.();
    },
  });

  return { mutateHealthPost, isPending };
}
