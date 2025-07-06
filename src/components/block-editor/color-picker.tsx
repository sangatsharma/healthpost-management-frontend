'use client';

import type { EditorComponentProps, ColorPalette } from './types';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Palette } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

const COLOR_PALETTE: ColorPalette = {
  textColors: [
    '#000000',
    '#374151',
    '#6B7280',
    '#9CA3AF',
    '#D1D5DB',
    '#F3F4F6',
    '#FFFFFF',
    '#DC2626',
    '#EA580C',
    '#D97706',
    '#CA8A04',
    '#65A30D',
    '#16A34A',
    '#059669',
    '#0891B2',
    '#0284C7',
    '#2563EB',
    '#4F46E5',
    '#7C3AED',
    '#A855F7',
    '#C026D3',
    '#DB2777',
    '#E11D48',
  ],
  highlightColors: [
    '#FEF3C7',
    '#FDE68A',
    '#FCD34D',
    '#F59E0B',
    '#D97706',
    '#DBEAFE',
    '#93C5FD',
    '#60A5FA',
    '#3B82F6',
    '#1D4ED8',
    '#D1FAE5',
    '#86EFAC',
    '#4ADE80',
    '#16A34A',
    '#15803D',
    '#FCE7F3',
    '#F9A8D4',
    '#F472B6',
    '#EC4899',
    '#DB2777',
    '#F3E8FF',
    '#DDD6FE',
    '#C4B5FD',
    '#A78BFA',
    '#8B5CF6',
  ],
};

export function ColorPicker({ editor }: EditorComponentProps) {
  const handleTextColorChange = (color: string): void => {
    editor.chain().focus().setColor(color).run();
  };

  const handleHighlightColorChange = (color: string): void => {
    editor.chain().focus().toggleHighlight({ color }).run();
  };

  const removeTextColor = (): void => {
    editor.chain().focus().unsetColor().run();
  };

  const removeHighlight = (): void => {
    editor.chain().focus().unsetHighlight().run();
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" title="Text & Highlight Colors">
          <Palette className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="space-y-4">
          <div>
            <Label className="mb-2 block text-sm font-medium">Text Color</Label>
            <div className="grid grid-cols-7 gap-2">
              {COLOR_PALETTE.textColors.map((color) => (
                <button
                  key={color}
                  className="h-8 w-8 rounded border-2 border-gray-200 transition-colors hover:border-gray-400"
                  style={{ backgroundColor: color }}
                  onClick={() => handleTextColorChange(color)}
                  title={color}
                />
              ))}
            </div>
            <Button
              variant="outline"
              size="sm"
              className="mt-2 w-full bg-transparent"
              onClick={removeTextColor}
            >
              Remove Text Color
            </Button>
          </div>

          <Separator />

          <div>
            <Label className="mb-2 block text-sm font-medium">
              Highlight Color
            </Label>
            <div className="grid grid-cols-5 gap-2">
              {COLOR_PALETTE.highlightColors.map((color) => (
                <button
                  key={color}
                  className="h-8 w-8 rounded border-2 border-gray-200 transition-colors hover:border-gray-400"
                  style={{ backgroundColor: color }}
                  onClick={() => handleHighlightColorChange(color)}
                  title={color}
                />
              ))}
            </div>
            <Button
              variant="outline"
              size="sm"
              className="mt-2 w-full bg-transparent"
              onClick={removeHighlight}
            >
              Remove Highlight
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
