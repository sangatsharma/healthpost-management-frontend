'use client';

import { useGlobalAlertStore } from '@/zustand/useGlobalAlert';
import { useTypedTranslations } from './useTypedTranslations';

export function useGlobalAlert() {
  const { showAlertDialog, hideAlertDialog } = useGlobalAlertStore();
  const t = useTypedTranslations('AlertDialog');

  const showConfirmDialog = ({
    title,
    description,
    onConfirm,
    onCancel,
    confirmText,
    cancelText,
    isDestructive = false,
  }: {
    title: string;
    description: string;
    onConfirm: () => void | Promise<void>;
    onCancel?: () => void;
    confirmText?: string;
    cancelText?: string;
    isDestructive?: boolean;
  }) => {
    showAlertDialog({
      title,
      desc: description,
      btnName:
        confirmText ||
        (isDestructive ? t('action.delete') : t('dialog.confirm')),
      cancelName: cancelText || t('action.cancel'),
      btnAction: onConfirm,
      cancelAction: () => {
        hideAlertDialog();
        if (onCancel) {
          onCancel();
        }
      },
    });
  };

  const showFormLostDialog = ({
    title,
    description,
    onConfirm,
    onCancel,
    confirmText,
    cancelText,
    isDestructive = false,
  }: {
    title: string;
    description: string;
    onConfirm: () => void | Promise<void>;
    onCancel?: () => void;
    confirmText?: string;
    cancelText?: string;
    isDestructive?: boolean;
  }) => {
    showAlertDialog({
      title,
      desc: description,
      btnName:
        confirmText ||
        (isDestructive ? t('action.delete') : t('dialog.confirm')),
      cancelName: cancelText || t('action.cancel'),
      btnAction: onConfirm,
      img: '/cancelEdit.png',
      cancelAction: () => {
        hideAlertDialog();
        if (onCancel) {
          onCancel();
        }
      },
    });
  };

  const showDeleteConfirmDialog = ({
    title,
    description,
    onConfirm,
    onCancel,
    itemName,
  }: {
    title?: string;
    description?: string;
    onConfirm: () => void | Promise<void>;
    onCancel?: () => void;
    itemName?: string;
  }) => {
    showAlertDialog({
      title: title || t('dialog.deleteTitle'),
      desc:
        description ||
        t('dialog.deleteDescription', { item: itemName || 'item' }),
      btnName: t('action.delete'),
      cancelName: t('action.cancel'),
      isDestructive: true,
      btnAction: onConfirm,
      cancelAction: () => {
        hideAlertDialog();
        if (onCancel) {
          onCancel();
        }
      },
      img: '/trash.png',
    });
  };

  const showSuccessDialog = ({
    title,
    description,
    onClose,
  }: {
    title: string;
    description: string;
    onClose?: () => void;
  }) => {
    showAlertDialog({
      title,
      desc: description,
      btnName: t('action.ok'),
      btnAction: onClose,
      img: '✅',
    });
  };

  const showErrorDialog = ({
    title,
    description,
    onClose,
  }: {
    title: string;
    description: string;
    onClose?: () => void;
  }) => {
    showAlertDialog({
      title,
      desc: description,
      btnName: t('action.ok'),
      btnAction: onClose,
      img: '❌',
    });
  };

  const showLoadingDialog = ({
    title,
    description,
  }: {
    title: string;
    description: string;
  }) => {
    showAlertDialog({
      title,
      desc: description,
      isLoading: true,
    });
  };

  return {
    showFormLostDialog,
    showAlertDialog,
    hideAlertDialog,
    showConfirmDialog,
    showDeleteConfirmDialog,
    showSuccessDialog,
    showErrorDialog,
    showLoadingDialog,
  };
}
