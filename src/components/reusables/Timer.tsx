import React, { useEffect } from 'react';

import { useLocalizedNumber } from '@/hooks/useLocalizedNumber';
import { cn } from '@/lib/utils';
import { useLocale } from 'next-intl';
import { devnagari } from '@/app/layout';

const Timer = ({
  seconds,
  setSeconds,
  className,
}: {
  seconds: number;
  setSeconds: React.Dispatch<React.SetStateAction<number>>;
  className?: string;
}): React.JSX.Element => {
  const numFormatter = useLocalizedNumber();
  const locale = useLocale();

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (seconds > 0) {
      interval = setInterval(() => {
        setSeconds((seconds) => seconds - 1);
      }, 1000);
    } else if (seconds !== 0) {
      clearInterval(interval!);
    }

    return (): void => clearInterval(interval!);
  }, [seconds]);

  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;

    return `${numFormatter(minutes)} : ${seconds < 10 ? `${numFormatter(0) + numFormatter(seconds)}` : numFormatter(seconds)}`;
  };

  return (
    <div
      className={cn(
        'text-sm font-normal text-blue-600',
        locale === 'np' && devnagari.className,
        className,
      )}
    >
      <p>{formatTime(seconds)}</p>
    </div>
  );
};

export default Timer;
