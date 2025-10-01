"use client";

import type { Value } from "platejs";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlateEditor } from "@/components/ui/plate-editor";
import type { PendingImageMap } from "@/lib/editor/types";

const initialValue: Value = [
    {
        id: "1",
        type: "h1",
        children: [{ text: "Welcome to the New Plate Editor!" }],
    },
    {
        id: "2",
        type: "p",
        children: [
            { text: "This is a demo of the new Plate.js editor with " },
            { text: "bold", bold: true },
            { text: ", " },
            { text: "italic", italic: true },
            { text: ", and " },
            { text: "underline", underline: true },
            { text: " formatting." },
        ],
    },
    {
        id: "3",
        type: "blockquote",
        children: [{ text: "You can also create blockquotes like this." }],
    },
    {
        id: "4",
        type: "p",
        children: [
            {
                text: "Try uploading images, drag & drop to reorder blocks, and see the pending upload feature in action!",
            },
        ],
    },
];

export default function EditorPage() {
    const [value, setValue] = useState<Value>(initialValue);
    const [pendingImages, setPendingImages] = useState<PendingImageMap>({});
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            // In a real app, you would save to your backend here
            console.log("Saving content:", value);
            console.log("Pending images:", pendingImages);

            // Simulate save delay
            await new Promise((resolve) => setTimeout(resolve, 1000));

            alert("Content saved successfully!");
        } catch (error) {
            console.error("Save failed:", error);
            alert("Save failed!");
        } finally {
            setIsSaving(false);
        }
    };

    const hasPendingImages = Object.keys(pendingImages).length > 0;

    return (
        <div className="container mx-auto py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold">Editor Demo</h1>
                <p className="text-muted-foreground mt-2">
                    Test the new Plate.js editor with Presigned URL + Cloudflare
                    R2 integration
                </p>
                <div className="mt-2 text-sm text-blue-600">
                    📡 Upload workflow: Client → Server Action (mock presigned)
                    → Direct R2 upload
                </div>
            </div>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Rich Text Editor</CardTitle>
                    <div className="flex items-center gap-2">
                        {hasPendingImages && (
                            <span className="text-sm text-yellow-600">
                                {Object.keys(pendingImages).length} ảnh chờ
                                upload
                            </span>
                        )}
                        <Button
                            onClick={handleSave}
                            disabled={isSaving}
                            variant={hasPendingImages ? "default" : "secondary"}
                        >
                            {isSaving ? "Đang lưu..." : "Lưu"}
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <PlateEditor
                        initialValue={value}
                        onChange={setValue}
                        onPendingImagesChange={setPendingImages}
                        placeholder="Bắt đầu viết nội dung..."
                    />
                </CardContent>
            </Card>

            {/* Debug info */}
            <Card className="mt-8">
                <CardHeader>
                    <CardTitle>Debug Info</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div>
                            <h4 className="font-medium">Current Value:</h4>
                            <pre className="mt-2 bg-muted p-4 rounded text-xs overflow-auto max-h-40">
                                {JSON.stringify(value, null, 2)}
                            </pre>
                        </div>
                        <div>
                            <h4 className="font-medium">Pending Images:</h4>
                            <pre className="mt-2 bg-muted p-4 rounded text-xs overflow-auto max-h-40">
                                {JSON.stringify(
                                    Object.entries(pendingImages).reduce(
                                        (acc, [key, entry]) => {
                                            acc[key] = {
                                                name: entry.name,
                                                size: entry.size,
                                                type: entry.type,
                                                previewUrl:
                                                    entry.previewUrl.substring(
                                                        0,
                                                        50,
                                                    ) + "...",
                                            };
                                            return acc;
                                        },
                                        {} as any,
                                    ),
                                    null,
                                    2,
                                )}
                            </pre>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
