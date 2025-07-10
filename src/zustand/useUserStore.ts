import { logout } from '@/api/queries';
import { TUser } from '@/types/user.types';
import { toast } from 'sonner';
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
  logOut: async () => {
    await logout()
      .then(() => {
        set({ user: null, isLoggedIn: false, isLoading: false });
        localStorage.removeItem('userInfo');
        document.cookie =
          'portal=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        // Redirect to home page after logout
        window.location.reload();
      })
      .catch((error) => {
        console.error('Logout failed:', error);
        toast.error('Failed to log out. Please try again.');
      });
  },
  isLoading: true,
  setIsLoading: (isLoading) => set({ isLoading }),
});

export const useUserStore = create<TUserStore>((set) => getInitialData(set));
