'use client';

import type { BlockEditorProps, BlockEditorRef } from './types';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import FontFamily from '@tiptap/extension-font-family';
import TextStyle from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import Highlight from '@tiptap/extension-highlight';
import Blockquote from '@tiptap/extension-blockquote';

import { useState, useEffect, useImperativeHandle, forwardRef } from 'react';
import { Toolbar } from './toolbar';
import { BubbleMenuComponent } from './bubble-menu';
import { SlashCommandMenu } from './slash-command-menu';
import { FontSize, LineHeight, ResizableImage } from './extensions';

const BlockEditor = forwardRef<BlockEditorRef, BlockEditorProps>(
  (
    {
      value = '',
      onChange,
      placeholder = "Type '/' for commands or start writing...",
      className = '',
      disabled = false,
      imageUploadEndpoint = '/api/upload-image',
      maxImageSize = 1 * 1024 * 1024, // 5MB
    },
    ref,
  ) => {
    const [showSlashMenu, setShowSlashMenu] = useState(false);
    const [slashRange, setSlashRange] = useState<{
      from: number;
      to: number;
    } | null>(null);

    const editor = useEditor({
      extensions: [
        StarterKit.configure({
          bulletList: { keepMarks: true, keepAttributes: false },
          orderedList: { keepMarks: true, keepAttributes: false },
        }),
        TextAlign.configure({ types: ['heading', 'paragraph'] }),
        TextStyle,
        Color.configure({ types: [TextStyle.name] }),
        Highlight.configure({ multicolor: true }),
        FontFamily.configure({ types: ['textStyle'] }),
        FontSize,
        LineHeight,
        Blockquote,
        Underline,
        ResizableImage.configure({
          inline: true,
          HTMLAttributes: { class: 'rounded-lg max-w-full h-auto' },
        }),
        Placeholder.configure({
          placeholder: ({ node }) => {
            if (node.type.name === 'heading')
              return `Heading ${node.attrs.level}`;
            return placeholder;
          },
        }),
      ],
      content: value,
      editable: !disabled,
      editorProps: {
        attributes: {
          class: `prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none max-w-4xl min-h-[400px] p-8 ${className}`,
        },
        handleKeyDown: (view, event) => {
          // Use Ctrl+Space to trigger showSlashMenu (avoids browser Alt conflicts)
          if (event.ctrlKey && event.code === 'Space' && !showSlashMenu) {
            const { selection } = view.state;
            const { from } = selection;
            setSlashRange({ from, to: from });
            setTimeout(() => setShowSlashMenu(true), 10);
            return false;
          }
          if (event.key === 'Escape' && showSlashMenu) {
            setShowSlashMenu(false);
            return true;
          }
          return false;
        },
      },
      onUpdate: ({ editor }) => {
        const html = editor.getHTML();
        onChange?.(html);

        const { selection } = editor.state;
        const { from, to } = selection;

        if (from === to) {
          const textBefore = editor.state.doc.textBetween(
            Math.max(0, from - 10),
            from,
          );
          if (!textBefore.endsWith('/') && showSlashMenu) {
            setShowSlashMenu(false);
          }
        } else if (showSlashMenu) {
          setShowSlashMenu(false);
        }
      },
    });

    useEffect(() => {
      if (editor && value !== editor.getHTML()) {
        editor.commands.setContent(value);
      }
    }, [value, editor]);

    useImperativeHandle(ref, () => ({
      focus: () => editor?.commands.focus(),
      blur: () => editor?.commands.blur(),
      getHTML: () => editor?.getHTML() || '',
      setHTML: (html: string) => editor?.commands.setContent(html),
    }));

    if (!editor) return null;

    return (
      <div className="mx-auto w-full max-w-6xl">
        <div className="bg-background overflow-hidden rounded-lg border">
          <Toolbar
            editor={editor}
            imageUploadEndpoint={imageUploadEndpoint}
            maxImageSize={maxImageSize}
          />
          <BubbleMenuComponent editor={editor} />

          {showSlashMenu && slashRange && (
            <div
              className="fixed z-50 mt-2"
              style={{ left: '20%', top: '30%' }}
            >
              <SlashCommandMenu
                editor={editor}
                range={slashRange}
                onClose={() => setShowSlashMenu(false)}
              />
            </div>
          )}

          <div className="min-h-[500px]">
            <EditorContent editor={editor} className="editorContent" />
          </div>
        </div>

        <div className="text-muted-foreground mt-4 flex items-center justify-between text-sm">
          <div className="flex items-center gap-4 text-xs">
            <span>Press Ctrl + space to show commands menu.</span>
          </div>
        </div>
      </div>
    );
  },
);

BlockEditor.displayName = 'BlockEditor';

export { BlockEditor };
export default BlockEditor;
