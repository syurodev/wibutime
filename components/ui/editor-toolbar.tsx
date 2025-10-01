import * as React from 'react';
import { useEditorRef } from 'platejs/react';
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Code,
  Heading1,
  Heading2,
  Heading3,
  Quote,
  List,
  ListOrdered,
  Image as ImageIcon,
} from 'lucide-react';

import { FixedToolbar } from '@/components/ui/fixed-toolbar';
import { MarkToolbarButton } from '@/components/ui/mark-toolbar-button';
import { ToolbarButton, ToolbarSeparator } from '@/components/ui/toolbar';
import { cn } from '@/lib/utils';

interface EditorToolbarProps {
  className?: string;
  onImageUpload?: (files: FileList) => void;
}

export function EditorToolbar({ className, onImageUpload }: EditorToolbarProps) {
  const editor = useEditorRef();
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      onImageUpload?.(files);
    }
    // Reset input to allow selecting the same file again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <>
      <FixedToolbar className={cn('flex flex-wrap items-center gap-2', className)}>
        {/* Heading buttons */}
        <div className="flex items-center gap-1">
          <ToolbarButton
            onClick={() => editor.tf.h1?.toggle?.()}
            tooltip="Heading 1"
          >
            <Heading1 className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.tf.h2?.toggle?.()}
            tooltip="Heading 2"
          >
            <Heading2 className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.tf.h3?.toggle?.()}
            tooltip="Heading 3"
          >
            <Heading3 className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.tf.blockquote?.toggle?.()}
            tooltip="Blockquote"
          >
            <Quote className="h-4 w-4" />
          </ToolbarButton>
        </div>

        <ToolbarSeparator />

        {/* Text formatting */}
        <div className="flex items-center gap-1">
          <MarkToolbarButton nodeType="bold" tooltip="Bold (⌘+B)">
            <Bold className="h-4 w-4" />
          </MarkToolbarButton>
          <MarkToolbarButton nodeType="italic" tooltip="Italic (⌘+I)">
            <Italic className="h-4 w-4" />
          </MarkToolbarButton>
          <MarkToolbarButton nodeType="underline" tooltip="Underline (⌘+U)">
            <Underline className="h-4 w-4" />
          </MarkToolbarButton>
          <MarkToolbarButton nodeType="strikethrough" tooltip="Strikethrough">
            <Strikethrough className="h-4 w-4" />
          </MarkToolbarButton>
          <MarkToolbarButton nodeType="code" tooltip="Inline Code">
            <Code className="h-4 w-4" />
          </MarkToolbarButton>
        </div>

        <ToolbarSeparator />

        {/* Lists */}
        <div className="flex items-center gap-1">
          <ToolbarButton
            onClick={() => editor.tf.list?.toggle?.({ type: 'ul' })}
            tooltip="Bullet List"
          >
            <List className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.tf.list?.toggle?.({ type: 'ol' })}
            tooltip="Numbered List"
          >
            <ListOrdered className="h-4 w-4" />
          </ToolbarButton>
        </div>

        <ToolbarSeparator />

        {/* Media */}
        <div className="flex items-center gap-1">
          <ToolbarButton onClick={handleImageClick} tooltip="Insert Image">
            <ImageIcon className="h-4 w-4" />
          </ToolbarButton>
        </div>
      </FixedToolbar>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={handleFileSelect}
      />
    </>
  );
}