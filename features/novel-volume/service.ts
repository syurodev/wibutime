import { type StandardResponse, isSuccessResponse } from "@/lib/api/types";
import { api } from "@/lib/api/utils/fetch";
import type {
  CreateVolumeRequest,
  ListVolumesResponse,
  NovelVolume,
  UpdateVolumeRequest,
} from "./types";

/**
 * Novel Volume Service - Universal API calls
 */
export const NovelVolumeService = {
  async getByNovel(novelId: string): Promise<ListVolumesResponse> {
    const response = await api.get<StandardResponse<ListVolumesResponse>>(
      `/novels/${novelId}/volumes`
    );
    if (!isSuccessResponse(response)) throw new Error(response.message);
    return response.data!;
  },

  async create(
    novelId: string,
    data: CreateVolumeRequest
  ): Promise<NovelVolume> {
    // Pass novel_id in body as well for robustness
    const response = await api.post<StandardResponse<NovelVolume>>(
      `/novels/${novelId}/volumes`,
      { ...data, novel_id: novelId }
    );
    if (!isSuccessResponse(response)) throw new Error(response.message);
    return response.data!;
  },

  async get(id: string): Promise<NovelVolume> {
    const response = await api.get<StandardResponse<NovelVolume>>(
      `/novels/volumes/${id}`
    );
    if (!isSuccessResponse(response)) throw new Error(response.message);
    return response.data!;
  },

  async update(id: string, data: UpdateVolumeRequest): Promise<NovelVolume> {
    const response = await api.put<StandardResponse<NovelVolume>>(
      `/novels/volumes/${id}`,
      data
    );
    if (!isSuccessResponse(response)) throw new Error(response.message);
    return response.data!;
  },

  async delete(id: string): Promise<void> {
    const response = await api.delete<StandardResponse<void>>(
      `/novels/volumes/${id}`
    );
    if (!isSuccessResponse(response)) throw new Error(response.message);
  },

  async updateDisplayOrder(id: string, displayOrder: number): Promise<void> {
    await api.put(`/novels/volumes/${id}/display-order`, {
      display_order: displayOrder,
    });
  },

  async publish(id: string): Promise<void> {
    await api.post(`/novels/volumes/${id}/publish`, {});
  },

  async unpublish(id: string): Promise<void> {
    await api.post(`/novels/volumes/${id}/unpublish`, {});
  },
};
