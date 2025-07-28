'use client';

import type React from 'react';
import {
  useState,
  useCallback,
  useMemo,
  useEffect,
  Children,
  cloneElement,
  type ReactNode,
  type ReactElement,
} from 'react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import {
  AvatarImageProps,
  AvatarProps,
  hasChildren,
  ImageInfo,
  ImagePreviewerProps,
  ImageProps,
  isAvatarElement,
  isAvatarImageElement,
  isImageElement,
  isReactElement,
} from '@/types/imagePreviewer.types';

export function ImagePreviewer({ children, className }: ImagePreviewerProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [images, setImages] = useState<ImageInfo[]>([]);

  // Memoize the image extraction logic
  const extractedImages = useMemo(() => {
    const foundImages: ImageInfo[] = [];
    let imageCounter = 0;

    const traverse = (node: ReactNode): void => {
      if (
        typeof node === 'string' ||
        typeof node === 'number' ||
        node === null ||
        node === undefined
      ) {
        return;
      }

      if (Array.isArray(node)) {
        node.forEach(traverse);
        return;
      }

      if (!isReactElement(node)) {
        return;
      }

      // Process image elements
      if (isImageElement(node)) {
        const { src, alt } = node.props as ImageProps;
        if (src) {
          const imageAlt = alt || `Image ${imageCounter + 1}`;
          const imageId = `image-${imageCounter++}`;
          foundImages.push({ src: src || '', alt: imageAlt, id: imageId });
        }
      }

      // Process avatar elements
      if (isAvatarElement(node)) {
        const avatarChildren = Children.toArray(node.props.children);
        const avatarImageElement = avatarChildren.find(isAvatarImageElement);

        if (avatarImageElement?.props.src) {
          const { src, alt } = avatarImageElement.props as AvatarImageProps;
          const imageAlt = alt || `Avatar ${imageCounter + 1}`;
          const imageId = `avatar-${imageCounter++}`;
          foundImages.push({ src: src || '', alt: imageAlt, id: imageId });
        }
      }

      // Recursively process children
      if (hasChildren(node.props)) {
        Children.forEach(node.props.children, traverse);
      }
    };

    traverse(children);
    return foundImages;
  }, [children]);

  // Update images state when extracted images change
  useEffect(() => {
    setImages(extractedImages);
  }, [extractedImages]);

  const createImageClickHandler = useCallback(
    (imageId: string) => (e: React.MouseEvent) => {
      e.preventDefault();
      const imageIndex = extractedImages.findIndex((img) => img.id === imageId);
      if (imageIndex !== -1) {
        setCurrentIndex(imageIndex);
        setIsOpen(true);
      }
    },
    [extractedImages],
  );

  const processImageElement = useCallback(
    (element: ReactElement, imageId: string): ReactElement => {
      if (!isImageElement(element)) return element;

      const { onClick: originalOnClick, ...restProps } =
        element.props as ImageProps;

      return cloneElement(element, {
        ...restProps,
        onClick: (e: React.MouseEvent<HTMLImageElement>) => {
          createImageClickHandler(imageId)(e);
          originalOnClick?.(e);
        },
        className: `${element.props.className || ''} cursor-pointer hover:opacity-80 transition-opacity`,
      } as ImageProps);
    },
    [createImageClickHandler],
  );

  const processAvatarElement = useCallback(
    (element: ReactElement, imageId: string): ReactElement => {
      if (!isAvatarElement(element)) return element;

      const { onClick: originalOnClick, ...restProps } =
        element.props as AvatarProps;

      return cloneElement(element, {
        ...restProps,
        onClick: (e: React.MouseEvent<HTMLDivElement>) => {
          createImageClickHandler(imageId)(e);
          originalOnClick?.(e);
        },
        className: `${element.props.className || ''} cursor-pointer hover:scale-105 transition-transform`,
        children: Children.map(element.props.children, (child) => {
          if (isAvatarImageElement(child)) {
            return cloneElement(child, {
              ...child.props,
              className: `${child.props.className || ''} transition-all`,
            } as AvatarImageProps);
          }
          return child;
        }),
      } as AvatarProps);
    },
    [createImageClickHandler],
  );

  // Memoize the processed children
  const processedChildren = useMemo(() => {
    let imageCounter = 0;

    const traverse = (node: ReactNode): ReactNode => {
      if (
        typeof node === 'string' ||
        typeof node === 'number' ||
        node === null ||
        node === undefined
      ) {
        return node;
      }

      if (Array.isArray(node)) {
        return node.map(traverse);
      }

      if (!isReactElement(node)) {
        return node;
      }

      // Process image elements
      if (isImageElement(node)) {
        const { src } = node.props as ImageProps;
        if (src) {
          const imageId = `image-${imageCounter++}`;
          return processImageElement(node, imageId);
        }
      }

      // Process avatar elements
      if (isAvatarElement(node)) {
        const avatarChildren = Children.toArray(node.props.children);
        const avatarImageElement = avatarChildren.find(isAvatarImageElement);

        if (avatarImageElement?.props.src) {
          const imageId = `avatar-${imageCounter++}`;
          return processAvatarElement(node, imageId);
        }
      }

      // Recursively process children
      if (hasChildren(node.props)) {
        const processedChildrenNodes = Children.map(
          node.props.children,
          traverse,
        );
        return cloneElement(node, {
          ...node.props,
          children: processedChildrenNodes,
        } as typeof node.props);
      }

      return node;
    };

    return traverse(children);
  }, [children, processImageElement, processAvatarElement]);

  const nextImage = useCallback((): void => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const prevImage = useCallback((): void => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent): void => {
      if (!isOpen) return;

      switch (e.key) {
        case 'ArrowRight':
          nextImage();
          break;
        case 'ArrowLeft':
          prevImage();
          break;
        case 'Escape':
          setIsOpen(false);
          break;
      }
    },
    [isOpen, nextImage, prevImage],
  );

  const handleCloseDialog = useCallback((open: boolean): void => {
    setIsOpen(open);
  }, []);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const currentImage = images[currentIndex];
  const hasMultipleImages = images.length > 1;

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      <div
        className={className}
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        {processedChildren}
      </div>

      <Dialog open={isOpen} onOpenChange={handleCloseDialog}>
        <DialogContent className="flex h-[80vh] w-full max-w-4xl flex-col items-center justify-center border-0 bg-black/60 p-0 text-white">
          <DialogTitle className="pt-3">Image Preview</DialogTitle>
          <div className="relative flex h-full w-full items-center justify-center">
            {/* Image counter */}
            {hasMultipleImages && (
              <div className="absolute top-4 left-4 z-10 rounded-full bg-black/50 px-3 py-1 text-sm text-white">
                {currentIndex + 1} / {images.length}
              </div>
            )}

            {/* Navigation buttons */}
            {hasMultipleImages && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-1/2 left-4 z-10 -translate-y-1/2 text-white hover:bg-white/20"
                  onClick={prevImage}
                  aria-label="Previous image"
                >
                  <ChevronLeft className="h-6 w-6" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-1/2 right-4 z-10 -translate-y-1/2 text-white hover:bg-white/20"
                  onClick={nextImage}
                  aria-label="Next image"
                >
                  <ChevronRight className="h-6 w-6" />
                </Button>
              </>
            )}

            {/* Current image */}
            {currentImage && (
              <div className="relative flex h-full w-full items-center justify-center p-8">
                <Image
                  src={currentImage.src || '/placeholder.svg'}
                  alt={currentImage.alt || 'Preview image'}
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
                  priority
                />
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
