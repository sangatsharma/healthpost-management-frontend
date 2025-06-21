import { ImagePlus, Trash } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Input } from '../ui/input';

type FileUploaderProps = {
  name?: string;
  onChange?: (files: File[]) => void;
  defaultValue?: (File | string)[];
  maxSize?: number;
  allowImage?: boolean;
  allowFile?: boolean;
  showPreview?: boolean;
  maxFiles?: number;
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

export const FileUploader: React.FC<FileUploaderProps> = ({
  name = 'file',
  onChange,
  defaultValue = [],
  maxSize = 2 * 1024 * 1024,
  allowImage = true,
  allowFile = false,
  showPreview = true,
  maxFiles = 5,
}) => {
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<(string | File)[]>([]);
  const [filePreviewsMap, setFilePreviewsMap] = useState<
    Record<string, string>
  >({});

  // Load previews for defaultValue on mount
  useEffect(() => {
    const loadPreviews = () => {
      const newPreviews: (string | File)[] = [];

      for (const item of defaultValue) {
        if (typeof item === 'string') {
          newPreviews.push(item);
        } else if (item instanceof File) {
          newPreviews.push(item);
        }
      }

      const defaultFiles = defaultValue.filter(
        (f): f is File => f instanceof File,
      );
      setFiles(defaultFiles);
      setPreviews(newPreviews);
    };

    loadPreviews();
  }, [defaultValue]);

  // Generate preview URLs for File objects
  useEffect(() => {
    const newFilePreviewsMap: Record<string, string> = {};

    previews.forEach((item) => {
      if (item instanceof File) {
        newFilePreviewsMap[item.name + item.size + item.lastModified] =
          URL.createObjectURL(item);
      }
    });

    // Clean up old URLs
    return () => {
      Object.values(newFilePreviewsMap).forEach(URL.revokeObjectURL);
    };
  }, [previews]);

  // We must save URLs somewhere so we can use them in the render and revoke on unmount.
  // To update filePreviewsMap after previews change:
  useEffect(() => {
    const newFilePreviewsMap: Record<string, string> = {};
    previews.forEach((item) => {
      if (item instanceof File) {
        const key = item.name + item.size + item.lastModified;
        newFilePreviewsMap[key] = URL.createObjectURL(item);
      }
    });

    setFilePreviewsMap((prev) => {
      // Revoke previous URLs not in new previews
      Object.entries(prev).forEach(([key, url]) => {
        if (!(key in newFilePreviewsMap)) {
          URL.revokeObjectURL(url);
        }
      });
      return newFilePreviewsMap;
    });
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

  const onDrop = (acceptedFiles: File[]) => {
    const newFiles = [...files, ...acceptedFiles].slice(0, maxFiles);
    setFiles(newFiles);

    const newPreviews = [...previews, ...acceptedFiles].slice(0, maxFiles);
    setPreviews(newPreviews);

    onChange?.(newFiles);
  };

  const removeItemAtIndex = (index: number) => {
    const updatedPreviews = [...previews];
    const removed = updatedPreviews.splice(index, 1)[0];

    setPreviews(updatedPreviews);

    if (removed instanceof File) {
      const updatedFiles = files.filter((f) => f !== removed);
      setFiles(updatedFiles);
      onChange?.(updatedFiles);
    } else {
      onChange?.(files);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: getAcceptTypes(),
    maxSize,
    maxFiles,
  });

  return (
    <div
      {...getRootProps()}
      className="border-foreground shadow-foreground mx-auto flex w-full cursor-pointer flex-col items-center justify-center gap-y-3 rounded-sm border p-4 shadow-sm"
    >
      {showPreview && previews.length > 0 ? (
        <div className="grid w-full grid-cols-2 gap-4">
          {previews.map((item, idx) => {
            if (typeof item === 'string') {
              return (
                <div key={idx} className="relative rounded-lg border p-2">
                  <Image
                    src={item}
                    alt={`Preview ${idx + 1}`}
                    className="rounded-lg object-contain"
                    width={24}
                    height={24}
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
            } else if (item instanceof File) {
              const key = item.name + item.size + item.lastModified;
              const previewSrc = filePreviewsMap[key];

              if (item.type.startsWith('image/')) {
                return (
                  <div key={idx} className="relative rounded-lg border p-2">
                    {previewSrc ? (
                      <Image
                        src={previewSrc}
                        alt={`Preview ${idx + 1}`}
                        className="rounded-lg object-contain"
                        width={44}
                        height={44}
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
                    className="relative flex items-center justify-center rounded-lg border p-2 text-3xl font-bold"
                    title={item.name}
                  >
                    {
                      <Image
                        src={getFileIcon(item.name)}
                        alt="icons"
                        height={44}
                        width={44}
                      />
                    }

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
          Selected file(s): {files.map((f) => f.name).join(', ')}
        </div>
      )}
    </div>
  );
};
