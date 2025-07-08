'use client';
import { AlertCircle, Loader2, RefreshCw } from 'lucide-react';
import React, { ReactNode, useEffect } from 'react';

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
  mutateAction?: baseButtonType;
  resetAction?: baseButtonType;
  isLoading?: boolean;
  isError?: boolean;
  loadingComponent?: ReactNode;
  refetch?: () => void;
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
  isError,
  refetch,
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

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.onkeydown = (e) => {
        // Trigger the submit action if Enter is pressed
        if (
          e.key === 'Enter' &&
          isOpen &&
          isFormDirty &&
          mutateAction &&
          mutateAction.onClick &&
          !isLoading &&
          !isError
        ) {
          e.preventDefault();
          mutateAction.onClick();
        }
      };
    }
    // Optionally, clean up on unmount
    return () => {
      if (typeof window !== 'undefined') {
        window.onkeydown = null;
      }
    };
  }, [isOpen, mutateAction, isFormDirty, isLoading, isError]);

  const renderContent = () => {
    if (isError) {
      return (
        <div className="flex flex-col items-center justify-center space-y-4 p-8">
          <div className="text-destructive flex items-center space-x-2">
            <AlertCircle className="h-4 w-4" />
            <span>Error fetching data from server.</span>
          </div>
          <Button onClick={() => refetch?.()} variant="outline" size="sm">
            <RefreshCw className="mr-2 h-4 w-4" />
            Retry
          </Button>
        </div>
      );
    }

    if (isLoading) {
      return (
        <div className="flex items-center justify-center p-8">
          <div className="flex items-center space-x-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Loading...</span>
          </div>
        </div>
      );
    }

    return (
      <>
        {props.title ? (
          <div className="max-h-[80vh] overflow-y-auto">
            <DialogHeader className="mb-10 space-y-5">
              <DialogTitle className="text-center text-2xl font-normal">
                {props.title}
              </DialogTitle>
            </DialogHeader>
            {children}
          </div>
        ) : (
          <div className="max-h-[80vh] overflow-y-auto">
            {props.header}
            {children}
          </div>
        )}
      </>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleModalClose}>
      <DialogTrigger>{trigger}</DialogTrigger>
      <DialogContent
        className={cn(
          'scrollbar-thin-custom flex h-fit max-h-[90vh] max-w-screen-2xl flex-col justify-between md:max-w-2xl',
          className,
        )}
      >
        {renderContent()}
        {(resetAction || mutateAction) && !isLoading && !isError && (
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
        )}
      </DialogContent>
    </Dialog>
  );
};

export default FormDialog;
