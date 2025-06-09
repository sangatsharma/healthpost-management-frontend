/* eslint-disable @typescript-eslint/no-explicit-any */
import { TTranslations } from '@/types/global';
import { useTranslations as useRawTranslations } from 'next-intl';

// Recursive key type
type Join<K, P> = K extends string | number
  ? P extends string | number
    ? `${K}.${P}`
    : never
  : never;

type NestedKeyOf<ObjectType extends object, Depth extends number = 5> = [
  Depth,
] extends [never]
  ? never
  : {
      [Key in keyof ObjectType &
        (string | number)]: ObjectType[Key] extends object
        ? Join<Key, NestedKeyOf<ObjectType[Key], Prev[Depth]>>
        : Key;
    }[keyof ObjectType & (string | number)];

type Prev = [never, 0, 1, 2, 3, 4, 5];

export function useTypedTranslations<N extends keyof TTranslations>(
  namespace: N,
) {
  const t = useRawTranslations(namespace as string);
  type Keys = NestedKeyOf<TTranslations[N]>;

  return (key: Keys, values?: Record<string, any>) => t(key as string, values);
}
