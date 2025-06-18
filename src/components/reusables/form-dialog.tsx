import { Loader2 } from 'lucide-react';
import React, { ReactNode } from 'react';

import { cn } from '@/lib/utils';

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

import { Button } from '../ui/button';
import { baseButtonType } from '@/types/global';
import { useGlobalAlert } from '@/hooks/useGlobalAlert';
import { useTypedTranslations } from '@/hooks/useTypedTranslations';

type TProps = {
  isFormDirty?: boolean;
  isOpen: boolean;
  toggleModal: () => void;
  children: React.ReactNode;
  className?: string;
  trigger?: string;
  isLoading?: boolean;
  mutateAction?: baseButtonType;
  resetAction?: baseButtonType;
} & (
  | { title?: string; header?: never }
  | { title?: never; header?: ReactNode }
);

const FormDialog: React.FC<TProps> = ({
  isFormDirty,
  isOpen,
  toggleModal,
  trigger,
  children,
  className,
  isLoading,
  resetAction,
  mutateAction,
  ...props
}) => {
  const t = useTypedTranslations('AlertDialog');
  const { showFormLostDialog } = useGlobalAlert();

  const handleModalClose = (): void => {
    if (isFormDirty) {
      showFormLostDialog({
        title: t('dialog.sureConfirmation'),
        description: t('dialog.formLostDescription'),
        onConfirm: () => {
          toggleModal();
        },

        cancelText: t('dialog.keepEditing'),
        confirmText: t('dialog.cancelForm'),
      });
    } else {
      toggleModal();
    }
  };

  return (
    <div className="relative">
      <Dialog open={isOpen} onOpenChange={handleModalClose}>
        <DialogTrigger>{trigger}</DialogTrigger>
        <DialogContent
          className={cn(
            'flex h-fit max-w-screen-2xl flex-col justify-between md:max-w-2xl',
            className,
          )}
        >
          {props.title ? (
            <div>
              <DialogHeader className="mb-10 space-y-5">
                <DialogTitle className="text-center text-2xl font-normal">
                  {props.title}
                </DialogTitle>
              </DialogHeader>
              {children}
            </div>
          ) : (
            <>
              {props.header}
              {children}
            </>
          )}
          {isLoading && (
            <div className="bg-opacity-90 absolute inset-0 flex items-center justify-center bg-white">
              <Loader2 className="h-12 w-12 animate-spin" />
            </div>
          )}
          <DialogFooter className="mt-4">
            {resetAction && (
              <Button
                onClick={resetAction.onClick && resetAction.onClick}
                variant={resetAction.variant || 'ghost'}
                className={cn(
                  'cursor-pointer space-x-2',
                  resetAction.className,
                )}
              >
                {resetAction.icon} {resetAction.label}
              </Button>
            )}
            {mutateAction && (
              <Button
                onClick={mutateAction.onClick && mutateAction.onClick}
                type="submit"
                variant={mutateAction.variant || 'default'}
                className={cn(
                  'cursor-pointer space-x-2',
                  mutateAction.className,
                )}
                disabled={mutateAction.disabled}
                isLoading={mutateAction.isLoading}
              >
                {mutateAction.icon} {mutateAction.label}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FormDialog;
