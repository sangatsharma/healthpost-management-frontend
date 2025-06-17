import { TUser } from '@/types/user.types';
import { create } from 'zustand';

type TUserStore = {
  user: TUser | null;
  setUser: (user: TUser | null) => void;
  isLoggedIn: boolean;
  logOut: () => void;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
};

const getInitialData = (set: {
  (
    partial:
      | TUserStore
      | Partial<TUserStore>
      | ((state: TUserStore) => TUserStore | Partial<TUserStore>),
    replace?: false,
  ): void;
  (
    state: TUserStore | ((state: TUserStore) => TUserStore),
    replace: true,
  ): void;
}): TUserStore => ({
  user: null,
  setUser: (user) => {
    set({ isLoggedIn: !!user, isLoading: false, user });
  },
  isLoggedIn: false,
  logOut: () => set({ user: null, isLoggedIn: false }),
  isLoading: true,
  setIsLoading: (isLoading) => set({ isLoading }),
});

export const useUserStore = create<TUserStore>((set) => getInitialData(set));
