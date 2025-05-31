import { TTranslations } from '@/types/global';
import { useTranslations as useRawTranslations } from 'next-intl';

export function useTypedTranslations<N extends keyof TTranslations>(
  namespace: N,
) {
  const t = useRawTranslations(namespace as string);
  type Keys = keyof TTranslations[N];

  return (key: Keys) => t(key as string);
}
