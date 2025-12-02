import { NovelVolume } from "./models/content/novel";
import { StandardResponse } from "./types";
import api from "./utils/fetch";

// List volumes response wrapper
export interface ListVolumesResponse {
  novel_id: string;
  novel_title: string;
  volumes: NovelVolume[];
}

export interface CreateVolumeRequest {
  title: string;
  description?: string;
  cover_image_url?: string;
  display_order?: number;
  is_published?: boolean;
}

export interface UpdateVolumeRequest {
  volume_number?: number;
  title?: string;
  description?: string;
  cover_image_url?: string;
  display_order?: number;
  is_published?: boolean;
}

export async function getVolumesByNovel(
  novelId: string
): Promise<StandardResponse<ListVolumesResponse>> {
  return api.get(`/novels/${novelId}/volumes`);
}

export async function createVolume(
  novelId: string,
  data: CreateVolumeRequest
): Promise<StandardResponse<NovelVolume>> {
  // Pass novel_id in body as well for robustness, though backend prioritizes URL
  return api.post(`/novels/${novelId}/volumes`, { ...data, novel_id: novelId });
}

export async function getVolume(
  id: string
): Promise<StandardResponse<NovelVolume>> {
  return api.get(`/novels/volumes/${id}`);
}

export async function updateVolume(
  id: string,
  data: UpdateVolumeRequest
): Promise<StandardResponse<NovelVolume>> {
  return api.put(`/novels/volumes/${id}`, data);
}

export async function deleteVolume(
  id: string
): Promise<StandardResponse<void>> {
  return api.delete(`/novels/volumes/${id}`);
}

export async function updateVolumeDisplayOrder(
  id: string,
  displayOrder: number
): Promise<StandardResponse<void>> {
  return api.put(`/novels/volumes/${id}/display-order`, {
    display_order: displayOrder,
  });
}

export async function publishVolume(
  id: string
): Promise<StandardResponse<void>> {
  return api.post(`/novels/volumes/${id}/publish`, {});
}

export async function unpublishVolume(
  id: string
): Promise<StandardResponse<void>> {
  return api.post(`/novels/volumes/${id}/unpublish`, {});
}
