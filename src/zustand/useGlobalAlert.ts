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
  isDestructive?: boolean;
  img?: string;
  imgSize?: number;
  showAlertDialog: (
    _payload: Omit<
      TGlobalAlertDialog,
      'isOpen' | 'showAlertDialog' | 'hideAlertDialog'
    >,
  ) => void;
  hideAlertDialog: () => void;
};

export const useGlobalAlertStore = create<TGlobalAlertDialog>((set) => ({
  isOpen: false,
  showAlertDialog: (_payload) =>
    set({
      isOpen: true,
      ..._payload,
    }),
  hideAlertDialog: () => set({ isOpen: false }),
}));
