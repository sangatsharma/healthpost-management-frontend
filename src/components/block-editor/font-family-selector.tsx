'use client';

import type { EditorComponentProps, FontOption } from './types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';

const FONT_OPTIONS: FontOption[] = [
  { value: 'Inter', label: 'Inter' },
  { value: 'Arial', label: 'Arial' },
  { value: 'Helvetica', label: 'Helvetica' },
  { value: 'Times New Roman', label: 'Times New Roman' },
  { value: 'Georgia', label: 'Georgia' },
  { value: 'Verdana', label: 'Verdana' },
  { value: 'Courier New', label: 'Courier New' },
  { value: 'system-ui', label: 'System UI' },
  { value: 'serif', label: 'Serif' },
  { value: 'sans-serif', label: 'Sans Serif' },
  { value: 'monospace', label: 'Monospace' },
];

export function FontFamilySelector({ editor }: EditorComponentProps) {
  const handleFontChange = (fontFamily: string): void => {
    editor.chain().focus().setFontFamily(fontFamily).run();
  };

  return (
    <div className="flex items-center gap-2">
      <Label className="text-sm font-medium whitespace-nowrap">Font:</Label>
      <Select onValueChange={handleFontChange}>
        <SelectTrigger className="w-48">
          <SelectValue placeholder="Select font" />
        </SelectTrigger>
        <SelectContent>
          {FONT_OPTIONS.map((font) => (
            <SelectItem
              key={font.value}
              value={font.value}
              style={{ fontFamily: font.value }}
            >
              {font.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
