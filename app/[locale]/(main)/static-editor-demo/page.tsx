"use client";

import {
  CompactEditorView,
  countWords,
  estimateReadingTime,
  getPreviewText,
  StaticEditorView,
} from "@/components/editor/static-editor-view";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getRandomNovelContent } from "@/lib/api/mock/mock-editor";

export default function StaticEditorDemoPage() {
  return (
    <div className="container mx-auto max-w-6xl space-y-8 py-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold">Static Editor View Demo</h1>
        <p className="text-muted-foreground">
          Component để hiển thị nội dung editor ở chế độ readonly (chỉ đọc)
        </p>
      </div>

      <Separator />

      {/* Use Cases */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>📖 Full Novel View</CardTitle>
            <CardDescription>
              Hiển thị chapter đầy đủ với formatting
            </CardDescription>
          </CardHeader>
          <CardContent className="max-h-[400px] overflow-y-auto">
            <StaticEditorView content={getRandomNovelContent()} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>💬 Comment Display</CardTitle>
            <CardDescription>Hiển thị comments từ người đọc</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg border bg-muted/50 p-3">
              <div className="mb-2 flex items-center gap-2">
                <div className="size-8 rounded-full bg-primary" />
                <div>
                  <p className="text-sm font-medium">Nguyễn Văn A</p>
                  <p className="text-xs text-muted-foreground">2 giờ trước</p>
                </div>
              </div>
              <StaticEditorView
                content={getRandomNovelContent()}
                variant="compact"
              />
            </div>

            <div className="rounded-lg border bg-muted/50 p-3">
              <div className="mb-2 flex items-center gap-2">
                <div className="size-8 rounded-full bg-secondary" />
                <div>
                  <p className="text-sm font-medium">Trần Thị B</p>
                  <p className="text-xs text-muted-foreground">5 giờ trước</p>
                </div>
              </div>
              <StaticEditorView
                content={getRandomNovelContent()}
                variant="compact"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Compact Preview Card */}
      <Card>
        <CardHeader>
          <CardTitle>🎴 Compact Preview (for cards)</CardTitle>
          <CardDescription>
            Preview ngắn gọn với gradient fade, dùng cho danh sách chapters
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="overflow-hidden">
              <CardHeader>
                <CardTitle className="text-base">Chương 1: Triệu Hồi</CardTitle>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">
                    {countWords(getRandomNovelContent())} từ
                  </Badge>
                  <Badge variant="outline">
                    ~{estimateReadingTime(getRandomNovelContent())} phút
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <CompactEditorView
                  content={getRandomNovelContent()}
                  maxLines={3}
                />
              </CardContent>
            </Card>

            <Card className="overflow-hidden">
              <CardHeader>
                <CardTitle className="text-base">
                  Chương 15: Quyết Chiến
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">
                    {countWords(getRandomNovelContent())} từ
                  </Badge>
                  <Badge variant="outline">
                    ~{estimateReadingTime(getRandomNovelContent())} phút
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <CompactEditorView
                  content={getRandomNovelContent()}
                  maxLines={3}
                />
              </CardContent>
            </Card>

            <Card className="overflow-hidden">
              <CardHeader>
                <CardTitle className="text-base">
                  Chương 7: Cuộc Đối Thoại
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">
                    {countWords(getRandomNovelContent())} từ
                  </Badge>
                  <Badge variant="outline">
                    ~{estimateReadingTime(getRandomNovelContent())} phút
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <CompactEditorView
                  content={getRandomNovelContent()}
                  maxLines={3}
                />
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* Full Width View */}
      <Card>
        <CardHeader>
          <CardTitle>📄 Full Width Novel View</CardTitle>
          <CardDescription>
            Hiển thị toàn bộ nội dung với width rộng, phù hợp cho trang đọc
            chuyên dụng
          </CardDescription>
        </CardHeader>
        <CardContent className="max-h-[500px] overflow-y-auto">
          <StaticEditorView
            content={getRandomNovelContent()}
            variant="fullWidth"
          />
        </CardContent>
      </Card>

      {/* Helper Functions Demo */}
      <Card>
        <CardHeader>
          <CardTitle>🛠️ Helper Functions</CardTitle>
          <CardDescription>
            Các hàm tiện ích để xử lý editor content
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="mb-2 font-semibold">extractPlainText()</h4>
            <p className="mb-2 text-sm text-muted-foreground">
              Trích xuất text thuần từ editor content (cho SEO, search)
            </p>
            <div className="rounded-lg bg-muted p-3 text-sm">
              <code className="break-all">
                {getPreviewText(getRandomNovelContent(), 200)}
              </code>
            </div>
          </div>

          <Separator />

          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <h4 className="mb-2 font-semibold">countWords()</h4>
              <p className="text-2xl font-bold text-primary">
                {countWords(getRandomNovelContent())}
              </p>
              <p className="text-sm text-muted-foreground">
                từ trong getRandomNovelContent()
              </p>
            </div>

            <div>
              <h4 className="mb-2 font-semibold">estimateReadingTime()</h4>
              <p className="text-2xl font-bold text-primary">
                {estimateReadingTime(getRandomNovelContent())}
              </p>
              <p className="text-sm text-muted-foreground">
                phút đọc getRandomNovelContent()
              </p>
            </div>

            <div>
              <h4 className="mb-2 font-semibold">getPreviewText()</h4>
              <p className="text-sm">
                {getPreviewText(getRandomNovelContent(), 50)}
              </p>
              <p className="text-sm text-muted-foreground">50 ký tự đầu</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Usage Example */}
      <Card>
        <CardHeader>
          <CardTitle>💻 Usage Example</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="overflow-x-auto rounded-lg bg-muted p-4 text-sm">
            <code>{`import { StaticEditorView } from '@/components/editor/static-editor-view';
import { getRandomNovelContent() } from '@/lib/api/mock';

function NovelChapter() {
  return (
    <div>
      {/* Full view */}
      <StaticEditorView content={getRandomNovelContent()} />

      {/* Compact view */}
      <StaticEditorView content={getRandomNovelContent()} variant="compact" />

      {/* Full width view */}
      <StaticEditorView content={getRandomNovelContent()} variant="fullWidth" />

      {/* Compact preview with max lines */}
      <CompactEditorView content={getRandomNovelContent()} maxLines={3} />
    </div>
  );
}`}</code>
          </pre>
        </CardContent>
      </Card>
    </div>
  );
}
