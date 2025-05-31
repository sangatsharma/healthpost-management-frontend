import { TUser } from '@/types/user.types';
import { create } from 'zustand';

type TUserStore = {
  user: TUser | null;
  setUser: (user: TUser | null) => void;
  isLoggedIn: boolean;
  logOut: () => void;
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
    set({ user });
    set({ isLoggedIn: !!user });
  },
  isLoggedIn: false,
  logOut: () => set({ user: null, isLoggedIn: false }),
});

export const useUserStore = create<TUserStore>((set) => getInitialData(set));
