import type {Value} from "platejs";

export interface PendingImageEntry {
  file: File;
  previewUrl: string;
  name: string;
  size: number;
  type: string;
}

export type PendingImageMap = Record<string, PendingImageEntry>;

export type UploadImageFn = (file: File, entry: PendingImageEntry) => Promise<string>;

export interface ResolveImageResult {
  value: Value;
  uploaded: Record<string, string>;
  unresolved: string[];
}

const cloneValue = (value: Value): Value => {
  if (typeof structuredClone === "function") {
    return structuredClone(value);
  }
  return JSON.parse(JSON.stringify(value)) as Value;
};

export async function resolvePendingImages(
  editorValue: Value,
  pendingImages: PendingImageMap,
  uploadImage: UploadImageFn,
): Promise<ResolveImageResult> {
  const valueClone = cloneValue(editorValue);
  const uploaded: Record<string, string> = {};
  const unresolved: string[] = [];
  const cache = new Map<string, string>();

  const processNodes = async (nodes: Value) => {
    for (const node of nodes as any[]) {
      if (node?.type === "image" && typeof node.pendingId === "string") {
        const pendingId: string = node.pendingId;
        const entry = pendingImages[pendingId];

        if (!entry) {
          unresolved.push(pendingId);
        } else {
          if (!cache.has(pendingId)) {
            const url = await uploadImage(entry.file, entry);
            cache.set(pendingId, url);
            uploaded[pendingId] = url;
          }
          const resolvedUrl = cache.get(pendingId)!;
          node.url = resolvedUrl;
          node.status = "uploaded";
          delete node.pendingId;
        }
      }

      if (Array.isArray(node?.children)) {
        await processNodes(node.children as Value);
      }
    }
  };

  await processNodes(valueClone);

  return {
    value: valueClone,
    uploaded,
    unresolved,
  };
}

export function collectPendingImageIds(value: Value): Set<string> {
  const ids = new Set<string>();

  const visit = (nodes: Value) => {
    for (const node of nodes as any[]) {
      if (node?.type === "image" && typeof node.pendingId === "string") {
        ids.add(node.pendingId);
      }
      if (Array.isArray(node?.children)) {
        visit(node.children as Value);
      }
    }
  };

  visit(value);
  return ids;
}
