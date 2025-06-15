import { create } from 'zustand';

type TGlobalAlertDialog = {
  isOpen: boolean;
  title?: string;
  desc?: string;
  btnName?: string;
  cancelName?: string;
  btnAction?: () => void | Promise<void>;
  cancelAction?: () => void;
  isLoading?: boolean;
  img?: string;
  imgSize?: number;
  showAlertDialog: (
    payload: Omit<
      TGlobalAlertDialog,
      'isOpen' | 'showAlertDialog' | 'hideAlertDialog'
    >,
  ) => void;
  hideAlertDialog: () => void;
};

export const useGlobalAlertStore = create<TGlobalAlertDialog>((set) => ({
  isOpen: false,
  showAlertDialog: (payload) =>
    set({
      isOpen: true,
      ...payload,
    }),
  hideAlertDialog: () => set({ isOpen: false }),
}));
