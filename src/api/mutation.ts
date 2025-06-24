import { useMutation } from '@tanstack/react-query';
import { queryKeys } from './queryKeys';
import { mutateHealthPostInfo, mutateStaffInfo } from './queries';
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

export function useStaffMutation({ onSuccess }: { onSuccess?: () => void }) {
  const { mutate: mutatestaff, isPending } = useMutation({
    mutationKey: queryKeys.healthPost.healthPosts,
    mutationFn: mutateStaffInfo,
    retry: false,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.staff.staffs,
      });

      onSuccess?.();
    },
  });

  return { mutatestaff, isPending };
}
