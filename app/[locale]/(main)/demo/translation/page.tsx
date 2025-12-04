"use client";

import { TranslationEditor } from "@/components/ui/translation-editor";
import { useEffect, useState } from "react";

interface ChapterData {
  id: string;
  content: any;
  source_language?: string;
  title: string;
}

export default function TranslationDemoPage() {
  const [chapterData, setChapterData] = useState<ChapterData | null>(null);
  const [translationValue, setTranslationValue] = useState<any>([]);
  const [targetLanguage, setTargetLanguage] = useState("vi");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const CHAPTER_ID = "019adffc-d5d1-76a6-8d95-fbab851978ed";

  useEffect(() => {
    const fetchChapter = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/api/v1/novels/chapters/${CHAPTER_ID}`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        if (result.success && result.data) {
          setChapterData(result.data);
        } else {
          throw new Error("Invalid response format");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load chapter");
      } finally {
        setLoading(false);
      }
    };

    fetchChapter();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">Loading chapter data...</div>
      </div>
    );
  }

  if (error || !chapterData) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center text-destructive">
          Error: {error || "Chapter not found"}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Translation Editor Demo</h1>
        <p className="text-muted-foreground mb-2">
          Translating: <span className="font-medium">{chapterData.title}</span>
        </p>
        <p className="text-sm text-muted-foreground">
          ID: {chapterData.id} | Source Language:{" "}
          {chapterData.source_language?.toUpperCase() || "Unknown"}
        </p>
      </div>

      <TranslationEditor
        sourceValue={chapterData.content}
        translationValue={translationValue}
        onTranslationChange={setTranslationValue}
        sourceLanguage={chapterData.source_language || "en"}
        targetLanguage={targetLanguage}
        onTargetLanguageChange={setTargetLanguage}
        contentId={`chapter-${chapterData.id}`}
      />

      {/* Debug info */}
      <div className="mt-8 p-4 border rounded-md bg-muted/50">
        <h3 className="font-semibold mb-2">Debug Info</h3>
        <div className="text-sm text-muted-foreground">
          <p>Source nodes: {chapterData.content?.length || 0}</p>
          <p>Translation nodes: {translationValue.length}</p>
          <p>Target Language: {targetLanguage}</p>
        </div>
      </div>
    </div>
  );
}
