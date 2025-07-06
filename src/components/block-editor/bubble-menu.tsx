'use client';

import { useCallback } from 'react';
import { BubbleMenu } from '@tiptap/react';
import { Button } from '@/components/ui/button';
import {
  Bold,
  Italic,
  Strikethrough,
  Code,
  UnderlineIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
} from 'lucide-react';
import { cn } from '@/lib/utils';

import type { Editor } from '@tiptap/core';

interface BubbleMenuComponentProps {
  editor: Editor;
}

export function BubbleMenuComponent({ editor }: BubbleMenuComponentProps) {
  const isImageSelected = useCallback(() => {
    if (!editor) return false;
    const { selection } = editor.state;
    const node = editor.state.doc.nodeAt(selection.from);
    return node && node.type.name === 'image';
  }, [editor]);

  const alignImage = (alignment: string) => {
    const { selection } = editor.state;
    const node = editor.state.doc.nodeAt(selection.from);

    if (node && node.type.name === 'image') {
      editor
        .chain()
        .focus()
        .updateAttributes('image', { align: alignment })
        .run();
    }
  };

  return (
    <BubbleMenu
      editor={editor}
      tippyOptions={{ duration: 100 }}
      className="bg-background flex items-center gap-1 rounded-lg border p-2 shadow-lg"
    >
      {isImageSelected() ? (
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => alignImage('left')}
            title="Align image left"
          >
            <AlignLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => alignImage('center')}
            title="Align image center"
          >
            <AlignCenter className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => alignImage('right')}
            title="Align image right"
          >
            <AlignRight className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={cn(editor.isActive('bold') && 'bg-muted')}
          >
            <Bold className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={cn(editor.isActive('italic') && 'bg-muted')}
          >
            <Italic className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            className={cn(editor.isActive('underline') && 'bg-muted')}
          >
            <UnderlineIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleStrike().run()}
            className={cn(editor.isActive('strike') && 'bg-muted')}
          >
            <Strikethrough className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleCode().run()}
            className={cn(editor.isActive('code') && 'bg-muted')}
          >
            <Code className="h-4 w-4" />
          </Button>
          <div className="bg-border mx-1 h-6 w-px" />
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().setTextAlign('left').run()}
              className={cn(
                editor.isActive({ textAlign: 'left' }) && 'bg-muted',
              )}
              title="Align left"
            >
              <AlignLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() =>
                editor.chain().focus().setTextAlign('center').run()
              }
              className={cn(
                editor.isActive({ textAlign: 'center' }) && 'bg-muted',
              )}
              title="Align center"
            >
              <AlignCenter className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().setTextAlign('right').run()}
              className={cn(
                editor.isActive({ textAlign: 'right' }) && 'bg-muted',
              )}
              title="Align right"
            >
              <AlignRight className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() =>
                editor.chain().focus().setTextAlign('justify').run()
              }
              className={cn(
                editor.isActive({ textAlign: 'justify' }) && 'bg-muted',
              )}
              title="Justify"
            >
              <AlignJustify className="h-4 w-4" />
            </Button>
          </div>
        </>
      )}
    </BubbleMenu>
  );
}
