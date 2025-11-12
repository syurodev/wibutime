'use client';

import * as React from 'react';

import {
  BoldPlugin,
  CodePlugin,
  H1Plugin,
  H2Plugin,
  H3Plugin,
  H4Plugin,
  HighlightPlugin,
  ItalicPlugin,
  StrikethroughPlugin,
  UnderlinePlugin,
  BlockquotePlugin,
  HorizontalRulePlugin,
} from '@platejs/basic-nodes/react';
import { KEYS } from 'platejs';
import {
  Bold,
  Code,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Highlighter,
  Italic,
  Minus,
  Pilcrow,
  Quote,
  Strikethrough,
  Underline,
} from 'lucide-react';

import { AlignToolbarButton } from './align-toolbar-button';
import { IndentToolbarButton, OutdentToolbarButton } from './indent-toolbar-button';
import { LinkToolbarButton } from './link-toolbar-button';
import { MarkToolbarButton } from './mark-toolbar-button';
import { MediaToolbarButton } from './media-toolbar-button';
import { UndoToolbarButton, RedoToolbarButton } from './history-toolbar-button';
import {
  Toolbar,
  ToolbarGroup,
  ToolbarButton,
} from './toolbar';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useEditorPlugin, useSelectionFragmentProp } from 'platejs/react';
import { ParagraphPlugin } from 'platejs/react';

export function FixedToolbar() {
  return (
    <Toolbar className="w-full border-b bg-background px-4 py-2">
      {/* History Actions */}
      <ToolbarGroup>
        <UndoToolbarButton />
        <RedoToolbarButton />
      </ToolbarGroup>

      {/* Block Type (Headings) */}
      <ToolbarGroup>
        <TurnIntoDropdown />
      </ToolbarGroup>

      {/* Text Formatting */}
      <ToolbarGroup>
        <MarkToolbarButton nodeType={BoldPlugin.key} tooltip="Bold (⌘B)">
          <Bold />
        </MarkToolbarButton>
        <MarkToolbarButton nodeType={ItalicPlugin.key} tooltip="Italic (⌘I)">
          <Italic />
        </MarkToolbarButton>
        <MarkToolbarButton
          nodeType={UnderlinePlugin.key}
          tooltip="Underline (⌘U)"
        >
          <Underline />
        </MarkToolbarButton>
        <MarkToolbarButton
          nodeType={StrikethroughPlugin.key}
          tooltip="Strikethrough (⌘⇧X)"
        >
          <Strikethrough />
        </MarkToolbarButton>
        <MarkToolbarButton nodeType={CodePlugin.key} tooltip="Code (⌘E)">
          <Code />
        </MarkToolbarButton>
        <MarkToolbarButton
          nodeType={HighlightPlugin.key}
          tooltip="Highlight (⌘⇧H)"
        >
          <Highlighter />
        </MarkToolbarButton>
      </ToolbarGroup>

      {/* Text Alignment */}
      <ToolbarGroup>
        <AlignToolbarButton />
      </ToolbarGroup>

      {/* Indentation */}
      <ToolbarGroup>
        <IndentToolbarButton />
        <OutdentToolbarButton />
      </ToolbarGroup>

      {/* Insert Elements */}
      <ToolbarGroup>
        <LinkToolbarButton />
        <MediaToolbarButton nodeType={KEYS.img} />
        <MediaToolbarButton nodeType={KEYS.video} />
        <InsertDropdown />
      </ToolbarGroup>
    </Toolbar>
  );
}

// Turn Into Dropdown (for block types)
function TurnIntoDropdown() {
  const { editor } = useEditorPlugin(ParagraphPlugin);

  const value =
    useSelectionFragmentProp({
      defaultValue: ParagraphPlugin.key,
      getProp: (node) => node.type,
    }) ?? ParagraphPlugin.key;

  const [open, setOpen] = React.useState(false);

  const items = [
    {
      icon: Pilcrow,
      label: 'Paragraph',
      value: ParagraphPlugin.key,
    },
    {
      icon: Heading1,
      label: 'Heading 1',
      value: H1Plugin.key,
    },
    {
      icon: Heading2,
      label: 'Heading 2',
      value: H2Plugin.key,
    },
    {
      icon: Heading3,
      label: 'Heading 3',
      value: H3Plugin.key,
    },
    {
      icon: Heading4,
      label: 'Heading 4',
      value: H4Plugin.key,
    },
  ];

  const selectedItem =
    items.find((item) => item.value === value) ?? items[0];
  const SelectedIcon = selectedItem.icon;

  return (
    <DropdownMenu open={open} onOpenChange={setOpen} modal={false}>
      <DropdownMenuTrigger asChild>
        <ToolbarButton pressed={open} tooltip="Turn into" isDropdown>
          <SelectedIcon />
        </ToolbarButton>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="min-w-[180px]" align="start">
        <DropdownMenuRadioGroup
          value={value}
          onValueChange={(type) => {
            editor.tf.setNodes({ type });
            (editor as any).focus();
          }}
        >
          {items.map(({ icon: Icon, label, value: itemValue }) => (
            <DropdownMenuRadioItem key={itemValue} value={itemValue}>
              <Icon className="mr-2 size-4" />
              {label}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// Insert Dropdown (for blockquote, hr, etc.)
function InsertDropdown() {
  const { editor } = useEditorPlugin(ParagraphPlugin);
  const [open, setOpen] = React.useState(false);

  const items = [
    {
      icon: Quote,
      label: 'Blockquote',
      onSelect: () => {
        editor.tf.setNodes({ type: BlockquotePlugin.key });
      },
    },
    {
      icon: Minus,
      label: 'Horizontal Rule',
      onSelect: () => {
        editor.tf.insertNodes({
          type: HorizontalRulePlugin.key,
          children: [{ text: '' }],
        });
      },
    },
  ];

  return (
    <DropdownMenu open={open} onOpenChange={setOpen} modal={false}>
      <DropdownMenuTrigger asChild>
        <ToolbarButton pressed={open} tooltip="Insert" isDropdown>
          <Pilcrow />
        </ToolbarButton>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="min-w-[180px]" align="start">
        {items.map(({ icon: Icon, label, onSelect }) => (
          <DropdownMenuRadioItem
            key={label}
            value={label}
            onSelect={() => {
              onSelect();
              (editor as any).focus();
            }}
          >
            <Icon className="mr-2 size-4" />
            {label}
          </DropdownMenuRadioItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
