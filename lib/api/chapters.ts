import { NovelChapter } from "./models/content/novel";
import { StandardResponse } from "./types";
import api from "./utils/fetch";

export interface CreateChapterRequest {
  chapter_number: number;
  title: string;
  content: any;
  author_notes?: any;
  is_free?: boolean;
  price?: number;
  currency?: string;
  status?: string;
  display_order?: number;
  scheduled_at?: string;
}

export interface UpdateChapterRequest extends Partial<CreateChapterRequest> {
  volume_id?: string;
}

export interface ChapterStatistics {
  view_count?: number;
  like_count?: number;
  comment_count?: number;
}

export interface ListChaptersResponse {
  volume_id: string;
  volume_title: string;
  chapters: NovelChapter[];
}

export async function getChaptersByVolume(
  volumeId: string
): Promise<StandardResponse<ListChaptersResponse>> {
  return api.get(`/novels/volumes/${volumeId}/chapters`);
}

export async function createChapter(
  volumeId: string,
  data: CreateChapterRequest
): Promise<StandardResponse<NovelChapter>> {
  return api.post(`/novels/volumes/${volumeId}/chapters`, data);
}

export async function getChapter(
  id: string
): Promise<StandardResponse<NovelChapter>> {
  return api.get(`/novels/chapters/${id}`);
}

export async function updateChapter(
  id: string,
  data: UpdateChapterRequest
): Promise<StandardResponse<NovelChapter>> {
  return api.put(`/novels/chapters/${id}`, data);
}

export async function deleteChapter(
  id: string
): Promise<StandardResponse<void>> {
  return api.delete(`/novels/chapters/${id}`);
}

export async function incrementChapterView(
  id: string
): Promise<StandardResponse<void>> {
  return api.post(`/novels/chapters/${id}/view`, {});
}

export async function publishChapter(
  id: string
): Promise<StandardResponse<void>> {
  return api.post(`/novels/chapters/${id}/publish`, {});
}

export async function scheduleChapter(
  id: string,
  scheduledAt: string
): Promise<StandardResponse<void>> {
  return api.post(`/novels/chapters/${id}/schedule`, {
    scheduled_at: scheduledAt,
  });
}

export async function updateChapterStatistics(
  id: string,
  stats: ChapterStatistics
): Promise<StandardResponse<void>> {
  return api.put(`/novels/chapters/${id}/statistics`, stats);
}
