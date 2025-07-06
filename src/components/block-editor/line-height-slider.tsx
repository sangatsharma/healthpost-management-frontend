'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Menu } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Editor } from '@tiptap/react';

interface LineHeightSliderProps {
  editor: Editor;
}

export function LineHeightSlider({ editor }: LineHeightSliderProps) {
  const [lineHeight, setLineHeight] = useState([1.5]);

  const handleLineHeightChange = (value: number[]) => {
    setLineHeight(value);

    editor
      .chain()
      .focus()
      .updateAttributes('paragraph', { style: `line-height: ${value[0]}` })
      .run();
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" title="Line Height">
          <Menu className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="space-y-4">
          <div>
            <Label className="text-sm font-medium">
              Line Height: {lineHeight[0]}
            </Label>
            <Slider
              value={lineHeight}
              onValueChange={handleLineHeightChange}
              max={3}
              min={0.5}
              step={0.1}
              className="mt-2"
            />
          </div>
          <div className="border-t pt-2">
            <Button
              variant="outline"
              size="sm"
              className="w-full bg-transparent"
              onClick={() => {
                editor
                  .chain()
                  .focus()
                  .updateAttributes('paragraph', { style: 'line-height: 1.5' })
                  .run();
                setLineHeight([1.5]);
              }}
            >
              Reset Line Height
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
