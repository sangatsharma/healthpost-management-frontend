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
      <AlertDialogContent className="sm:max-w-[425px]">
        <AlertDialogHeader>
          {img && (
            <div className="mb-4 flex justify-center">
              <div
                className="relative"
                style={{
                  width: imgSize || 80,
                  height: imgSize || 80,
                }}
              >
                <Image
                  src={img || '/placeholder.svg'}
                  alt="Alert image"
                  fill
                  className="object-contain"
                  sizes={`${imgSize || 80}px`}
                />
              </div>
            </div>
          )}
          {title && (
            <AlertDialogTitle className="text-center">{title}</AlertDialogTitle>
          )}
          {desc && (
            <AlertDialogDescription className="text-center">
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
                className="min-w-[100px]"
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
