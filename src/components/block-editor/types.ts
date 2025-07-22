import type React from 'react';
import type { Editor } from '@tiptap/react';

export interface BlockEditorProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  imageUploadEndpoint?: string;
  maxImageSize?: number;
  outerClassName?: string;
}

export interface BlockEditorRef {
  focus: () => void;
  blur: () => void;
  getHTML: () => string;
  setHTML: (html: string) => void;
}

export interface EditorComponentProps {
  editor: Editor;
}

export interface ImageUploaderProps extends EditorComponentProps {
  uploadEndpoint?: string;
  maxSize?: number;
}

export interface SlashCommandMenuProps {
  editor: Editor;
  range: { from: number; to: number };
  onClose: () => void;
}

export interface SlashCommand {
  title: string;
  description: string;
  icon: React.ReactNode;
  command: () => void;
}

export interface FontOption {
  value: string;
  label: string;
}

export interface ColorPalette {
  textColors: string[];
  highlightColors: string[];
}

export interface ImageUploadResponse {
  success: boolean;
  url?: string;
  error?: string;
}

export interface UploadProgress {
  isUploading: boolean;
  progress: number;
  fileName?: string;
}
