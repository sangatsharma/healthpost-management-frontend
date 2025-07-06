'use client';
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from '@/components/ui/command';
import { Editor } from '@tiptap/react';
import {
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Minus,
  Type,
  Bold,
  Italic,
  UnderlineIcon,
  Strikethrough,
  Code,
} from 'lucide-react';

interface SlashCommandMenuProps {
  editor: Editor;
  range: { from: number; to: number };
  onClose: () => void;
}

export function SlashCommandMenu({
  editor,
  range,
  onClose,
}: SlashCommandMenuProps) {
  const commands = [
    {
      title: 'Heading 1',
      description: 'Big section heading',
      icon: <Heading1 className="h-4 w-4" />,
      command: () => {
        editor
          .chain()
          .focus()
          .deleteRange(range)
          .setNode('heading', { level: 1 })
          .run();
        onClose?.();
      },
    },
    {
      title: 'Heading 2',
      description: 'Medium section heading',
      icon: <Heading2 className="h-4 w-4" />,
      command: () => {
        editor
          .chain()
          .focus()
          .deleteRange(range)
          .setNode('heading', { level: 2 })
          .run();
        onClose?.();
      },
    },
    {
      title: 'Heading 3',
      description: 'Small section heading',
      icon: <Heading3 className="h-4 w-4" />,
      command: () => {
        editor
          .chain()
          .focus()
          .deleteRange(range)
          .setNode('heading', { level: 3 })
          .run();
        onClose?.();
      },
    },
    {
      title: 'Paragraph',
      description: 'Normal text',
      icon: <Type className="h-4 w-4" />,
      command: () => {
        editor.chain().focus().deleteRange(range).setParagraph().run();
        onClose?.();
      },
    },
    {
      title: 'Bold',
      description: 'Bold text',
      icon: <Bold className="h-4 w-4" />,
      command: () => {
        editor.chain().focus().deleteRange(range).toggleBold().run();
        onClose?.();
      },
    },
    {
      title: 'Italic',
      description: 'Italic text',
      icon: <Italic className="h-4 w-4" />,
      command: () => {
        editor.chain().focus().deleteRange(range).toggleItalic().run();
        onClose?.();
      },
    },
    {
      title: 'Underline',
      description: 'Underline text',
      icon: <UnderlineIcon className="h-4 w-4" />,
      command: () => {
        editor.chain().focus().deleteRange(range).toggleUnderline().run();
        onClose?.();
      },
    },
    {
      title: 'Strikethrough',
      description: 'Strikethrough text',
      icon: <Strikethrough className="h-4 w-4" />,
      command: () => {
        editor.chain().focus().deleteRange(range).toggleStrike().run();
        onClose?.();
      },
    },
    {
      title: 'Inline Code',
      description: 'Inline code',
      icon: <Code className="h-4 w-4" />,
      command: () => {
        editor.chain().focus().deleteRange(range).toggleCode().run();
        onClose?.();
      },
    },
    {
      title: 'Bullet List',
      description: 'Create a simple bullet list',
      icon: <List className="h-4 w-4" />,
      command: () => {
        editor.chain().focus().deleteRange(range).toggleBulletList().run();
        onClose?.();
      },
    },
    {
      title: 'Numbered List',
      description: 'Create a numbered list',
      icon: <ListOrdered className="h-4 w-4" />,
      command: () => {
        editor.chain().focus().deleteRange(range).toggleOrderedList().run();
        onClose?.();
      },
    },
    {
      title: 'Quote',
      description: 'Capture a quote',
      icon: <Quote className="h-4 w-4" />,
      command: () => {
        editor.chain().focus().deleteRange(range).toggleBlockquote().run();
        onClose?.();
      },
    },
    {
      title: 'Divider',
      description: 'Visually divide blocks',
      icon: <Minus className="h-4 w-4" />,
      command: () => {
        editor.chain().focus().deleteRange(range).setHorizontalRule().run();
        onClose?.();
      },
    },
  ];

  return (
    <CommandDialog
      open
      onOpenChange={onClose}
      title="Commands"
      description="Type to filter commands"
    >
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Formatting">
          {commands.map((item, index) => (
            <CommandItem key={index} onSelect={item.command}>
              {item.icon}
              <div className="text-left">
                <div className="font-medium">{item.title}</div>
                <div className="text-muted-foreground text-xs">
                  {item.description}
                </div>
              </div>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
