// Query key factories for better type safety and avoid typos

export const queryKeys = {
  user: {
    all: ['user'] as const,
    details: () => [...queryKeys.user.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.user.details(), id] as const,
    list: (filters: Record<string, unknown>) =>
      [...queryKeys.user.all, 'list', filters] as const,
  },
  healthPost: {
    healthPosts: ['healthPosts'],
    singleHealthPost: (id: string) => ['healthPosts', id],
  },
  staff: {
    staffs: ['staffs'],
    singleStaff: (id: string) => ['staffs', id],
  },
  client: {
    clients: ['clients'],
    singleClient: (id: string) => ['clients', id],
  },
  opd: {
    opds: ['opds'],
    singleOpd: (id: string) => ['opds', id],
  },
  referral: ['referral'],
};
