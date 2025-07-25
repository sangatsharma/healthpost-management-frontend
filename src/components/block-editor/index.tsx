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
import { cn } from '@/lib/utils';

const BlockEditor = forwardRef<BlockEditorRef, BlockEditorProps>(
  (
    {
      value = '',
      onChange,
      placeholder = "Type '/' for commands or start writing...",
      className = '',
      disabled = false,
      imageUploadEndpoint,
      maxImageSize = 1 * 1024 * 1024, // 5MB
      outerClassName,
    },
    ref,
  ) => {
    const [showSlashMenu, setShowSlashMenu] = useState(false);
    const [slashRange, setSlashRange] = useState<{
      from: number;
      to: number;
    } | null>(null);

    const editor = useEditor({
      content: value,
      editable: !disabled,
      immediatelyRender: false,
      editorProps: {
        attributes: {
          class: `prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none max-w-4xl min-h-[400px] p-8 dark:bg-[#181818] ${className}`,
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
      extensions: [
        StarterKit.configure({
          bulletList: { keepMarks: true, keepAttributes: false },
          orderedList: { keepMarks: true, keepAttributes: false },
          blockquote: false, // Disable StarterKit's blockquote since we're using the explicit extension
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
      <div
        className={cn(
          'bg-background flex flex-col rounded-lg border',
          outerClassName,
        )}
      >
        <Toolbar
          editor={editor}
          imageUploadEndpoint={imageUploadEndpoint}
          maxImageSize={maxImageSize}
        />
        <BubbleMenuComponent editor={editor} />

        {showSlashMenu && slashRange && (
          <div className="fixed z-50 mt-2" style={{ left: '20%', top: '30%' }}>
            <SlashCommandMenu
              editor={editor}
              range={slashRange}
              onClose={() => setShowSlashMenu(false)}
            />
          </div>
        )}

        <EditorContent
          editor={editor}
          className={cn(
            'editorContent w-full overflow-y-scroll border',
            className,
          )}
        />
      </div>
    );
  },
);

BlockEditor.displayName = 'BlockEditor';

export default BlockEditor;
