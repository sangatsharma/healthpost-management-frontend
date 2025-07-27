import { useMutation } from '@tanstack/react-query';
import { queryKeys } from './queryKeys';
import {
  mutateClientInfo,
  mutateHealthPostInfo,
  mutateOpdInfo,
  mutateStaffInfo,
} from './queries';
import { queryClient } from '@/lib/queryClient';
import { AxiosError } from 'axios';

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
  const { mutate: mutateStaff, isPending } = useMutation({
    mutationKey: queryKeys.staff.staffs,
    mutationFn: mutateStaffInfo,
    retry: false,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.staff.staffs,
      });

      onSuccess?.();
    },
  });

  return { mutateStaff, isPending };
}

export function useClientMutation({ onSuccess }: { onSuccess?: () => void }) {
  const { mutate: mutateClient, isPending } = useMutation({
    mutationKey: queryKeys.client.clients,
    mutationFn: mutateClientInfo,
    retry: false,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [queryKeys.client.clients],
        exact: false,
      });

      onSuccess?.();
    },
    onError: (error) => {
      if ((error as AxiosError).code === 'ERR_OFFLINE') {
        onSuccess?.();
      }
    },
  });

  return { mutateClient, isPending };
}

export function useOpdMutation({ onSuccess }: { onSuccess?: () => void }) {
  const { mutate: mutateOpd, isPending } = useMutation({
    mutationKey: queryKeys.opd.opds,
    mutationFn: mutateOpdInfo,
    retry: false,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [queryKeys.opd.opds, 'healthpost', 'healthpost'],
      });

      onSuccess?.();
    },
    onError: (error) => {
      if ((error as AxiosError).code === 'ERR_OFFLINE') {
        onSuccess?.();
      }
    },
  });

  return { mutateOpd, isPending };
}
