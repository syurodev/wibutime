/**
 * Dashboard Create Chapter Page - Reuse from /novels/create
 * Editor để viết chapter mới
 */

"use client";

import { TooltipProvider } from "@/components/ui/tooltip";
import { Plate, usePlateEditor } from "platejs/react";
import * as React from "react";

// Import all feature kits
import { AlignKit } from "@/features/editor/components/plugins/align-kit";
import { BasicBlocksKit } from "@/features/editor/components/plugins/basic-blocks-kit";
import { BasicMarksKit } from "@/features/editor/components/plugins/basic-marks-kit";
import { DndKit } from "@/features/editor/components/plugins/dnd-kit";
import { IndentKit } from "@/features/editor/components/plugins/indent-kit";
import { LinkKit } from "@/features/editor/components/plugins/link-kit";
import { MediaKit } from "@/features/editor/components/plugins/media-kit";
import { SelectionKit } from "@/features/editor/components/plugins/selection-kit";

// Import UI components
import { Button } from "@/components/ui/button";
import { Editor, EditorContainer } from "@/components/ui/editor";
import { FixedToolbar } from "@/components/ui/fixed-toolbar";
import { WordCount } from "@/components/ui/word-count";
import { Link } from "@/i18n/routing";
import { ArrowLeft } from "lucide-react";

// Import hooks
import { Container } from "@/components/layout/Container";
import { useAutosave } from "@/hooks/use-autosave";
import { editorNodeIdConfig } from "@/lib/editor/config";

const INITIAL_VALUE = [
  {
    type: "p",
    children: [{ text: "Start writing your chapter here..." }],
  },
];

interface Props {
  params: Promise<{
    novelId: string;
  }>;
}

export default function CreateChapterPage({ params }: Props) {
  const [novelId, setNovelId] = React.useState<string>("");

  // Unwrap params
  React.useEffect(() => {
    params.then((p) => setNovelId(p.novelId));
  }, [params]);

  const contentId = `chapter-draft-${novelId}-temp`; // TODO: Replace with actual chapter ID

  const { status, lastSaved, save, loadDraft } = useAutosave({
    contentId,
    delay: 2000,
    enableLocalStorage: true,
    // TODO: Add apiEndpoint when API is ready
    // apiEndpoint: `/api/novels/${novelId}/chapters/draft`,
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
    nodeId: editorNodeIdConfig,
  });

  // Auto-save on editor value changes
  React.useEffect(() => {
    if (editor && editor.children) {
      save(editor.children);
    }
  }, [editor, editor.children, save]);

  return (
    <TooltipProvider>
      <div className="flex min-h-screen flex-col bg-background">
        {/* Header with save status */}
        <div className="border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
          <Container
            maxWidth="2xl"
            className=" flex h-14 items-center justify-between px-4"
          >
            <div className="flex items-center gap-3">
              <Button asChild variant="ghost" size="sm">
                <Link href={`/dashboard/novels/${novelId}/volumes`}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Quay lại
                </Link>
              </Button>
              <h1 className="text-lg font-semibold">Viết Chapter</h1>
            </div>
            <SaveIndicator status={status} lastSaved={lastSaved} />
          </Container>
        </div>

        {/* Editor */}
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
              <Container
                maxWidth="2xl"
                className=" flex h-10 items-center justify-end px-4"
              >
                <WordCount />
              </Container>
            </div>
          </div>
        </Plate>
      </div>
    </TooltipProvider>
  );
}

// Save Indicator Component
function SaveIndicator({
  status,
  lastSaved,
}: {
  status: "saved" | "saving" | "unsaved" | "error";
  lastSaved: Date | null;
}) {
  const statusConfig = {
    saved: {
      text: "Saved",
      className: "text-green-600 dark:text-green-500",
    },
    saving: {
      text: "Saving...",
      className: "text-yellow-600 dark:text-yellow-500",
    },
    unsaved: {
      text: "Unsaved changes",
      className: "text-orange-600 dark:text-orange-500",
    },
    error: {
      text: "Save failed",
      className: "text-red-600 dark:text-red-500",
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
    if (!lastSaved) return "";
    const seconds = Math.floor((currentTime - lastSaved.getTime()) / 1000);
    if (seconds < 60) return "just now";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    return `${hours}h ago`;
  }, [lastSaved, currentTime]);

  return (
    <div className="flex items-center gap-2 text-sm">
      <span className={config.className}>{config.text}</span>
      {lastSaved && status === "saved" && (
        <span className="text-muted-foreground">• {timeAgo}</span>
      )}
    </div>
  );
}
