'use client';

import {
  BoldPlugin,
  ItalicPlugin,
  UnderlinePlugin,
  StrikethroughPlugin,
  CodePlugin,
  HighlightPlugin,
  H1Plugin,
  H2Plugin,
  H3Plugin,
  H4Plugin,
} from '@platejs/basic-nodes/react';
import { PlateView, usePlateViewEditor, ParagraphPlugin } from 'platejs/react';
import type { TNode } from 'platejs';

import { ParagraphElement } from '@/components/ui/paragraph-node';
import { HeadingElement } from '@/components/ui/heading-node';
import { cn } from '@/lib/utils';

/**
 * Plugins for interactive view editor
 */
const VIEW_PLUGINS = [
  ParagraphPlugin.withComponent(ParagraphElement),
  H1Plugin.withComponent(HeadingElement),
  H2Plugin.withComponent(HeadingElement),
  H3Plugin.withComponent(HeadingElement),
  H4Plugin.withComponent(HeadingElement),
  BoldPlugin,
  ItalicPlugin,
  UnderlinePlugin,
  StrikethroughPlugin,
  CodePlugin,
  HighlightPlugin,
];

export interface InteractiveEditorViewProps {
  /**
   * Content to display (TNode array from Plate editor)
   */
  content: TNode[];

  /**
   * Additional className for styling
   */
  className?: string;

  /**
   * Container variant
   * @default "default"
   */
  variant?: 'default' | 'compact' | 'fullWidth';
}

/**
 * InteractiveEditorView Component (Client-Side)
 *
 * Renders Plate editor content with minimal interactivity using PlateView.
 * **Requires client-side JavaScript** - use when you need:
 * - Text selection and copying
 * - Interactive tooltips or popovers
 * - Comment highlights
 * - User interaction tracking
 *
 * For pure static rendering without interactions, use StaticEditorView instead.
 *
 * @example
 * ```tsx
 * 'use client';
 * import { InteractiveEditorView } from '@/components/editor/interactive-editor-view';
 *
 * export function NovelReader({ content }) {
 *   return <InteractiveEditorView content={content} />;
 * }
 * ```
 */
export function InteractiveEditorView({
  content,
  className,
  variant = 'default',
}: InteractiveEditorViewProps) {
  // Create client-side view editor with usePlateViewEditor
  const editor = usePlateViewEditor({
    plugins: VIEW_PLUGINS,
    value: content,
  });

  // Get variant-specific classes
  const getVariantClasses = () => {
    switch (variant) {
      case 'compact':
        return 'px-4 py-2 text-sm';
      case 'fullWidth':
        return 'px-8 py-4';
      default:
        return 'px-16 py-4 sm:px-[max(64px,calc(50%-350px))]';
    }
  };

  return (
    <PlateView
      editor={editor}
      className={cn(
        'relative w-full',
        'border-none bg-transparent',
        getVariantClasses(),
        // Heading styles
        '[&_h1]:text-3xl [&_h1]:font-bold [&_h1]:mb-4 [&_h1]:mt-8',
        '[&_h2]:text-2xl [&_h2]:font-bold [&_h2]:mb-3 [&_h2]:mt-6',
        '[&_h3]:text-xl [&_h3]:font-bold [&_h3]:mb-2 [&_h3]:mt-4',
        '[&_h4]:text-lg [&_h4]:font-semibold [&_h4]:mb-2 [&_h4]:mt-3',
        // Paragraph styles
        '[&_p]:mb-3 [&_p]:leading-relaxed',
        // Text formatting
        '[&_strong]:font-bold',
        '[&_em]:italic',
        '[&_u]:underline',
        '[&_code]:rounded [&_code]:bg-muted [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:text-sm [&_code]:font-mono',
        // Interactive styles
        '[&_*]:select-text',
        'cursor-text',
        className
      )}
    />
  );
}
