'use client';

import type { EditorComponentProps } from './types';
import { useState } from 'react';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';

const MIN_FONT_SIZE = 8;
const MAX_FONT_SIZE = 72;
const DEFAULT_FONT_SIZE = 16;

export function FontSizeSlider({ editor }: EditorComponentProps) {
  const [fontSize, setFontSize] = useState<number[]>([DEFAULT_FONT_SIZE]);

  const handleFontSizeChange = (value: number[]): void => {
    setFontSize(value);
    editor
      .chain()
      .focus()
      .setMark?.('textStyle', { fontSize: `${value[0]}px` })
      .run();
  };

  return (
    <div className="flex min-w-[200px] items-center gap-2">
      <Label className="text-sm font-medium whitespace-nowrap">Size:</Label>
      <div className="flex-1">
        <Slider
          value={fontSize}
          onValueChange={handleFontSizeChange}
          max={MAX_FONT_SIZE}
          min={MIN_FONT_SIZE}
          step={1}
          className="w-full"
        />
      </div>
      <span className="text-muted-foreground min-w-[40px] text-sm">
        {fontSize[0]}px
      </span>
    </div>
  );
}
