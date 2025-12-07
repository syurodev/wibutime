import { type StandardResponse, isSuccessResponse } from "@/lib/api/types";
import { api } from "@/lib/api/utils/fetch";
import type {
  ChapterStatistics,
  CreateChapterRequest,
  ListChaptersResponse,
  NovelChapter,
  UpdateChapterRequest,
} from "./types";

/**
 * Chapter Service - Universal API calls
 */
export const ChapterService = {
  async getByVolume(volumeId: string): Promise<ListChaptersResponse> {
    const response = await api.get<StandardResponse<ListChaptersResponse>>(
      `/novels/volumes/${volumeId}/chapters`
    );
    if (!isSuccessResponse(response)) throw new Error(response.message);
    return response.data!;
  },

  async create(
    volumeId: string,
    data: CreateChapterRequest
  ): Promise<NovelChapter> {
    const response = await api.post<StandardResponse<NovelChapter>>(
      `/novels/volumes/${volumeId}/chapters`,
      data
    );
    if (!isSuccessResponse(response)) throw new Error(response.message);
    return response.data!;
  },

  async get(id: string): Promise<NovelChapter> {
    const response = await api.get<StandardResponse<NovelChapter>>(
      `/novels/chapters/${id}`
    );
    if (!isSuccessResponse(response)) throw new Error(response.message);
    return response.data!;
  },

  async update(id: string, data: UpdateChapterRequest): Promise<NovelChapter> {
    const response = await api.put<StandardResponse<NovelChapter>>(
      `/novels/chapters/${id}`,
      data
    );
    if (!isSuccessResponse(response)) throw new Error(response.message);
    return response.data!;
  },

  async delete(id: string): Promise<void> {
    const response = await api.delete<StandardResponse<void>>(
      `/novels/chapters/${id}`
    );
    if (!isSuccessResponse(response)) throw new Error(response.message);
  },

  async incrementView(id: string): Promise<void> {
    await api.post(`/novels/chapters/${id}/view`, {});
  },

  async publish(id: string): Promise<void> {
    await api.post(`/novels/chapters/${id}/publish`, {});
  },

  async schedule(id: string, scheduledAt: string): Promise<void> {
    await api.post(`/novels/chapters/${id}/schedule`, {
      scheduled_at: scheduledAt,
    });
  },

  async updateStatistics(id: string, stats: ChapterStatistics): Promise<void> {
    await api.put(`/novels/chapters/${id}/statistics`, stats);
  },
};
