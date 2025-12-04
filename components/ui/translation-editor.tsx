"use client";

import { Plate, usePlateEditor } from "platejs/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Transforms } from "slate"; // Added Transforms import

import { Button } from "@/components/ui/button";
import { Editor, EditorContainer } from "@/components/ui/editor";
import { FULL_EDITOR_PLUGINS } from "@/components/ui/full-editor";
import { LanguageSelect } from "@/components/ui/language-select";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { TranslationTransferButton } from "@/components/ui/translation-transfer-button";
import { useTranslationSync } from "@/hooks/use-translation-sync";
import { useTranslationTracker } from "@/hooks/use-translation-tracker";
import { editorNodeIdConfig } from "@/lib/editor/config";
import { ArrowLeftRight, RotateCcw } from "lucide-react";
import type { TElement } from "platejs";

interface TranslationEditorProps {
  readonly sourceValue: any; // Nội dung gốc (read-only)
  readonly translationValue?: any; // Nội dung đã dịch
  readonly onTranslationChange: (value: any) => void;
  readonly sourceLanguage?: string; // Ví dụ: "en", "zh"
  readonly targetLanguage?: string; // Ví dụ: "vi"
  readonly onTargetLanguageChange?: (language: string) => void; // Callback khi đổi ngôn ngữ
  readonly novelId?: string;
  readonly contentId?: string; // Để tạo unique storage key
}

export function TranslationEditor({
  sourceValue,
  translationValue,
  onTranslationChange,
  sourceLanguage = "en",
  targetLanguage = "vi",
  onTargetLanguageChange,
  novelId,
  contentId,
}: TranslationEditorProps) {
  // State management
  const [scrollSyncEnabled, setScrollSyncEnabled] = useState(true);
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);

  // Floating button state
  const [floatingPos, setFloatingPos] = useState<{
    top: number;
    left: number;
  } | null>(null);
  const [showFloating, setShowFloating] = useState(false);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const translationContainerRef = useRef<HTMLDivElement>(null);

  // Refs cho scroll containers
  const sourceContainerRef = useRef<HTMLDivElement>(null);

  // Normalize source value
  const normalizedSourceValue = useMemo(() => {
    return sourceValue && sourceValue.length > 0
      ? sourceValue
      : [{ type: "p", children: [{ text: "" }] }];
  }, [sourceValue]);

  // Count total nodes in source
  const totalSourceNodes = useMemo(() => {
    return normalizedSourceValue.length;
  }, [normalizedSourceValue]);

  // Translation tracker
  const storageKey = contentId
    ? `translation-progress-${contentId}`
    : undefined;

  const {
    markAsTranslated,
    getProgress,
    isTranslated,
    reset: resetProgress,
  } = useTranslationTracker({
    totalNodes: totalSourceNodes,
    storageKey,
  });

  // Scroll sync hook
  useTranslationSync({
    sourceRef: sourceContainerRef as React.RefObject<HTMLElement>,
    translationRef: translationContainerRef as React.RefObject<HTMLElement>,
    enabled: scrollSyncEnabled,
  });

  // Create editors
  const sourceEditor = usePlateEditor({
    plugins: FULL_EDITOR_PLUGINS,
    value: normalizedSourceValue,
    nodeId: editorNodeIdConfig,
  });

  const translationEditor = usePlateEditor({
    plugins: FULL_EDITOR_PLUGINS,
    value:
      translationValue && translationValue.length > 0
        ? translationValue
        : [
            {
              type: "p",
              id: normalizedSourceValue[0]?.id,
              children: [{ text: "" }],
            },
          ],
    nodeId: editorNodeIdConfig,
  });

  // Get node ID by index
  const getNodeIdByIndex = useCallback(
    (index: number): string | null => {
      const node = normalizedSourceValue[index] as TElement;
      return (node?.id as string) || null;
    },
    [normalizedSourceValue]
  );

  // Get last translated node index
  const getLastTranslatedNodeIndex = useCallback((): number => {
    for (let i = normalizedSourceValue.length - 1; i >= 0; i--) {
      const nodeId = getNodeIdByIndex(i);
      if (nodeId && isTranslated(nodeId)) {
        return i;
      }
    }
    return -1; // Chưa có node nào được dịch
  }, [normalizedSourceValue, getNodeIdByIndex, isTranslated]);

  // Transfer node from source to translation
  const handleTransferNode = useCallback(
    (sourceNodeId: string, targetIndex?: number) => {
      const sourceNode = normalizedSourceValue.find(
        (node: TElement) => node.id === sourceNodeId
      );

      if (!sourceNode) return;

      if (
        typeof targetIndex === "number" &&
        targetIndex >= 0 &&
        targetIndex < translationEditor.children.length
      ) {
        // Replace existing node at targetIndex
        const targetNode = translationEditor.children[targetIndex];
        const path = [targetIndex];

        // Remove existing node and insert new one with same ID to preserve identity if needed
        // Or just replace content.
        // Using removeNodes + insertNodes is reliable.

        Transforms.removeNodes(translationEditor, { at: path });
        Transforms.insertNodes(
          translationEditor,
          {
            ...sourceNode,
            id: targetNode.id, // Keep existing ID
          },
          { at: path }
        );

        // Restore selection/focus if needed
        Transforms.select(translationEditor, {
          anchor: { path: [targetIndex, 0], offset: 0 },
          focus: { path: [targetIndex, 0], offset: 0 },
        });
      } else {
        // Append new node
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { id, ...nodeWithoutId } = sourceNode;

        Transforms.insertNodes(
          translationEditor,
          {
            ...nodeWithoutId,
          },
          { at: [translationEditor.children.length] }
        );
      }

      // Mark as translated
      markAsTranslated(sourceNodeId);
    },
    [normalizedSourceValue, translationEditor, markAsTranslated]
  );

  const progress = getProgress();

  const updateFocusedIndex = useCallback(() => {
    // Use setTimeout to ensure selection is updated after event
    setTimeout(() => {
      const selection = translationEditor.selection;
      if (selection && selection.anchor.path.length > 0) {
        const index = selection.anchor.path[0];
        setFocusedIndex(index);
      } else {
        setFocusedIndex(null);
      }
    }, 0);
  }, [translationEditor]);

  // Calculate floating button position
  const updateFloatingPosition = useCallback(() => {
    if (!translationContainerRef.current) return;

    const domSelection = window.getSelection();
    if (!domSelection || domSelection.rangeCount === 0) return;

    const range = domSelection.getRangeAt(0);
    const rect = range.getBoundingClientRect();
    const containerRect =
      translationContainerRef.current.getBoundingClientRect();

    // Check if selection is inside translation editor
    if (!translationContainerRef.current.contains(domSelection.anchorNode))
      return;

    // Calculate relative position (above cursor)
    const top = rect.top - containerRect.top - 40;
    const left = rect.left - containerRect.left;

    console.log("[FloatingButton] Position calculated:", { top, left });
    setFloatingPos({ top, left });
  }, []);

  // Handle typing/interaction to show/hide floating button
  const handleFloatingTrigger = useCallback(
    (immediate = false) => {
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      setShowFloating(false);
      console.log("[FloatingButton] Trigger:", { immediate });

      if (immediate) {
        // Show immediately (e.g. after Enter)
        setTimeout(() => {
          updateFloatingPosition();
          setShowFloating(true);
        }, 100);
      } else {
        // Debounce 2s
        typingTimeoutRef.current = setTimeout(() => {
          updateFloatingPosition();
          setShowFloating(true);
        }, 2000);
      }
    },
    [updateFloatingPosition]
  );

  // Sync focus to source highlight
  useEffect(() => {
    // updateButtonPosition(); // Removed old fixed button position update

    if (!sourceContainerRef.current) return;

    const editorEl = sourceContainerRef.current.querySelector(
      '[data-slate-editor="true"]'
    );
    if (!editorEl) {
      return;
    }

    const sourceNodes = Array.from(editorEl.children);

    // Simple index mapping
    const targetSourceIndex = focusedIndex;

    sourceNodes.forEach((node, index) => {
      if (!(node instanceof HTMLElement)) return;

      if (index === targetSourceIndex) {
        node.classList.add("translation-source-highlight");
      } else {
        node.classList.remove("translation-source-highlight");
      }
    });
  }, [focusedIndex]); // Removed updateButtonPosition from dependencies

  return (
    <div className="w-full border rounded-md bg-background overflow-hidden flex flex-col h-[1000px] max-h-dvh">
      {/* Toolbar */}
      <div className="flex items-center justify-between border-b bg-background px-4 py-2">
        <div className="flex items-center gap-4">
          <div className="text-sm font-medium">Translation Editor</div>

          {/* Language Selector */}
          {onTargetLanguageChange && (
            <div className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">Target:</span>
              <LanguageSelect
                value={targetLanguage}
                onValueChange={onTargetLanguageChange}
                excludeLanguages={[sourceLanguage]}
                className="h-8 w-[180px]"
                showFlags={true}
              />
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant={scrollSyncEnabled ? "default" : "outline"}
            size="sm"
            onClick={() => setScrollSyncEnabled(!scrollSyncEnabled)}
            title={scrollSyncEnabled ? "Tắt đồng bộ cuộn" : "Bật đồng bộ cuộn"}
          >
            <ArrowLeftRight className="h-4 w-4 mr-2" />
            Sync Scroll
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={resetProgress}
            title="Reset translation progress"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset
          </Button>
        </div>
      </div>

      {/* Main content - 2 cột resizable */}
      <ResizablePanelGroup
        direction="horizontal"
        className="flex-1"
        autoSaveId={contentId ? `translation-layout-${contentId}` : undefined}
      >
        {/* Source Panel (Read-only) */}
        <ResizablePanel defaultSize={45} minSize={30}>
          <div className="h-full flex flex-col bg-muted/20">
            <div className="px-4 py-2 border-b bg-muted/50 text-sm font-medium">
              Source ({sourceLanguage.toUpperCase()})
            </div>
            <Plate editor={sourceEditor}>
              <EditorContainer
                ref={sourceContainerRef}
                className="flex-1 overflow-y-auto"
              >
                <Editor
                  placeholder="Source content..."
                  variant="fullWidth"
                  readOnly={true}
                  className="flex-1 focus-visible:ring-0 min-h-[300px] px-8 py-4 !opacity-100 cursor-default source-editor-content"
                />

                {/* Removed old fixed Copy Button positioned relative to highlighted node */}
              </EditorContainer>
            </Plate>
          </div>
        </ResizablePanel>

        {/* Resizable Handle */}
        <ResizableHandle
          withHandle
          className="relative group overflow-visible"
        />

        {/* Translation Panel (Editable) */}
        <ResizablePanel defaultSize={55} minSize={30}>
          <div className="h-full flex flex-col">
            <div className="px-4 py-2 border-b bg-background text-sm font-medium">
              Translation ({targetLanguage.toUpperCase()})
            </div>
            <Plate
              editor={translationEditor}
              onValueChange={({ value }) => {
                const normalizedValue =
                  !value || value.length === 0
                    ? [{ type: "p", children: [{ text: "" }] }]
                    : value;

                onTranslationChange(normalizedValue);
                updateFocusedIndex();
                handleFloatingTrigger(false); // Debounce trigger on change
              }}
            >
              <EditorContainer
                ref={translationContainerRef}
                variant="default"
                className="flex-1 overflow-y-auto relative"
              >
                <Editor
                  placeholder="Enter translation..."
                  variant="fullWidth"
                  disabled={false}
                  className="flex-1 focus-visible:ring-0 min-h-[300px] px-8 py-4"
                  onFocus={updateFocusedIndex}
                  onClick={() => {
                    updateFocusedIndex();
                    handleFloatingTrigger(true); // Show immediately on click? Or wait? Let's show immediately if idle
                  }}
                  onKeyUp={updateFocusedIndex}
                  onSelect={updateFocusedIndex}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleFloatingTrigger(true);
                    } else {
                      handleFloatingTrigger(false);
                    }
                  }}
                />

                {/* Floating Copy Button */}
                {showFloating &&
                  floatingPos &&
                  focusedIndex !== null &&
                  (() => {
                    console.log("[FloatingButton] Rendering", {
                      floatingPos,
                      focusedIndex,
                    });
                    // Determine source node to copy
                    let targetIndex = focusedIndex;
                    // Fallback logic if needed, but focusedIndex is safest

                    if (
                      targetIndex < 0 ||
                      targetIndex >= normalizedSourceValue.length
                    )
                      return null;

                    const targetNode = normalizedSourceValue[
                      targetIndex
                    ] as TElement;
                    const nodeId = targetNode.id as string;
                    if (!nodeId) return null;

                    return (
                      <div
                        className="absolute z-50 animate-in fade-in zoom-in duration-200"
                        style={{
                          top: `${floatingPos.top}px`,
                          left: `${floatingPos.left}px`,
                        }}
                      >
                        <TranslationTransferButton
                          sourceNodeId={nodeId}
                          canTransfer={true}
                          isTranslated={false}
                          onTransfer={() => {
                            handleTransferNode(nodeId, focusedIndex);
                            setShowFloating(false); // Hide after copy
                          }}
                          reason="Copy source content"
                        />
                      </div>
                    );
                  })()}
              </EditorContainer>
            </Plate>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>

      {/* Stats Footer */}
      <div className="border-t bg-background/95 p-2 px-4 flex justify-between items-center">
        <div className="text-sm text-muted-foreground">
          <span className="font-medium">{progress.translated}</span> /{" "}
          {progress.total} nodes translated ({progress.percentage}%)
        </div>
        <div className="text-sm text-muted-foreground">
          Translation Progress
        </div>
      </div>
    </div>
  );
}
