'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useGlobalAlertStore } from '@/zustand/useGlobalAlert';
import { Loader2 } from 'lucide-react';
import Image from 'next/image';

export function GlobalAlertDialog() {
  const {
    isOpen,
    title,
    desc,
    btnName,
    cancelName,
    btnAction,
    isDestructive,
    cancelAction,
    isLoading,
    img,
    imgSize,
    hideAlertDialog,
  } = useGlobalAlertStore();

  const handleConfirm = async () => {
    if (btnAction) {
      try {
        await btnAction();
      } catch (error) {
        console.error('Error in alert action:', error);
      }
    }
    hideAlertDialog();
  };

  const handleCancel = () => {
    if (cancelAction) {
      cancelAction();
    }
    hideAlertDialog();
  };

  return (
    <AlertDialog
      open={isOpen}
      onOpenChange={(open) => !open && hideAlertDialog()}
    >
      <AlertDialogContent className="w-fit space-y-6">
        <AlertDialogHeader>
          {title && (
            <AlertDialogTitle className="mb-4 flex flex-col items-center gap-8 text-center text-3xl">
              {title}
              {img && (
                <Image
                  src={img || '/placeholder.svg'}
                  alt="Alert image"
                  className="object-contain"
                  width={imgSize || 120}
                  height={imgSize || 120}
                />
              )}
            </AlertDialogTitle>
          )}
          {desc && (
            <AlertDialogDescription className="text-center text-[18px] font-semibold">
              {desc}
            </AlertDialogDescription>
          )}
        </AlertDialogHeader>
        <AlertDialogFooter className="flex-col gap-2 sm:flex-row">
          {cancelName && (
            <AlertDialogCancel asChild>
              <Button
                variant="outline"
                onClick={handleCancel}
                disabled={isLoading}
              >
                {cancelName}
              </Button>
            </AlertDialogCancel>
          )}
          {btnName && (
            <AlertDialogAction asChild>
              <Button
                onClick={handleConfirm}
                disabled={isLoading}
                className={cn(
                  'min-w-[100px]',
                  isDestructive &&
                    'bg-destructive hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/80 dark:hover:bg-destructive text-white shadow-xs',
                )}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Loading...
                  </>
                ) : (
                  btnName
                )}
              </Button>
            </AlertDialogAction>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
