'use client';

import * as React from 'react';
import * as AvatarPrimitive from '@radix-ui/react-avatar';

import { cn } from '@/lib/utils';
import Image from 'next/image';
import { ImagePreviewer } from '../reusables/ImagePreviewer';

function Avatar({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Root>) {
  return (
    <AvatarPrimitive.Root
      data-slot="avatar"
      className={cn(
        'relative flex size-8 shrink-0 overflow-hidden rounded-full',
        className,
      )}
      {...props}
    />
  );
}

function AvatarImage({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Image>) {
  return (
    <AvatarPrimitive.Image
      data-slot="avatar-image"
      className={cn('aspect-square size-full', className)}
      {...props}
    />
  );
}

function AvatarFallback({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Fallback>) {
  return (
    <AvatarPrimitive.Fallback
      data-slot="avatar-fallback"
      className={cn(
        'bg-muted flex size-full items-center justify-center rounded-full',
        className,
      )}
      {...props}
    />
  );
}

export { Avatar, AvatarImage, AvatarFallback };

type TProps = {
  src?: string;
  name: string;
  bg?: 'none' | string;
  size?: string | number;
  shape?: 'rounded' | 'radius-md';
  className?: string;
};

export const SAvatar = ({
  bg = '#008366',
  name,
  src,
  size,
  shape,
  className,
}: TProps): React.JSX.Element => {
  const getCharacters = (name: string): string => {
    const words = name?.split(' ');
    if (words.length > 1) {
      const charW1 = words[0]?.charAt(0);
      const charW2 = words[1]?.charAt(0);

      return (charW1 || 'U') + (charW2 || 'N');
    }

    const [w1] = words;

    if (w1 && w1.length > 1) {
      return w1?.charAt(0) + w1?.charAt(1);
    }

    return w1?.charAt(0) || 'U';
  };

  const isValidSrc = src?.startsWith('https');

  return (
    <Avatar
      style={{
        width: size || '40px',
        height: size || '40px',
        aspectRatio: '1 / 1',
      }}
      className={cn(shape === 'radius-md' && 'rounded-md', className)}
      title={name || 'Avatar'}
    >
      {isValidSrc && src ? (
        <ImagePreviewer>
          <Image
            src={src}
            width={1920}
            height={1080}
            style={{
              width: size || '40px',
              height: size || '40px',
            }}
            alt={`${name || 'User'}'s Avatar`}
            className={cn(
              'aspect-square h-full w-full object-cover',
              shape === 'radius-md' && 'rounded-md',
            )}
          />
        </ImagePreviewer>
      ) : (
        <div
          style={{
            backgroundColor: bg || '#E1E6FF',
            width: size || '40px',
            height: size || '40px',
            fontSize: `${(typeof size === 'number' ? size : parseFloat(String(size)) || 40) / 2.5}px`,
          }}
          className="flex items-center justify-center text-lg text-white uppercase"
          title={name || 'Avatar'}
        >
          {getCharacters(name || 'undefined')}
        </div>
      )}
    </Avatar>
  );
};
