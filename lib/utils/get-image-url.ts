export function getImageUrl(src: string | null | undefined) {
  if (!src) return "";
  if (src.startsWith("http")) return src;
  const domain = process.env.NEXT_PUBLIC_IMAGE_DOMAIN;
  if (!domain) return src; // Fallback to src if domain not configured
  return `${domain}/${src}`;
}
