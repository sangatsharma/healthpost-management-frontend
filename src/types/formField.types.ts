/* eslint-disable @typescript-eslint/no-explicit-any */
import type {
  ControllerRenderProps,
  FieldValues,
  UseFormReturn,
} from 'react-hook-form';
import type { ReactNode } from 'react';

export type FormFieldType =
  | 'text'
  | 'number'
  | 'email'
  | 'password'
  | 'textarea'
  | 'select'
  | 'checkbox'
  | 'switch'
  | 'radio'
  | 'file'
  | 'slider'
  | 'dropdown';

export interface FormFieldOption {
  label: string;
  value: string | number | boolean;
  disabled?: boolean;
}

export interface BaseFormFieldProps {
  name: string;
  label?: string;
  description?: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  readOnly?: boolean;
  className?: string;
  [key: string]: any;
}

export interface TextFieldProps extends BaseFormFieldProps {
  type?: 'text' | 'email' | 'password' | 'number';
  autoFocus?: boolean;
  autoComplete?: string;
  maxLength?: number;
  minLength?: number;
  pattern?: string;
  min?: number;
  max?: number;
  step?: number;
}

export interface TextareaFieldProps extends BaseFormFieldProps {
  type: 'textarea';
  rows?: number;
  cols?: number;
}

export interface SelectFieldProps extends BaseFormFieldProps {
  type: 'select' | 'dropdown';
  options: FormFieldOption[];
}

export interface CheckboxFieldProps extends BaseFormFieldProps {
  type: 'checkbox' | 'switch';
}

export interface RadioFieldProps extends BaseFormFieldProps {
  type: 'radio';
  options: FormFieldOption[];
}

export interface FileFieldProps extends BaseFormFieldProps {
  type: 'file';
  accept?: string;
  multiple?: boolean;
}

export interface SliderFieldProps extends BaseFormFieldProps {
  type: 'slider';
  min?: number;
  max?: number;
  step?: number;
}

export type FormFieldProps<T extends FieldValues = FieldValues> =
  | (TextFieldProps & {
      value?: string | number;
      onChange?: (value: string | number) => void;
      form?: UseFormReturn<T>;
      renderField?: (field: ControllerRenderProps<T, any>) => ReactNode;
    })
  | (TextareaFieldProps & {
      value?: string;
      onChange?: (value: string) => void;
      form?: UseFormReturn<T>;
      renderField?: (field: ControllerRenderProps<T, any>) => ReactNode;
    })
  | (SelectFieldProps & {
      value?: string | number | boolean;
      onChange?: (value: string | number | boolean) => void;
      form?: UseFormReturn<T>;
      renderField?: (field: ControllerRenderProps<T, any>) => ReactNode;
    })
  | (CheckboxFieldProps & {
      value?: boolean;
      onChange?: (value: boolean) => void;
      form?: UseFormReturn<T>;
      renderField?: (field: ControllerRenderProps<T, any>) => ReactNode;
    })
  | (RadioFieldProps & {
      value?: string | number | boolean;
      onChange?: (value: string | number | boolean) => void;
      form?: UseFormReturn<T>;
      renderField?: (field: ControllerRenderProps<T, any>) => ReactNode;
    })
  | (FileFieldProps & {
      value?: File | File[] | null;
      onChange?: (value: File | File[] | null) => void;
      form?: UseFormReturn<T>;
      renderField?: (field: ControllerRenderProps<T, any>) => ReactNode;
    })
  | (SliderFieldProps & {
      value?: number;
      onChange?: (value: number) => void;
      form?: UseFormReturn<T>;
      renderField?: (field: ControllerRenderProps<T, any>) => ReactNode;
    });
