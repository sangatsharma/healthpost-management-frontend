import React from 'react';

import { cn } from '@/lib/utils';
import { SAvatar } from '../ui/avatar';
import { ImagePreviewer } from './ImagePreviewer';

type AvatarTextProps = {
  src?: string;
  name: string;
  title?: string;
  subtitle?: string;
  classNames?: {
    containerClassName?: string;
    avatarClassName?: string;
    titleClassName?: string;
    avatarSize?: number;
  };
  orientation?: 'rtl' | 'ltr';
  custom?: {
    node: React.JSX.Element;
    position: 'left' | 'right' | 'subtitle' | 'title';
  };
};

const AvatarText = ({
  src,
  name,
  title,
  subtitle,
  classNames,
  orientation = 'ltr',
  custom,
}: AvatarTextProps): React.JSX.Element => {
  return (
    <div
      className={cn(
        'flex items-center gap-3',
        classNames?.containerClassName,
        orientation === 'rtl' && 'flex-col-reverse',
      )}
    >
      {custom && custom.node && custom.position === 'left' && custom.node}
      <ImagePreviewer>
        <SAvatar
          src={src ?? ''}
          name={name ?? ''}
          className={cn(classNames?.avatarClassName)}
          size={classNames?.avatarSize}
        />
      </ImagePreviewer>

      <div className="text-left">
        {custom && custom.node && custom.position === 'title' && custom.node}
        <h3
          className={cn('text-nowrap capitalize', classNames?.titleClassName)}
          title={title}
        >
          {title ?? ''}
        </h3>
        {subtitle && (
          <p
            className="text-aldgray"
            style={{ fontSize: '12px' }}
            title={subtitle}
          >
            {subtitle}
          </p>
        )}
        <div>
          {custom &&
            custom.node &&
            custom.position === 'subtitle' &&
            custom.node}
        </div>
      </div>
      {custom && custom.node && custom.position === 'right' && custom.node}
    </div>
  );
};

export default AvatarText;
