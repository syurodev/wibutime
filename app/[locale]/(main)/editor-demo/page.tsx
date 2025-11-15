'use client';

import * as React from 'react';
import { Plate, usePlateEditor } from 'platejs/react';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Separator } from '@/components/ui/separator';
import { MessageSquarePlus, FileEdit } from 'lucide-react';

// Import all feature kits
import { BasicBlocksKit } from '@/components/editor/plugins/basic-blocks-kit';
import { BasicMarksKit } from '@/components/editor/plugins/basic-marks-kit';
import { LinkKit } from '@/components/editor/plugins/link-kit';
import { MediaKit } from '@/components/editor/plugins/media-kit';
import { AlignKit } from '@/components/editor/plugins/align-kit';
import { IndentKit } from '@/components/editor/plugins/indent-kit';
import { SelectionKit } from '@/components/editor/plugins/selection-kit';
import { DndKit } from '@/components/editor/plugins/dnd-kit';

// Import UI components
import { Editor, EditorContainer } from '@/components/ui/editor';
import { FixedToolbar } from '@/components/ui/fixed-toolbar';
import { WordCount } from '@/components/ui/word-count';
import { NavCommentTrigger } from '@/components/layout/nav/NavCommentTrigger';

// Import hooks
import { useAutosave } from '@/hooks/use-autosave';
import { EditorDemoNavigation } from './EditorDemoNavigation';
import { ContentCard } from '@/components/content/ContentCard';
import { getMockMediaSeries } from '@/lib/api/mock/mock-base-content';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { HeroSection } from '@/components/home/HeroSection';

const INITIAL_VALUE = [
  {
    id: '1',
    type: 'h1',
    children: [{ text: 'Welcome to Editor Demo' }],
  },
  {
    id: '2',
    type: 'p',
    children: [
      { text: 'This page demonstrates both editors in the WibuTime system:' },
    ],
  },
  {
    id: '3',
    type: 'p',
    children: [
      { text: '1. ', bold: true },
      { text: 'Full Novel Editor', bold: true, italic: true },
      { text: ' - Complete rich text editor with all formatting options (shown below)' },
    ],
  },
  {
    id: '4',
    type: 'p',
    children: [
      { text: '2. ', bold: true },
      { text: 'Compact Comment Editor', bold: true, italic: true },
      { text: ' - Minimal editor integrated into navigation (click the button at bottom-right)' },
    ],
  },
  {
    id: '5',
    type: 'h2',
    children: [{ text: 'Try the editors below!' }],
  },
  {
    id: '6',
    type: 'p',
    children: [
      { text: 'Full Novel Editor features:' },
    ],
  },
  {
    id: '7',
    type: 'p',
    children: [
      { text: '• Text formatting: ' },
      { text: 'Bold', bold: true },
      { text: ', ' },
      { text: 'Italic', italic: true },
      { text: ', ' },
      { text: 'Underline', underline: true },
      { text: ', ' },
      { text: 'Strikethrough', strikethrough: true },
      { text: ', ' },
      { text: 'Code', code: true },
      { text: ', ' },
      { text: 'Highlight', highlight: true },
    ],
  },
  {
    id: '8',
    type: 'p',
    children: [{ text: '• Headings (H1-H4) with keyboard shortcuts (⌘⌥1-4)' }],
  },
  {
    id: '9',
    type: 'p',
    children: [{ text: '• Text alignment (left, center, right, justify)' }],
  },
  {
    id: '10',
    type: 'p',
    children: [{ text: '• Links, Images, Videos with resize and captions' }],
  },
  {
    id: '11',
    type: 'p',
    children: [{ text: '• Blockquotes and horizontal rules' }],
  },
  {
    id: '12',
    type: 'p',
    children: [{ text: '• Drag & drop blocks and files' }],
  },
  {
    id: '13',
    type: 'p',
    children: [{ text: '• Undo/Redo (⌘Z / ⌘⇧Z)' }],
  },
  {
    id: '14',
    type: 'p',
    children: [{ text: '• Real-time word count' }],
  },
  {
    id: '15',
    type: 'p',
    children: [{ text: '• Auto-save with localStorage backup' }],
  },
  {
    id: '16',
    type: 'blockquote',
    children: [
      { text: 'Start writing your novel here... All changes are auto-saved!' },
    ],
  },
];

export default function EditorDemoPage() {
  const contentId = 'editor-demo-full';

  // Generate mock series for testing
  const mockSeries = React.useMemo(() => getMockMediaSeries(10), []);
  const featuredSeries = React.useMemo(() => getMockMediaSeries(5), []);

  const { status, lastSaved, save, loadDraft } = useAutosave({
    contentId,
    delay: 2000,
    enableLocalStorage: true,
  });

  // Load draft on mount
  const initialValue = React.useMemo(() => {
    const draft = loadDraft();
    return draft || INITIAL_VALUE;
  }, [loadDraft]);

  const editor = usePlateEditor({
    plugins: [
      ...BasicBlocksKit,
      ...BasicMarksKit,
      ...LinkKit,
      ...MediaKit,
      ...AlignKit,
      ...IndentKit,
      ...SelectionKit,
      ...DndKit,
    ],
    value: initialValue,
  });

  // Auto-save on editor value changes
  React.useEffect(() => {
    if (editor && editor.children) {
      save(editor.children);
    }
  }, [editor, editor.children, save]);

  return (
    <TooltipProvider>
      <EditorDemoNavigation />

      {/* Test: HeroSection */}
      <HeroSection featuredList={featuredSeries} />

      <div className="flex min-h-screen flex-col bg-background">
        {/* Header */}
        <div className="border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
          <div className="container flex h-16 items-center justify-between px-4">
            <div className="flex items-center gap-3">
              <FileEdit className="size-6" />
              <div>
                <h1 className="text-lg font-semibold">Editor Demo</h1>
                <p className="text-xs text-muted-foreground">
                  Full Novel Editor & Compact Comment Editor
                </p>
              </div>
            </div>
            <SaveIndicator status={status} lastSaved={lastSaved} />
          </div>
        </div>

        {/* Test: ContentCards Grid */}
        <div className="container px-4 pt-6">
          <div className="mb-6">
            <h2 className="mb-4 text-xl font-semibold">Test: Mock Content Cards</h2>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {mockSeries.map((item) => (
                <AspectRatio key={item.id} ratio={3 / 5} className="w-full">
                  <ContentCard
                    series={item}
                    showDescription={true}
                    className="h-full"
                    showContentType={true}
                  />
                </AspectRatio>
              ))}
            </div>
          </div>
        </div>

        {/* Instructions Card */}
        <div className="container px-4 pt-6">
          <div className="rounded-lg border bg-card p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold">How to use this demo</h2>

            <div className="space-y-4">
              {/* Full Editor Section */}
              <div className="flex gap-4">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                  <FileEdit className="size-5 text-primary" />
                </div>
                <div className="flex-1 space-y-2">
                  <h3 className="font-semibold">Full Novel Editor (below)</h3>
                  <p className="text-sm text-muted-foreground">
                    Complete rich text editor with toolbar, word count, and auto-save.
                    Perfect for writing novels, articles, or long-form content.
                  </p>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• Use the toolbar above the editor for formatting</li>
                    <li>• All changes are auto-saved to localStorage</li>
                    <li>• Word count updates in real-time at the bottom</li>
                  </ul>
                </div>
              </div>

              <Separator />

              {/* Nav Comment Editor Section */}
              <div className="flex gap-4">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-green-500/10">
                  <MessageSquarePlus className="size-5 text-green-600 dark:text-green-500" />
                </div>
                <div className="flex-1 space-y-2">
                  <h3 className="font-semibold">Compact Comment Editor (in Navigation)</h3>
                  <p className="text-sm text-muted-foreground">
                    Minimal editor that appears in the navigation bar. Perfect for quick comments,
                    notes, or feedback.
                  </p>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• Click the <MessageSquarePlus className="mx-1 inline size-3.5" /> button at bottom-right</li>
                    <li>• Navigation expands to show comment editor</li>
                    <li>• Only Bold, Italic, Underline formatting available</li>
                    <li>• Press ⌘Enter to submit, Escape to cancel</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Full Editor */}
        <div className="flex flex-1 flex-col">
          <Plate editor={editor}>
            <div className="flex flex-1 flex-col">
              {/* Fixed Toolbar */}
              <FixedToolbar />

              {/* Editor Content */}
              <div className="flex-1">
                <EditorContainer variant="default">
                  <Editor variant="default" placeholder="Start writing..." />
                </EditorContainer>
              </div>

              {/* Footer with Word Count */}
              <div className="border-t bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
                <div className="container flex h-10 items-center justify-end px-4">
                  <WordCount />
                </div>
              </div>
            </div>
          </Plate>
        </div>

        {/* Floating Comment Trigger Button */}
        <div className="fixed bottom-20 right-6 z-40">
          <NavCommentTrigger
            size="lg"
            variant="default"
            className="shadow-lg"
          />
        </div>
      </div>
    </TooltipProvider>
  );
}

// Save Indicator Component
function SaveIndicator({
  status,
  lastSaved,
}: {
  status: 'saved' | 'saving' | 'unsaved' | 'error';
  lastSaved: Date | null;
}) {
  const statusConfig = {
    saved: {
      text: 'Saved',
      className: 'text-green-600 dark:text-green-500',
    },
    saving: {
      text: 'Saving...',
      className: 'text-yellow-600 dark:text-yellow-500',
    },
    unsaved: {
      text: 'Unsaved changes',
      className: 'text-orange-600 dark:text-orange-500',
    },
    error: {
      text: 'Save failed',
      className: 'text-red-600 dark:text-red-500',
    },
  };

  const config = statusConfig[status];

  const [currentTime, setCurrentTime] = React.useState(() => Date.now());

  // Update current time every 30 seconds for time ago calculation
  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const timeAgo = React.useMemo(() => {
    if (!lastSaved) return '';
    const seconds = Math.floor((currentTime - lastSaved.getTime()) / 1000);
    if (seconds < 60) return 'just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    return `${hours}h ago`;
  }, [lastSaved, currentTime]);

  return (
    <div className="flex items-center gap-2 text-sm">
      <span className={config.className}>{config.text}</span>
      {lastSaved && status === 'saved' && (
        <span className="text-muted-foreground">• {timeAgo}</span>
      )}
    </div>
  );
}
