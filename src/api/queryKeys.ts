// Query key factories for better type safety and avoid typos
//todo change these demo keys
export const queryKeys = {
  user: {
    all: ['user'] as const,
    details: () => [...queryKeys.user.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.user.details(), id] as const,
    list: (filters: Record<string, unknown>) =>
      [...queryKeys.user.all, 'list', filters] as const,
  },
};
