'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Settings } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Editor } from '@tiptap/react';

interface ImageResizeControlsProps {
  editor: Editor;
}

export function ImageResizeControls({ editor }: ImageResizeControlsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [width, setWidth] = useState('');
  const [height, setHeight] = useState('');

  const handleResize = () => {
    const { selection } = editor.state;
    const node = editor.state.doc.nodeAt(selection.from);

    if (node && node.type.name === 'image') {
      const updates: Record<string, number> = {};
      if (width) updates.width = Number.parseInt(width);
      if (height) updates.height = Number.parseInt(height);

      if (Object.keys(updates).length > 0) {
        editor.chain().focus().updateAttributes('image', updates).run();
      }
    }
    setIsOpen(false);
    setWidth('');
    setHeight('');
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" title="Image Resize Controls">
          <Settings className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="space-y-4">
          <h4 className="font-medium">Resize Selected Image</h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium">Width (px)</Label>
              <Input
                type="number"
                placeholder="300"
                value={width}
                onChange={(e) => setWidth(e.target.value)}
                className="mt-1"
                allowNepaliTranslation={false}
              />
            </div>
            <div>
              <Label className="text-sm font-medium">Height (px)</Label>
              <Input
                type="number"
                placeholder="200"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                className="mt-1"
                allowNepaliTranslation={false}
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleResize} className="flex-1">
              Apply Size
            </Button>
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
          </div>
          <div className="text-muted-foreground text-xs">
            <p>• Blue corner: Proportional resize</p>
            <p>• Green handle: Width only</p>
            <p>• Orange handle: Height only</p>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
