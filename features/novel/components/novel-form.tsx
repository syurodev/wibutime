"use client";

import { BasicEditor } from "@/components/ui/basic-editor";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileUploader } from "@/components/ui/file-uploader";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LanguageSelect } from "@/components/ui/language-select";
import { MultiSelect } from "@/components/ui/multi-select";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { createArtist } from "@/features/artist/actions";
import { createAuthor } from "@/features/author/actions";
import { createGenre } from "@/features/genre/actions";
import { useArtists } from "@/hooks/use-artists";
import { useAuthors } from "@/hooks/use-authors";
import { useGenres } from "@/hooks/use-genres";
import { Link } from "@/i18n/routing";
import { ArrowLeft, Save } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export interface NovelFormData {
  title: string;
  original_title?: string;
  original_language: string;
  synopsis: any;
  cover_url: string;
  status: string;
  is_oneshot: boolean;
  genre_ids: string[];
  author_ids: string[];
  artist_ids: string[];
}

interface NovelFormProps {
  readonly initialData?: NovelFormData;
  readonly isSubmitting: boolean;
  readonly onSubmit: (data: NovelFormData) => Promise<void>;
  readonly backUrl: string;
  readonly title: string;
  readonly description?: string;
  readonly ownerInfo?: React.ReactNode;
  readonly submitLabel?: string;
  readonly initialSelectedGenres?: { label: string; value: string }[];
  readonly initialSelectedAuthors?: { label: string; value: string }[];
  readonly initialSelectedArtists?: { label: string; value: string }[];
}

export function NovelForm({
  initialData,
  onSubmit,
  isSubmitting,
  backUrl,
  title,
  description,
  ownerInfo,
  submitLabel = "Lưu thay đổi",
  initialSelectedGenres = [],
  initialSelectedAuthors = [],
  initialSelectedArtists = [],
}: NovelFormProps) {
  const [formData, setFormData] = useState<NovelFormData>(
    initialData || {
      title: "",
      original_title: "",
      original_language: "vi",
      synopsis: "",
      cover_url: "",
      status: "draft",
      is_oneshot: false,
      genre_ids: [],
      author_ids: [],
      artist_ids: [],
    }
  );

  // Search states
  const [genreSearch, setGenreSearch] = useState("");
  const [authorSearch, setAuthorSearch] = useState("");
  const [artistSearch, setArtistSearch] = useState("");

  const {
    data: genres = [],
    loadMore: loadMoreGenres,
    hasMore: hasMoreGenres,
    isLoadingMore: isLoadingMoreGenres,
  } = useGenres(genreSearch);
  const {
    data: authors = [],
    loadMore: loadMoreAuthors,
    hasMore: hasMoreAuthors,
    isLoadingMore: isLoadingMoreAuthors,
  } = useAuthors(authorSearch);
  const {
    data: artists = [],
    loadMore: loadMoreArtists,
    hasMore: hasMoreArtists,
    isLoadingMore: isLoadingMoreArtists,
  } = useArtists(artistSearch);

  // Selected items state (for UI display)
  // TODO: If initialData has IDs, we need to fetch their names or pass full objects in initialData
  // For now, we assume initialData is mostly for edit, and we might need to handle that separately
  // But for create, it starts empty.
  const [selectedGenres, setSelectedGenres] = useState<
    { label: string; value: string }[]
  >(initialSelectedGenres);
  const [selectedAuthors, setSelectedAuthors] = useState<
    { label: string; value: string }[]
  >(initialSelectedAuthors);
  const [selectedArtists, setSelectedArtists] = useState<
    { label: string; value: string }[]
  >(initialSelectedArtists);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("NovelForm: handleSubmit triggered");
    console.log("NovelForm: formData", formData);
    console.log("NovelForm: selectedGenres", selectedGenres);

    await onSubmit({
      ...formData,
      genre_ids: selectedGenres.map((i) => i.value),
      author_ids: selectedAuthors.map((i) => i.value),
      artist_ids: selectedArtists.map((i) => i.value),
    });
  };

  const handleCreateGenre = async (name: string) => {
    try {
      const newGenre = await createGenre({ name });
      setSelectedGenres((prev) => [
        ...prev,
        { label: newGenre.name, value: newGenre.id },
      ]);
      toast.success(`Đã tạo thể loại: ${newGenre.name}`);
    } catch (error: any) {
      toast.error(error.message || "Lỗi khi tạo thể loại");
      console.error("Create genre error:", error);
    }
  };

  const handleCreateAuthor = async (name: string) => {
    try {
      const newAuthor = await createAuthor({ name });
      setSelectedAuthors((prev) => [
        ...prev,
        { label: newAuthor.name, value: newAuthor.id },
      ]);
      toast.success(`Đã tạo tác giả: ${newAuthor.name}`);
    } catch (error: any) {
      toast.error(error.message || "Lỗi khi tạo tác giả");
      console.error("Create author error:", error);
    }
  };

  const handleCreateArtist = async (name: string) => {
    try {
      const newArtist = await createArtist({ name });
      setSelectedArtists((prev) => [
        ...prev,
        { label: newArtist.name, value: newArtist.id },
      ]);
      toast.success(`Đã tạo họa sĩ: ${newArtist.name}`);
    } catch (error: any) {
      toast.error(error.message || "Lỗi khi tạo họa sĩ");
      console.error("Create artist error:", error);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <Button asChild variant="ghost" size="sm" className="mb-4">
          <Link href={backUrl}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Quay lại
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">{title}</h1>
        {description && (
          <p className="text-muted-foreground mt-1">{description}</p>
        )}
      </div>

      <form onSubmit={handleSubmit}>
        <div className="space-y-8">
          {ownerInfo && (
            <div className="rounded-lg bg-muted p-4 w-full">{ownerInfo}</div>
          )}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Cover Image & Status */}
            <div className="lg:col-span-1 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Ảnh bìa</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <FileUploader
                      value={formData.cover_url}
                      onValueChange={(url) =>
                        setFormData({ ...formData, cover_url: url })
                      }
                      type="novel"
                      className="w-full max-w-[240px] mx-auto lg:mx-0"
                    />
                    <p className="text-xs text-muted-foreground text-center lg:text-left">
                      Kích thước khuyến nghị: 600x900px
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Trạng thái</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="status">Tình trạng phát hành</Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value) =>
                        setFormData({ ...formData, status: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn trạng thái" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Bản nháp (Draft)</SelectItem>
                        <SelectItem value="ongoing">
                          Đang tiến hành (Ongoing)
                        </SelectItem>
                        <SelectItem value="completed">
                          Đã hoàn thành (Completed)
                        </SelectItem>
                        <SelectItem value="hiatus">
                          Tạm ngưng (Hiatus)
                        </SelectItem>
                        <SelectItem value="dropped">
                          Đã hủy (Dropped)
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
                    <div className="space-y-0.5">
                      <Label htmlFor="is_oneshot">Oneshot</Label>
                      <p className="text-xs text-muted-foreground">
                        Novel chỉ có 1 chương duy nhất
                      </p>
                    </div>
                    <Switch
                      id="is_oneshot"
                      checked={formData.is_oneshot}
                      onCheckedChange={(checked) =>
                        setFormData({ ...formData, is_oneshot: checked })
                      }
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column: Form Fields */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Thông tin chi tiết</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Title */}
                  <div className="space-y-2">
                    <Label htmlFor="title">
                      Tiêu đề <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                      placeholder="Nhập tiêu đề novel..."
                      required
                    />
                  </div>

                  {/* Original Title */}
                  <div className="space-y-2">
                    <Label htmlFor="original_title">Tiêu đề gốc</Label>
                    <Input
                      id="original_title"
                      value={formData.original_title || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          original_title: e.target.value,
                        })
                      }
                      placeholder="Nhập tiêu đề gốc (nếu có)..."
                    />
                  </div>

                  {/* Original Language */}
                  <div className="space-y-2">
                    <Label htmlFor="original_language">
                      Ngôn ngữ gốc <span className="text-destructive">*</span>
                    </Label>
                    <LanguageSelect
                      value={formData.original_language}
                      onValueChange={(value) =>
                        setFormData({ ...formData, original_language: value })
                      }
                      placeholder="Chọn ngôn ngữ"
                    />
                  </div>

                  {/* Genres */}
                  <div className="space-y-2">
                    <Label>Thể loại</Label>
                    <MultiSelect
                      options={genres.map((g) => ({
                        label: g.name,
                        value: g.id,
                      }))}
                      selected={selectedGenres}
                      onChange={(val) => {
                        setSelectedGenres(val);
                      }}
                      placeholder="Chọn thể loại..."
                      onSearch={setGenreSearch}
                      onLoadMore={loadMoreGenres}
                      hasMore={hasMoreGenres}
                      loading={isLoadingMoreGenres}
                      onCreate={handleCreateGenre}
                    />
                  </div>

                  {/* Authors */}
                  <div className="space-y-2">
                    <Label>Tác giả</Label>
                    <MultiSelect
                      options={authors.map((a) => ({
                        label: a.name,
                        value: a.id,
                      }))}
                      selected={selectedAuthors}
                      onChange={setSelectedAuthors}
                      placeholder="Chọn tác giả..."
                      onSearch={setAuthorSearch}
                      onLoadMore={loadMoreAuthors}
                      hasMore={hasMoreAuthors}
                      loading={isLoadingMoreAuthors}
                      onCreate={handleCreateAuthor}
                    />
                  </div>

                  {/* Artists */}
                  <div className="space-y-2">
                    <Label>Họa sĩ</Label>
                    <MultiSelect
                      options={artists.map((a) => ({
                        label: a.name,
                        value: a.id,
                      }))}
                      selected={selectedArtists}
                      onChange={setSelectedArtists}
                      placeholder="Chọn họa sĩ..."
                      onSearch={setArtistSearch}
                      onLoadMore={loadMoreArtists}
                      hasMore={hasMoreArtists}
                      loading={isLoadingMoreArtists}
                      onCreate={handleCreateArtist}
                    />
                  </div>

                  {/* Synopsis */}
                  <div className="space-y-2">
                    <Label htmlFor="synopsis">Tóm tắt</Label>
                    <BasicEditor
                      value={formData.synopsis}
                      onChange={(value) =>
                        setFormData({ ...formData, synopsis: value })
                      }
                      placeholder="Nhập tóm tắt nội dung..."
                    />
                    <p className="text-xs text-muted-foreground">
                      Tóm tắt ngắn gọn về nội dung novel
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 mt-6">
          <Button type="button" variant="outline" asChild>
            <Link href={backUrl}>Hủy</Link>
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              "Đang xử lý..."
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                {submitLabel}
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
