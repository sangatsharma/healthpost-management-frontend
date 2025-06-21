'use client';

import { ImagePlus, Trash, Upload } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Input } from '../ui/input';

import type React from 'react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type FileUploaderProps = {
  name?: string;
  onChange?: (files: (File | string)[]) => void;
  defaultValue?: (File | string)[];
  maxSize?: number;
  allowImage?: boolean;
  allowFile?: boolean;
  showPreview?: boolean;
  maxFiles?: number;
  uploaderType?: 'dropzone' | 'input';
  label?: string;
  className?: string;
};

const fileTypeIconMap: Record<string, string> = {
  pdf: '/pdf.png',
  doc: '/doc.png',
  docx: '/doc.png',
  xls: '/xls.png',
  xlsx: '/xls.png',
  csv: '/txt-file.png',
  txt: '/txt-file.png',
  default: '/file.png',
};

function getFileExtension(filename: string) {
  return filename.split('.').pop()?.toLowerCase() || '';
}

function getFileIcon(filename: string) {
  const ext = getFileExtension(filename);
  return fileTypeIconMap[ext] || fileTypeIconMap['default'];
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return (
    Number.parseFloat((bytes / Math.pow(k, i)).toFixed(3)) + ' ' + sizes[i]
  );
}

export const FileUploader: React.FC<FileUploaderProps> = ({
  name = 'file',
  onChange,
  defaultValue = [],
  maxSize = 2 * 1024 * 1024,
  allowImage = true,
  allowFile = false,
  showPreview = true,
  maxFiles = 5,
  uploaderType = 'dropzone',
  className,
}) => {
  const [files, setFiles] = useState<(string | File)[]>([]);
  const [previews, setPreviews] = useState<(string | File)[]>([]);
  const [filePreviewsMap, setFilePreviewsMap] = useState<
    Record<string, string>
  >({});

  // Load previews for defaultValue on mount
  useEffect(() => {
    setFiles(defaultValue);
    setPreviews(defaultValue);
  }, [defaultValue]);

  // Simplify the filePreviewsMap useEffect
  useEffect(() => {
    const newFilePreviewsMap: Record<string, string> = {};

    previews.forEach((item) => {
      if (item instanceof File) {
        const key = item.name + item.size + item.lastModified;
        newFilePreviewsMap[key] = URL.createObjectURL(item);
      }
    });

    setFilePreviewsMap(newFilePreviewsMap);

    // Cleanup function
    return () => {
      Object.values(newFilePreviewsMap).forEach(URL.revokeObjectURL);
    };
  }, [previews]);

  const getAcceptTypes = () => {
    const types: string[] = [];
    if (allowImage)
      types.push('image/png', 'image/jpeg', 'image/jpg', 'image/webp');
    if (allowFile)
      types.push(
        'application/pdf',
        'application/msword',
        'application/vnd.ms-excel',
        'text/plain',
      );
    return types.reduce((acc, type) => ({ ...acc, [type]: [] }), {});
  };

  const getAcceptString = () => {
    const types: string[] = [];
    if (allowImage) types.push('.png', '.jpeg', '.jpg', '.webp');
    if (allowFile) types.push('.pdf', '.doc', '.docx', '.xls', '.xlsx', '.txt');
    return types.join(',');
  };

  const onDrop = (acceptedFiles: File[]) => {
    const newFiles = [...files, ...acceptedFiles].slice(0, maxFiles);
    setFiles(newFiles);

    const newPreviews = [...previews, ...acceptedFiles].slice(0, maxFiles);
    setPreviews(newPreviews);

    onChange?.(newFiles);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files || []);
    if (selectedFiles.length > 0) {
      onDrop(selectedFiles);
    }
  };

  const removeItemAtIndex = (index: number) => {
    const updatedPreviews = [...previews];
    const removed = updatedPreviews.splice(index, 1)[0];
    const updatedFiles = files.filter((f) => f !== removed);
    setPreviews(updatedFiles);

    setFiles(updatedFiles);
    onChange?.(updatedFiles);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: getAcceptTypes(),
    maxSize,
    maxFiles,
  });

  const renderFileItem = (item: string | File, index: number) => {
    let fileName = '';
    let fileSize = '';
    let iconSrc = '';

    if (typeof item === 'string') {
      fileName = item.split('/').pop() || 'Unknown file';
      fileSize = 'Unknown size';
      iconSrc = '/file.png';
    } else if (item instanceof File) {
      fileName = item.name;
      fileSize = formatFileSize(item.size);
      const key = item.name + item.size + item.lastModified;

      if (item.type.startsWith('image/')) {
        iconSrc = filePreviewsMap[key] || '/placeholder.svg?height=24&width=24';
      } else {
        iconSrc = getFileIcon(item.name);
      }
    }

    return (
      <div
        key={index}
        className={cn(
          'flex items-center justify-between rounded-lg border bg-gray-50 p-3',
          className,
        )}
      >
        <div className="flex items-center gap-3">
          {/* File Icon */}
          <div className="flex-shrink-0">
            <Image
              src={iconSrc || getFileIcon(iconSrc)}
              alt="File preview"
              width={24}
              height={24}
              className="rounded object-cover"
            />
          </div>

          {/* File Info */}
          <div className="flex flex-col overflow-hidden">
            <span className="line-clamp-1 text-sm font-medium text-wrap text-gray-900">
              {fileName.slice(0, 35)}
              {fileName.length > 35 ? '...' : ''}
            </span>
            <span className="text-xs text-gray-500">{fileSize}</span>
          </div>
        </div>

        {/* Remove Button */}

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => removeItemAtIndex(index)}
          className="h-8 px-3 text-red-600 hover:bg-red-50 hover:text-red-700"
        >
          <Trash className="mr-1 h-4 w-4" />
        </Button>
      </div>
    );
  };

  if (uploaderType === 'input') {
    return (
      <div className={cn('space-y-3', className)}>
        {/* Upload Area */}
        <div className="relative">
          <div className="border-input bg-background ring-offset-background flex h-10 w-full cursor-pointer items-center gap-2 rounded-md border px-3 py-2 text-sm hover:bg-gray-50">
            {/* File Input - Hidden */}
            <input
              type="file"
              name={name}
              onChange={handleInputChange}
              accept={getAcceptString()}
              multiple={maxFiles > 1}
              className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
            />

            {/* Display Text */}
            <div className="flex-1 truncate text-sm">
              {files.length > 0 ? (
                <span className="text-foreground">
                  {files.length} file{files.length > 1 ? 's' : ''} selected
                </span>
              ) : (
                <span className="text-muted-foreground">
                  Choose file{maxFiles > 1 ? 's' : ''}...
                </span>
              )}
            </div>

            {/* Upload Icon */}
            <Upload className="text-muted-foreground h-4 w-4 flex-shrink-0" />
          </div>
        </div>

        {/* File List */}
        {previews.length > 0 && (
          <div className="space-y-2">
            {previews.map((item, index) => renderFileItem(item, index))}
          </div>
        )}

        {/* File Info */}
        <div className="text-muted-foreground text-xs">
          Max {maxFiles} file{maxFiles > 1 ? 's' : ''},{' '}
          {Math.round(maxSize / 1024 / 1024)}MB each
        </div>
      </div>
    );
  }

  // Default dropzone mode
  return (
    <div
      {...getRootProps()}
      className={cn(
        'flex w-full cursor-pointer flex-col items-center justify-center gap-y-3 rounded-lg border-2 border-dashed border-gray-300 p-6 transition-colors hover:border-gray-400',
        className,
      )}
    >
      {showPreview && previews.length > 0 ? (
        <div className="flex flex-wrap gap-4">
          {previews.map((item, idx) => {
            if (typeof item === 'string') {
              return (
                <div key={idx} className="relative w-fit rounded-lg border p-2">
                  <Image
                    src={item}
                    alt={`Preview ${idx + 1}`}
                    width={80}
                    height={80}
                    className="h-24 object-cover"
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeItemAtIndex(idx);
                    }}
                    className="absolute top-1 right-1 cursor-pointer rounded bg-red-600 p-1 text-white"
                    aria-label="Remove file"
                  >
                    <Trash className="size-4" />
                  </button>
                </div>
              );
            } else if (item instanceof File) {
              const key = item.name + item.size + item.lastModified;
              const previewSrc = filePreviewsMap[key];

              if (item.type.startsWith('image/')) {
                return (
                  <div
                    key={idx}
                    className="relative w-fit rounded-lg border p-2"
                  >
                    {previewSrc ? (
                      <Image
                        src={previewSrc}
                        alt={`Preview ${idx + 1}`}
                        width={80}
                        height={80}
                        className="h-24 object-cover"
                      />
                    ) : (
                      <div className="h-[150px] w-[200px] animate-pulse rounded-lg bg-gray-200" />
                    )}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeItemAtIndex(idx);
                      }}
                      className="absolute top-1 right-1 rounded bg-red-600 p-1 text-white"
                      aria-label="Remove file"
                    >
                      <Trash className="size-4" />
                    </button>
                  </div>
                );
              } else {
                return (
                  <div
                    key={idx}
                    className="relative flex w-fit items-center justify-center rounded-lg border p-2 text-3xl font-bold"
                    title={item.name}
                  >
                    <Image
                      src={getFileIcon(item.name)}
                      alt="icons"
                      objectFit="contain"
                      width={64}
                      height={64}
                    />

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeItemAtIndex(idx);
                      }}
                      className="absolute top-1 right-1 rounded bg-red-600 p-1 text-white"
                      aria-label="Remove file"
                    >
                      <Trash className="size-4" />
                    </button>
                  </div>
                );
              }
            }
            return null;
          })}
        </div>
      ) : (
        <ImagePlus className="size-24 text-gray-400" />
      )}

      <Input {...getInputProps()} name={name} type="file" multiple />

      <p className="text-center text-sm text-gray-600">
        {isDragActive
          ? 'Drop the files here...'
          : `Click or drag up to ${maxFiles} file(s) (max ${Math.round(maxSize / 1024 / 1024)}MB each)`}
      </p>

      {files.length > 0 && (
        <div className="mt-2 text-center text-sm text-gray-500">
          Selected file(s):{' '}
          {files
            .map((f) => (typeof f === 'string' ? f.slice(0, 25) : f.name))
            .join(', ')}
        </div>
      )}
    </div>
  );
};
