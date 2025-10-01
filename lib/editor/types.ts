import type { Value } from 'platejs';

export interface PendingImageEntry {
  file: File;
  previewUrl: string;
  name: string;
  size: number;
  type: string;
}

export type PendingImageMap = Record<string, PendingImageEntry>;

export interface EditorImageNode {
  id: string;
  type: 'image';
  url: string;
  alt?: string;
  status: 'pending' | 'uploaded' | 'error';
  pendingId?: string;
  children: Array<{ text: string }>;
}

export interface EditorProps {
  id?: string;
  initialValue?: Value;
  onChange?: (value: Value) => void;
  onPendingImagesChange?: (images: PendingImageMap) => void;
  readOnly?: boolean;
  placeholder?: string;
  className?: string;
  editorClassName?: string;
  valueOverride?: Value;
}

export interface UploadResult {
  url: string;
  key: string;
}