import { TAction, TPermissionResource } from '@/zustand/permissions';
import '@tanstack/react-table';
import { ColumnDef } from '@tanstack/react-table';
import en from '../../messages/en.json';
import { NestedKeyOf } from 'next-intl';

declare module '@tanstack/react-table' {
  interface ColumnMeta {
    headerClassName?: string;
    cellClassName?: string;
  }
}

type TTranslations = typeof en;

type TFunc<K extends keyof TTranslations> = (
  key: keyof TTranslations[K],
) => string;

type TTypeFunction<N extends keyof TTranslations> = <
  K extends NestedKeyOf<TTranslations[N]>,
>(
  key: K,
  options?: Record<string, string | number>,
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

type dataTableHeaderType = {
  label: string;
  className?: string;
};

type baseButtonType =
  | {
      label: string;
      onClick: () => void;
      variant?: IbtnVariant;
      disabled?: boolean;
      className?: string;
      icon?: React.ReactNode;
      isLoading?: boolean;
    }
  | false;
interface ExportFileType {
  name: string;
  sheet: string;
  type: 'csv' | 'xlsx' | 'pdf' | 'txt';
}

type TToastTexts = Record<
  string,
  {
    title: string;
    description: string;
  }
>;

type ExtendedColumnDef<T, V = T> = ColumnDef<T, V> & {
  idForRowClick?: keyof T;
  accessorKey?: DeepKeys<T> | string;
  map?: {
    key: string;
    valueFrom?: DeepKeys<T> | string;
    mergedValuesFrom?: (DeepKeys<T> | string)[];
    dataTransformer?: (data: T) => string;
  };
};

type TAllowedExportFileTypes = 'csv' | 'pdf' | 'txt' | 'xlsx';

type ActionButtonDataTypes = {
  icon: LucideIcon;
  name: string;
  onClick?: () => void;
  isTrash?: boolean;
  hide?: boolean;
  id?: string;
  textClassName?: string;
};

type TBtnVariant =
  | 'link'
  | 'default'
  | 'destructive'
  | 'outline'
  | 'secondary'
  | 'ghost';

type TLabelValue = {
  label: string;
  value: string;
};
