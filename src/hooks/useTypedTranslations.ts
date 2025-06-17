import { TTranslations, TTypeFunction } from '@/types/global';
import { useTranslations as useRawTranslations } from 'next-intl';
import { useLocalizedNumber } from './useLocalizedNumber';

export function useTypedTranslations<N extends keyof TTranslations>(
  namespace: N,
): TTypeFunction<N> {
  const t = useRawTranslations(namespace as string);
  const formatNumber = useLocalizedNumber();

  return ((key, options = {}) => {
    const localizedOptions: Record<string, string> = {};

    for (const [k, v] of Object.entries(options)) {
      localizedOptions[k] = typeof v === 'number' ? formatNumber(v) : String(v);
    }

    return t(key as string, localizedOptions);
  }) as TTypeFunction<N>;
}
