import type React from 'react';
import { type ReactElement, ReactNode, isValidElement } from 'react';
import Image from 'next/image';
import { Avatar, SAvatar } from '@/components/ui/avatar';
import AvatarText from '@/components/reusables/AvatarText';

export interface ImageInfo {
  src: string;
  alt?: string;
  id: string;
}

export interface ImagePreviewerProps {
  children: ReactNode;
  className?: string;
}

export interface ImageProps {
  src: string;
  alt?: string;
  width?: number;
  height?: number;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: React.MouseEvent<HTMLImageElement>) => void;
}

export interface AvatarProps {
  className?: string;
  children?: ReactNode;
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
}

export interface AvatarImageProps {
  src?: string;
  alt?: string;
  className?: string;
}

export type ImageElement = ReactElement<ImageProps>;
export type AvatarElement = ReactElement<AvatarProps>;
export type AvatarImageElement = ReactElement<AvatarImageProps>;

export interface ProcessedImageInfo extends ImageInfo {
  originalElement: ReactElement;
  elementType: 'image' | 'avatar';
}

export function isImageElement(element: unknown): element is ImageElement {
  return (
    isValidElement(element) &&
    (element.type === Image || element.type === 'img') &&
    typeof (element.props as ImageProps).src === 'string'
  );
}

export function isAvatarElement(element: unknown): element is AvatarElement {
  return (
    isValidElement(element) &&
    (element.type === AvatarText ||
      element.type === SAvatar ||
      element.type === Avatar ||
      (typeof element.type === 'function' && element.type.name === 'Avatar'))
  );
}

export function isAvatarImageElement(
  element: unknown,
): element is AvatarImageElement {
  return (
    isValidElement(element) &&
    (element.type === SAvatar ||
      (typeof element.type === 'function' &&
        element.type.name === 'AvatarImage')) &&
    typeof (element.props as AvatarImageProps).src === 'string'
  );
}

export function hasImageSrc(props: unknown): props is { src: string } {
  return (
    typeof props === 'object' &&
    props !== null &&
    'src' in props &&
    typeof (props as { src: unknown }).src === 'string'
  );
}

export function isReactElement(node: unknown): node is ReactElement {
  return isValidElement(node);
}

export function hasChildren(
  props: unknown,
): props is { children: React.ReactNode } {
  return typeof props === 'object' && props !== null && 'children' in props;
}
