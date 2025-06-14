import { TAction, TPermissionResource } from '@/zustand/permissions';
import en from '../../messages/en.json';

type TTranslations = typeof en;

type TFunc<K extends keyof TTranslations> = (
  key: keyof TTranslations[K],
) => string;

type TLocale = 'en' | 'np';

type TPermission = {
  action: TAction;
  resource: TPermissionResource;
  healthPost: string;
};

type TResponse<T> = {
  message?: string;
  error?: string;
  data: T;
};
type TPaginatedResponse<T> = {
  message?: string;
  data: T[];
  offset: number;
  page: number;
  limit: number;
  totalPages: number;
};

type TMenuItem = {
  key: string;
  icon: ForwardRefExoticComponent<
    Omit<LucideProps, 'ref'> & RefAttributes<SVGSVGElement>
  >;
  label: string;
  href?: string;
  permission?: TPermissionResource;
  active?: boolean;
  submenu?: SubMenuItem[];
};

type SubMenuItem = {
  key: string;
  icon: ForwardRefExoticComponent<
    Omit<LucideProps, 'ref'> & RefAttributes<SVGSVGElement>
  >;
  label: string;
  href: string;
  permission: TPermissionResource;
};
