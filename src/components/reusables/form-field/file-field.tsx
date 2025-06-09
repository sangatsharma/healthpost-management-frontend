/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import type React from 'react';

import { forwardRef, useState, useEffect } from 'react';
import {
  FormControl,
  FormDescription,
  FormField as ShadcnFormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { UseFormReturn } from 'react-hook-form';
import { FileFieldProps } from '@/types/formField.types';
import Image from 'next/image';

export const FileField = forwardRef<
  HTMLDivElement,
  FileFieldProps & {
    value?: File | File[] | null;
    onChange?: (value: File | File[] | null) => void;
    form?: UseFormReturn<any>;
  }
>(
  (
    {
      name,
      label,
      description,
      value,
      onChange,
      disabled = false,
      required = false,
      className,
      form,
      accept,
      multiple = false,
      ...rest
    },
    ref,
  ) => {
    const [filePreview, setFilePreview] = useState<string | null>(null);

    useEffect(() => {
      if (value instanceof File && value.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = () => {
          setFilePreview(reader.result as string);
        };
        reader.readAsDataURL(value);
      } else {
        setFilePreview(null);
      }
    }, [value]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files && files.length > 0) {
        const file = files[0];
        const newValue = multiple ? Array.from(files) : file;

        if (onChange) {
          onChange(newValue);
        }

        // Create preview for image files
        if (file.type.startsWith('image/')) {
          const reader = new FileReader();
          reader.onload = () => {
            setFilePreview(reader.result as string);
          };
          reader.readAsDataURL(file);
        }
      } else {
        setFilePreview(null);
        if (onChange) {
          onChange(null);
        }
      }
    };

    const clearFile = () => {
      setFilePreview(null);
      if (onChange) {
        onChange(null);
      }
    };

    const renderFileInput = (field?: any) => (
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              const fileInput = document.getElementById(
                `file-${name}`,
              ) as HTMLInputElement;
              if (fileInput) fileInput.click();
            }}
            disabled={disabled}
            className={className}
            {...rest}
          >
            Choose File
          </Button>
          {filePreview && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={clearFile}
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        <input
          id={`file-${name}`}
          name={name}
          type="file"
          className="hidden"
          onChange={handleFileChange}
          disabled={disabled}
          accept={accept}
          multiple={multiple}
          {...rest}
          {...(field ? { ref: field.ref } : {})}
        />
        {filePreview && (
          <div className="border-border relative mt-2 overflow-hidden rounded-md border">
            <Image
              src={filePreview || '/placeholder.svg'}
              alt="Preview"
              className="max-h-40 max-w-full object-contain"
            />
          </div>
        )}
      </div>
    );

    if (form) {
      return (
        <ShadcnFormField
          control={form.control}
          name={name}
          render={({ field }) => (
            <FormItem ref={ref}>
              {label && (
                <FormLabel
                  className={cn(
                    required &&
                      "after:ml-0.5 after:text-red-500 after:content-['*']",
                  )}
                >
                  {label}
                </FormLabel>
              )}
              <FormControl>{renderFileInput(field)}</FormControl>
              {description && <FormDescription>{description}</FormDescription>}
              <FormMessage />
            </FormItem>
          )}
        />
      );
    }

    return (
      <div className="space-y-2" ref={ref}>
        {label && (
          <label
            className={cn(
              'text-sm font-medium',
              required && "after:ml-0.5 after:text-red-500 after:content-['*']",
            )}
          >
            {label}
          </label>
        )}
        {renderFileInput()}
        {description && (
          <p className="text-muted-foreground text-sm">{description}</p>
        )}
      </div>
    );
  },
);

FileField.displayName = 'FileField';
