'use client';

import type React from 'react';
import type {
  ImageUploaderProps,
  ImageUploadResponse,
  UploadProgress,
} from './types';
import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { ImageIcon, Upload, X, AlertCircle } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Alert, AlertDescription } from '../ui/alert';

const DEFAULT_UPLOAD_ENDPOINT = 'https://api.healthsync.me/api/common/u';
const DEFAULT_MAX_SIZE = 5 * 1024 * 1024; // 5MB

export function ImageUploader({
  editor,
  uploadEndpoint = DEFAULT_UPLOAD_ENDPOINT,
  maxSize = DEFAULT_MAX_SIZE,
}: ImageUploaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [uploadProgress, setUploadProgress] = useState<UploadProgress>({
    isUploading: false,
    progress: 0,
  });
  const [error, setError] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): string | null => {
    if (file.size > maxSize) {
      return `File size must be less than ${Math.round(maxSize / (1024 * 1024))}MB`;
    }

    if (!file.type.startsWith('image/')) {
      return 'Please select a valid image file';
    }

    return null;
  };

  const uploadImageToServer = async (
    file: File,
  ): Promise<ImageUploadResponse> => {
    const formData = new FormData();
    formData.append('images', file);

    try {
      const response = await fetch(uploadEndpoint, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }

      const result: ImageUploadResponse = await response.json();
      console.log('Upload result:', result);
      return result;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Upload failed',
      };
    }
  };

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ): Promise<void> => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Reset previous states
    setError('');

    // Validate file
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    // Start upload process
    setUploadProgress({
      isUploading: true,
      progress: 0,
      fileName: file.name,
    });

    try {
      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => ({
          ...prev,
          progress: Math.min(prev.progress + 10, 90),
        }));
      }, 200);

      // Upload to server
      const result = await uploadImageToServer(file);

      // Clear progress interval
      clearInterval(progressInterval);

      if (result.success && result?.data?.[0]) {
        // Complete progress
        setUploadProgress((prev) => ({ ...prev, progress: 100 }));

        // Insert image into editor
        editor
          ?.chain()
          .focus()
          .setImage({ src: result.data[0], alt: file.name })
          .run();

        // Close popover after short delay
        setTimeout(() => {
          setIsOpen(false);
          setUploadProgress({ isUploading: false, progress: 0 });
        }, 500);
      } else {
        setError(result.error || 'Upload failed');
        setUploadProgress({ isUploading: false, progress: 0 });
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Upload failed');
      setUploadProgress({ isUploading: false, progress: 0 });
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleUrlSubmit = (): void => {
    if (imageUrl.trim()) {
      editor?.chain().focus().setImage({ src: imageUrl.trim() }).run();
      setImageUrl('');
      setIsOpen(false);
    }
  };

  const cancelUpload = (): void => {
    setUploadProgress({ isUploading: false, progress: 0 });
    setError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return (
      Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
    );
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" title="Insert Image">
          <ImageIcon className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-fit">
        <div className="space-y-4">
          {/* Upload Section */}
          <div>
            <h4 className="mb-2 font-medium">Upload Image</h4>

            {error && (
              <Alert variant="destructive" className="mb-3">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {uploadProgress.isUploading ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="max-w-[200px] truncate">
                    {uploadProgress.fileName}
                  </span>
                  <Button variant="ghost" size="sm" onClick={cancelUpload}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <Progress value={uploadProgress.progress} className="w-full" />
                <div className="text-muted-foreground text-center text-xs">
                  Uploading... {uploadProgress.progress}%
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full bg-transparent"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadProgress.isUploading}
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Choose Image
                </Button>
                <div className="text-muted-foreground text-center text-xs">
                  Max size: {formatFileSize(maxSize)}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>
            )}
          </div>

          {/* URL Section */}
          <div>
            <h4 className="mb-2 font-medium">Or paste image URL</h4>
            <div className="flex gap-2">
              <Input
                placeholder="https://example.com/image.jpg"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                disabled={uploadProgress.isUploading}
              />
              <Button
                onClick={handleUrlSubmit}
                disabled={!imageUrl.trim() || uploadProgress.isUploading}
              >
                Add
              </Button>
            </div>
          </div>

          {/* Info Section */}
          <div className="text-muted-foreground space-y-1 text-xs">
            <p>• Supported formats: JPG, PNG, GIF, WebP</p>
            <p>• Images are uploaded to server for better performance</p>
            <p>• Large images will be automatically optimized</p>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
